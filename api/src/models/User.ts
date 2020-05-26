import { Document, Model, model, Schema, Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "config";
import Joi from "@hapi/joi";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  employeeId: number;
  password: string;
  isManager: boolean;
  reportTo: Types.ObjectId | IUser;
  generateAuthToken(): string;
}

export interface IUserModel extends Model<IUser> {
  findByCredentials(employeeId: number, password: string): Promise<IUser>;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    lowercase: true,
  },
  employeeId: {
    type: Number,
    unique: true,
    required: true,
    min: 1,
    max: 9999,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  isManager: {
    type: Boolean,
    default: false,
  },
  reportTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

userSchema.methods.generateAuthToken = function () {
  const user = this;

  const token = jwt.sign(
    { _id: user._id.toString(), isManager: user.isManager },
    config.get("jwtPrivateKey")
  );

  return token;
};

userSchema.statics.findByCredentials = async (
  employeeId: number,
  password: string
) => {
  const user = await User.findOne({ employeeId });

  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return null;
  }

  return user;
};

userSchema.pre<IUser>("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});

const User = model<IUser, IUserModel>("User", userSchema);

const validateUser = (user: IUser) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    employeeId: Joi.number().min(1).max(9999).required(),
    password: Joi.string().min(5).max(255).required(),
    isManager: Joi.boolean().required(),
    reportTo: Joi.string(),
  });

  return (
    schema.validate(user).error &&
    schema.validate(user).error!.details[0].message
  );
};

const validateLogin = (user: IUser) => {
  const schema = Joi.object({
    employeeId: Joi.number().min(1).max(9999).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return (
    schema.validate(user).error &&
    schema.validate(user).error!.details[0].message
  );
};

export { User, validateUser, validateLogin };
