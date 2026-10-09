import { Router } from 'express';
import { pool } from '../config/db';

const router = Router();

// GET: Listar categorías
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categorias');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// POST: Crear una categoría nueva
router.post('/', async (req, res) => {
    try {
        const { nombre } = req.body;
        
        await pool.query(
            'INSERT INTO categorias (nombre) VALUES (?)',
            [nombre]
        );

        res.json({ message: '¡Categoría creada con éxito!' });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;