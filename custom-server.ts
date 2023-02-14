import express, { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './src/swagger/swagger_output.json';
import cors from 'cors';
import bodyParser from 'body-parser';
import indexRouter from './src/routes/index';

class Server {

  private app: Application;
  private port: string;
  private indexRouter: any;

  constructor() {
    this.app = express();
    this.port = '3000';
    this.indexRouter = indexRouter;
    this.listen();
    this.routes();
  }

  listen() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    this.app.listen(this.port, () => {
      return console.log(`Express is listening at http://127.0.0.1:${this.port}`);
    });
  }

  routes() {
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).send("Api Test");
    });
    
    this.app.use('/api', this.indexRouter);
  }
}

new Server();