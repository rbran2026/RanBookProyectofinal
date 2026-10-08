import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/db'; // Importar la conexión
import authRoutes from './routes/authroutes';
import materialRoutes from "./routes/materialroutes"

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/material', materialRoutes);

// Endpoint de salud (Health Check)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API funcionando correctamente', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});