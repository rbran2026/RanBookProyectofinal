import { Router } from 'express';
import { pool } from '../config/db'; // Ajusta la ruta de tu conexión a MySQL

const router = Router();

// GET: Listar todos los materiales
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM materiales');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener materiales:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST: Crear un material nuevo
router.post('/', async (req, res) => {
    try {
        const { titulo, descripcion, estado, usuario_id, categoria_id } = req.body;
        
        await pool.query(
            'INSERT INTO materiales (titulo, descripcion, estado, usuario_id, categoria_id) VALUES (?, ?, ?, ?, ?)',
            [titulo, descripcion, estado, usuario_id, categoria_id]
        );

        res.json({ message: '¡Material guardado con éxito!' });
    } catch (error) {
        console.error('Error al guardar material:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;