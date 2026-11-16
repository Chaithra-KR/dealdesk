
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.model";

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  })
    .select("+password")
    .populate("roleId");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    { sub: user._id.toString() },
    secret,
    { expiresIn: "1d" }
  );

  const userData = user.toObject() as any;
  delete userData.password;

  return {
    token,
    user: userData,
  };
};
