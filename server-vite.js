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

app.get('/one', (req, res, next) => {
  fsPromises.readFile('./one.txt') // arbitrary file
    .then(data => res.send(data))
    .catch(err => next(err)) // passing error to custom middleware
})

app.use((error, req, res, next) => {
  console.log("Error Handling Middleware called")
  console.log('Path: ', req.path)
  console.error('Error: ', error)

  // if (error.type == 'redirect')
  //   res.redirect('/error')

  // else if (error.type == 'time-out') // arbitrary condition check
  //   res.status(408).send(error)
  // else
  //   res.status(500).send(error)
})

export const handler = app;