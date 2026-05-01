import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import globalRouter from './routes/index'
import { swaggerSpec } from './swagger';
import { globalErrorHandler, notFound } from './middleware/errorMiddleware';

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.set('query parser', 'extended');

app.use('/api/v1',globalRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.all('*', notFound);
app.use(globalErrorHandler);


