import express, { Request, Response } from 'express';
const recoveryRoute = express();
import dotenv from 'dotenv';
import {Encrypt} from '../encrypt/encrypt'
var nodemailer = require('nodemailer');
import Users, { IUser } from '../schemas/users';
import {v4 as uuidv4} from 'uuid';

recoveryRoute.use(express.json());
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


recoveryRoute.post('/',async (req: Request, res: Response) => {
    const email = req.body.email;
    const user = await Users.findOne({'email': email});
    if (user != null) {
        let myuuid = uuidv4();
        user.resetPasswordToken = myuuid;
        user.save();
        var mailOptions = {
            from: `API LOGIN ⚙️ <${Myemail}>`,
            to: email,
            subject: 'password reset ✔',
            html: `<a target='_blank' href='${host}/recovery/verify/${myuuid}'>
                              <strong class='font-medium'>reset password</strong>  
                          </a>
                          <br> ||
                          <a target='_blank' href='${host}/recovery/delete/${myuuid}'>
                              <strong class='font-medium'>delete request</strong>  
                          </a>`
            };
            
        transporter.sendMail(mailOptions);
        res.send("email sent");
        return;
    }
    res.send("user not found");
});

recoveryRoute.get('/verify/:token',async (req: Request, res: Response) => {
    res.render("password-recovery", {token:req.params.token});
})
recoveryRoute.get('/delete/:token',async (req: Request, res: Response) => {
    const token = req.params.token;
    const user = await Users.findOne({'resetPasswordToken': token});
    if (user != null && user.resetPasswordToken != "") {
        user.resetPasswordToken = "";
        user.save();
        res.send("Token deleted");
        return;
    }
    res.send("bad request");
})

recoveryRoute.post('/reset',async (req: Request, res: Response) => {
    const token = req.body.token;
    const user = await Users.findOne({'resetPasswordToken': token});
    if (user != null && user.resetPasswordToken != "" && req.body.password != "") {
        user.resetPasswordToken = "";
        const myEncryptPassword = await Encrypt.cryptPassword(req.body.password);
        user.password = myEncryptPassword;
        user.updatedAt = new Date;
        user.save();
        res.send(user);
        return;
    }
    res.send("bad request");
})

export default recoveryRoute;