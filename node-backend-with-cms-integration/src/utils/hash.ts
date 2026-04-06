/**
 * utils/hash.ts — bcrypt password helpers.
 */
import bcrypt from "bcryptjs";
import { env } from "../configs/env";

export const hashPassword  = (p: string) => bcrypt.hash(p, env.bcryptRounds);
export const comparePassword = (p: string, h: string) => bcrypt.compare(p, h);
