import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import deepSeekRouter from './routes/deepSeek';

const app: express.Application = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/deepseek', deepSeekRouter);

export default app;
