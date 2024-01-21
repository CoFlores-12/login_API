import express, { Request, Response } from 'express';
import {Encrypt} from '../encrypt/encrypt'
var nodemailer = require('nodemailer');
const signRoute = express();
import dotenv from 'dotenv';
import Users, { IUser } from '../schemas/users';

signRoute.use(express.json());
dotenv.config();
const Myemail = process.env.EMAIL_ADDRESS || '';
const Mypassword = process.env.PASSWORD_EMAIL || '';
const host = process.env.HOST || 'http://localhost:3000';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: Myemail,
      pass: Mypassword,
    },
  });


signRoute.post('/', async (req: Request, res: Response) => {
    
    const myEncryptPassword = await Encrypt.cryptPassword(req.body.password);
    const user = new Users({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: myEncryptPassword
      });
    user.save();
   
      
    var mailOptions = {
      from: `API LOGIN ⚙️ <${Myemail}>`,
      to: req.body.email,
      subject: 'email verification ✔',
      html: `<a target='_blank' href='${host}/sign/verified?id=${user._id}'>
                        <strong class='font-medium'>Verificar correo</strong>  
                    </a>`
      };
      
    transporter.sendMail(mailOptions);
    res.send(user);
});

signRoute.get('/verified',async (req: Request, res: Response) => {
   const filter = { _id: req.query.id };
   const options = { upsert: false };
   const updateDoc = {
     $set: {
      isVerified: true,
      updatedAt: new Date
     },
   };
  const result = await Users.updateOne(filter, updateDoc, options);
  //res.send(result);
  res.redirect('/')
})
export default signRoute;