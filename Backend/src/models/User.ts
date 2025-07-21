import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { hashPassword, verifyPassword } from "../services/PasswordService";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(plainPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await hashPassword(this.password);
});

UserSchema.methods.comparePassword = async function (
  plainPassword: string
): Promise<boolean> {
  return await verifyPassword(plainPassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
