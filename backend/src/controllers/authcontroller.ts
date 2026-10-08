import { Request, Response } from 'express';
import { pool } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registrar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, email, password, institucion, ciudad, telefono } = req.body;
        
        // Verificar si el usuario ya existe
        const [existing]: any = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) {
            res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
            return;
        }

        // Hash seguro de contraseña (RF 02)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol, institucion, ciudad, telefono) VALUES (?, ?, ?, "usuario", ?, ?, ?)',
            [nombre, email, hashedPassword, institucion, ciudad, telefono]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor al registrar usuario.' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const [rows]: any = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) {
            res.status(400).json({ error: 'Credenciales inválidas.' });
            return;
        }

        const usuario = rows[0];
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            res.status(400).json({ error: 'Credenciales inválidas.' });
            return;
        }

        const secret = process.env.JWT_SECRET || 'secreto';
        const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, secret, { expiresIn: '8h' });

        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor al iniciar sesión.' });
    }
};