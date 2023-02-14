import express from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './src/server/swagger/swagger_output.json';
import cors from 'cors';
import bodyParser from 'body-parser';
import indexRouter from './src/server/routes/index';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).send("Api Test");
});

app.use('/api', indexRouter);

export const handler = app;