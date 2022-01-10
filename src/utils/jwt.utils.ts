import jwt from "jsonwebtoken";
import config from "config";
import fs from "fs";

const privateKey = fs.readFileSync(__dirname + "/../../jwtRS256.key");
const publicKey = fs.readFileSync(__dirname + "/../../jwtRS256.key.pub");

export const signJwt = (object: {}, options?: jwt.SignOptions | undefined) => {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);

    return { valid: true, expired: false, decoded };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};
