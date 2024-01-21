import express, { Request, Response } from 'express';
import {Encrypt} from '../encrypt/encrypt'
const loginRoute = express();
import Users, { IUser } from '../schemas/users';

loginRoute.post('/',async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const result = await Users.findOne({'email': email});
    if (result != null) {
        const pwPlain = await Encrypt.comparePassword(password,result.password);
        if (pwPlain) {
            result.password = ""
            res.send(result);
            return;
        }
        res.send("invalid password");
        return;
    }
    res.send("user not found");
});

export default loginRoute;