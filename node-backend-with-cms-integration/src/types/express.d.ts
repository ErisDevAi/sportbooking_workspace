/**
 * types/express.d.ts
 *
 * Augment Express.Request with the decoded JWT payload
 * attached by the authenticate middleware.
 */

import { JwtPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
