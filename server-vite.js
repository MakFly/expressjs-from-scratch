import express from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './src/swagger/swagger_output.json';
import cors from 'cors';
import bodyParser from 'body-parser';
import indexRouter from './src/routes/index';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"))
app.use(bodyParser.json());

// api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).send("Api Test");
});

app.use('/api', indexRouter);

// Error
app.use("*", (err, req, res, next) => {
  console.log(err);
  next();
})

export const handler = app;