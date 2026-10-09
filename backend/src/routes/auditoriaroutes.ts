import { Router } from 'express';
import { pool } from '../config/db';

const router = Router();

// GET: Listar registros de auditoría
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM auditoria');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener registros de auditoría:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;