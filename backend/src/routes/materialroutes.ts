import { Router } from 'express';
import { obtenerMateriales, crearMaterial, eliminarMaterial } from '../controllers/materialcontroller';
import { verificarToken } from '../middlewares/authmiddleware';

const router = Router();

router.get('/', obtenerMateriales);
router.post('/', verificarToken, crearMaterial);
router.delete('/:id', verificarToken, eliminarMaterial);

export default router;