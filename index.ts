import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
const path = require('path');
const bodyParser = require('body-parser');
import mongoose from 'mongoose';

import loginRoute from './routes/login'
import signRoute from './routes/sign'
import recoveryRoute from './routes/recovery'

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/frontend'));
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || '';
mongoose
  .connect(MONGO_URI, { retryWrites: true, w: 'majority' })
    .then(() => {
      console.log('Connected to mongoDB.');
    })
    .catch((error) => {
      console.error('Unable to connect.');
    });

app.use(express.json());
app.use(express.static('frontend'))
app.use( bodyParser.json() ); 
app.use(express.urlencoded({ 
    extended: true
})) 

//static routes
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '/frontend/index.html'));
});
app.get('/sign', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '/frontend/sign.html'));
});
app.get('/recovery-password', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '/frontend/recovery.html'));
});

app.use('/login', loginRoute);
app.use('/sign', signRoute);
app.use('/recovery', recoveryRoute);

//recovery route
app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
})
