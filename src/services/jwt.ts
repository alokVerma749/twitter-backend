import JWT from "jsonwebtoken";
import { User } from "@prisma/client";
import { configDotenv } from "dotenv";

// Load environment variables
configDotenv();

class JWTServices {
  public static generateUserToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT secret is not defined");
    }

    // Set an expiration time for the token, e.g., 1 hour
    const token = JWT.sign(payload, secret, { expiresIn: '12h' });
    
    return token;
  }
}

export default JWTServices;
