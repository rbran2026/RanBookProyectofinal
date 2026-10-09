import { Router, Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db'; // AJUSTA: ruta y nombre con que exportas tu pool de mysql2/promise

const router = Router();

const uid = (req: Request): number | null => Number(req.header('x-usuario-id')) || null;

async function rolDe(req: Request): Promise<string | null> {
  const id = uid(req);
  if (!id) return null;
  const [rows] = await pool.query<RowDataPacket[]>('SELECT rol FROM usuarios WHERE id = ?', [id]);
  return rows[0]?.rol ?? null;
}

async function auditar(usuarioId: number | null, accion: string, tabla: string, registroId: number | null, descripcion: string) {
  try {
    await pool.query(
      'INSERT INTO auditoria_sistema (usuario_id, accion, tabla_afectada, registro_id, descripcion) VALUES (?,?,?,?,?)',
      [usuarioId, accion, tabla, registroId, descripcion]
    );
  } catch (e) {
    console.error('Error de auditoría:', e);
  }
}

/* ================= REGISTRO ================= */
router.post('/auth/registro', async (req: Request, res: Response) => {
  const { nombre, email, password, institucion, ciudad, telefono } = req.body ?? {};
  if (!nombre || !email || !password || !ciudad) {
    res.status(400).json({ mensaje: 'Nombre, correo, contraseña y ciudad son obligatorios.' });
    return;
  }
  const [existe] = await pool.query<RowDataPacket[]>('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (existe.length) {
    res.status(409).json({ mensaje: 'Ese correo ya está registrado.' });
    return;
  }
  const hash = await bcrypt.hash(String(password), 10);
  const [r] = await pool.query<ResultSetHeader>(
    'INSERT INTO usuarios (nombre, email, password, institucion, ciudad, telefono) VALUES (?,?,?,?,?,?)',
    [nombre, email, hash, institucion || null, ciudad, telefono || null]
  );
  await auditar(r.insertId, 'REGISTRO', 'usuarios', r.insertId, `Nuevo usuario: ${email}`);
  res.status(201).json({ mensaje: 'Cuenta creada correctamente.' });
});

/* ================= CATEGORÍAS ================= */
router.get('/categorias', async (_req: Request, res: Response) => {
  const [rows] = await pool.query('SELECT * FROM categorias ORDER BY nombre');
  res.json(rows);
});

router.post('/categorias', async (req: Request, res: Response) => {
  const rol = await rolDe(req);
  if (rol !== 'administrador' && rol !== 'moderador') {
    res.status(403).json({ mensaje: 'No tienes permiso para crear categorías.' });
    return;
  }
  const { nombre, descripcion } = req.body ?? {};
  if (!nombre) {
    res.status(400).json({ mensaje: 'El nombre es obligatorio.' });
    return;
  }
  try {
    const [r] = await pool.query<ResultSetHeader>(
      'INSERT INTO categorias (nombre, descripcion) VALUES (?,?)',
      [nombre, descripcion || null]
    );
    await auditar(uid(req), 'CREAR', 'categorias', r.insertId, `Categoría: ${nombre}`);
    res.status(201).json({ id: r.insertId });
  } catch (e: any) {
    if (e.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ mensaje: 'Esa categoría ya existe.' });
      return;
    }
    throw e;
  }
});

router.delete('/categorias/:id', async (req: Request, res: Response) => {
  const rol = await rolDe(req);
  if (rol !== 'administrador' && rol !== 'moderador') {
    res.status(403).json({ mensaje: 'No tienes permiso para eliminar categorías.' });
    return;
  }
  const id = Number(req.params.id);
  await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
  await auditar(uid(req), 'ELIMINAR', 'categorias', id, `Categoría eliminada #${id}`);
  res.json({ mensaje: 'Categoría eliminada.' });
});

/* ================= MATERIALES ================= */
router.get('/materiales', async (_req: Request, res: Response) => {
  const [rows] = await pool.query(
    `SELECT m.*, u.nombre AS propietario
     FROM materiales m JOIN usuarios u ON u.id = m.usuario_id
     ORDER BY m.creado_en DESC`
  );
  res.json(rows);
});

router.post('/materiales', async (req: Request, res: Response) => {
  const usuarioId = uid(req);
  const b = req.body ?? {};
  if (!usuarioId || !b.titulo) {
    res.status(400).json({ mensaje: 'Inicia sesión y escribe un título.' });
    return;
  }
  const [r] = await pool.query<ResultSetHeader>(
    `INSERT INTO materiales
     (usuario_id, titulo, autor, asignatura, nivel_academico, descripcion, estado_conservacion, tipo_intercambio, disponible, imagen_url)
     VALUES (?,?,?,?,?,?,?,?,1,?)`,
    [usuarioId, b.titulo, b.autor || null, b.asignatura || null, b.nivel_academico || null,
     b.descripcion || null, b.estado_conservacion || 'Buen Estado', b.tipo_intercambio || 'Intercambio', b.imagen_url || null]
  );
  await auditar(usuarioId, 'CREAR', 'materiales', r.insertId, `Material: ${b.titulo}`);
  res.status(201).json({ id: r.insertId });
});

router.delete('/materiales/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [m] = await pool.query<RowDataPacket[]>('SELECT usuario_id FROM materiales WHERE id = ?', [id]);
  if (!m.length) {
    res.status(404).json({ mensaje: 'Material no encontrado.' });
    return;
  }
  const rol = await rolDe(req);
  if (m[0].usuario_id !== uid(req) && rol !== 'administrador') {
    res.status(403).json({ mensaje: 'Solo el propietario o un administrador puede eliminarlo.' });
    return;
  }
  await pool.query('DELETE FROM materiales WHERE id = ?', [id]);
  await auditar(uid(req), 'ELIMINAR', 'materiales', id, `Material eliminado #${id}`);
  res.json({ mensaje: 'Material eliminado.' });
});

/* ================= SOLICITUDES ================= */
router.get('/solicitudes', async (req: Request, res: Response) => {
  const id = uid(req);
  const rol = await rolDe(req);
  const base = `SELECT s.id, s.material_id, s.solicitante_id, s.estado, s.fecha_solicitud,
                       m.titulo, m.usuario_id AS dueno_id, u.nombre AS solicitante
                FROM solicitudes s
                JOIN materiales m ON m.id = s.material_id
                JOIN usuarios u ON u.id = s.solicitante_id`;
  if (rol === 'administrador') {
    const [rows] = await pool.query(`${base} ORDER BY s.fecha_solicitud DESC`);
    res.json(rows);
    return;
  }
  const [rows] = await pool.query(
    `${base} WHERE s.solicitante_id = ? OR m.usuario_id = ? ORDER BY s.fecha_solicitud DESC`,
    [id, id]
  );
  res.json(rows);
});

router.post('/solicitudes', async (req: Request, res: Response) => {
  const usuarioId = uid(req);
  const materialId = Number(req.body?.material_id);
  if (!usuarioId || !materialId) {
    res.status(400).json({ mensaje: 'Datos incompletos.' });
    return;
  }
  const [m] = await pool.query<RowDataPacket[]>('SELECT usuario_id, disponible FROM materiales WHERE id = ?', [materialId]);
  if (!m.length) {
    res.status(404).json({ mensaje: 'Material no encontrado.' });
    return;
  }
  if (m[0].usuario_id === usuarioId) {
    res.status(400).json({ mensaje: 'No puedes solicitar tu propio material.' });
    return;
  }
  if (!m[0].disponible) {
    res.status(400).json({ mensaje: 'Este material ya no está disponible.' });
    return;
  }
  const [r] = await pool.query<ResultSetHeader>(
    'INSERT INTO solicitudes (material_id, solicitante_id) VALUES (?,?)',
    [materialId, usuarioId]
  );
  await auditar(usuarioId, 'CREAR', 'solicitudes', r.insertId, `Solicitud del material #${materialId}`);
  res.status(201).json({ id: r.insertId });
});

router.patch('/solicitudes/:id/estado', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const estado = req.body?.estado;
  if (!['Pendiente', 'Aceptada', 'Rechazada', 'Completada'].includes(estado)) {
    res.status(400).json({ mensaje: 'Estado no válido.' });
    return;
  }
  const [s] = await pool.query<RowDataPacket[]>(
    `SELECT s.material_id, m.usuario_id AS dueno_id
     FROM solicitudes s JOIN materiales m ON m.id = s.material_id WHERE s.id = ?`, [id]);
  if (!s.length) {
    res.status(404).json({ mensaje: 'Solicitud no encontrada.' });
    return;
  }
  const rol = await rolDe(req);
  if (s[0].dueno_id !== uid(req) && rol !== 'administrador') {
    res.status(403).json({ mensaje: 'Solo el dueño del material o un administrador puede cambiar el estado.' });
    return;
  }
  await pool.query('UPDATE solicitudes SET estado = ? WHERE id = ?', [estado, id]);
  if (estado === 'Completada') {
    await pool.query('UPDATE materiales SET disponible = 0 WHERE id = ?', [s[0].material_id]);
  }
  await auditar(uid(req), 'ACTUALIZAR', 'solicitudes', id, `Estado: ${estado}`);
  res.json({ mensaje: 'Estado actualizado.' });
});

/* ================= AUDITORÍA ================= */
router.get('/auditoria', async (req: Request, res: Response) => {
  if ((await rolDe(req)) !== 'administrador') {
    res.status(403).json({ mensaje: 'Solo administradores.' });
    return;
  }
  const [rows] = await pool.query(
    `SELECT a.*, u.nombre AS usuario
     FROM auditoria_sistema a LEFT JOIN usuarios u ON u.id = a.usuario_id
     ORDER BY a.fecha DESC LIMIT 200`
  );
  res.json(rows);
});

export default router;