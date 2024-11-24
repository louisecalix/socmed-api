import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config.js';
import path from 'path';

import v1 from './routes/v1/index.js';
import './core/database.js';
import morgan from 'morgan';

const app = express();
const port = 3001;
app.use(cors());

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use('/uploads',express.static(path.join(__dirname, '../../static/uploads')));

app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/v1',  v1);

app.listen(port, () => {
  console.log(`App and running at port ${port}...`)
});
