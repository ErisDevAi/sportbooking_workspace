/**
 * utils/jwt.ts — sign and verify JWTs.
 */
import jwt from "jsonwebtoken";
import { env } from "../configs/env";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
