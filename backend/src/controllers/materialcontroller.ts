import { Request, Response } from 'express';
import { pool } from '../config/db';

export const obtenerMateriales = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, categoria_id, page = 1, limit = 10 } = req.query;
        let query = 'SELECT m.*, u.nombre as propietario, c.nombre as categoria FROM materiales m JOIN usuarios u ON m.usuario_id = u.id JOIN categorias c ON m.categoria_id = c.id WHERE m.disponible = TRUE';
        let params: any[] = [];

        if (search) {
            query += ' AND (m.titulo LIKE ? OR m.autor LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (categoria_id) {
            query += ' AND m.categoria_id = ?';
            params.push(categoria_id);
        }

        const [rows]: any = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los materiales.' });
    }
};

export const crearMaterial = async (req: any, res: Response): Promise<void> => {
    try {
        const usuario_id = req.user.id; // Obtenido del token JWT
        const { categoria_id, titulo, autor, estado_conservacion, tipo_intercambio } = req.body;

        await pool.query(
            'INSERT INTO materiales (usuario_id, categoria_id, titulo, autor, estado_conservacion, tipo_intercambio) VALUES (?, ?, ?, ?, ?, ?)',
            [usuario_id, categoria_id, titulo, autor, estado_conservacion, tipo_intercambio]
        );

        res.status(201).json({ message: 'Material publicado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el material.' });
    }
};

export const eliminarMaterial = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM materiales WHERE id = ?', [id]);
        res.json({ message: 'Material eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el material.' });
    }
};