import express from 'express';
import morgan from 'morgan';
import configRouters from './routes';
import errorHandler from './utils/errorHandler';


const app = express();
app.use(morgan("tiny"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

configRouters(app);

app.use(errorHandler) 

export default app;   