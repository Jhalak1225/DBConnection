// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import { users } from '../types/user';

// Extend Document to include IUser for Mongoose
export interface IUserModel extends users, Document {}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
    role: {
    type: String,
    enum: ['student', 'admin', 'teacher'], // restrict to known roles
    required: true
  }
}, { timestamps: true });

const UserModel = mongoose.model<IUserModel>('User', UserSchema);

export default UserModel;
