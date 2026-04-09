import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import moviesRoutes from './routes/moviesRoutes';
import sessionsRoutes from './routes/sessionsRoutes';

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/movies', moviesRoutes);
app.use('/api/sessions', sessionsRoutes);

app.get('/', (_req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
