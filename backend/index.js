import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import hotelRoutes from './routes/hotelRoutes.js';
import { notFound, errorHandler } from './utils/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/hotels', hotelRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));