import express from 'express';
import morgan from 'morgan';
import globalRouter from './routes/index'

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.set('query parser', 'extended');

app.use('/api/v1',globalRouter);

