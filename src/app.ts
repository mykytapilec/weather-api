import express, { Application } from 'express';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weatherRoutes';

dotenv.config();

const app: Application = express();
app.use(express.json());

app.use('/weather', weatherRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Weather API running on port ${PORT}`);
});