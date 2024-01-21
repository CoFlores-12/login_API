import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isAdmin: boolean;
    isVerified: boolean;
    resetPasswordToken: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  resetPasswordToken: { type: String, required: false, default: ""},

  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },

});

export default mongoose.model<IUser>('UserLogin', UserSchema);