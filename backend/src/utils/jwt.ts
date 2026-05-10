import jwt from "jsonwebtoken";

export const generateToken = (payload: { id: number; login: string; role: string }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secret");
  } catch (error) {
    return null;
  }
};