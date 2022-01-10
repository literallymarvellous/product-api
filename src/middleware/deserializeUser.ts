import { verifyJwt } from "./../utils/jwt.utils";
import { NextFunction } from "express";
import { Response } from "express";
import { Request } from "express";
import { get } from "lodash";
import { reIssueAccessToken } from "../service/session.service";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, "headers.x-refresh");
  console.log("refresh", refreshToken);

  if (!accessToken) return next();

  const { decoded, expired } = verifyJwt(accessToken);
  console.log("decode", decoded);
  console.log("expire", expired);
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    console.log("new", newAccessToken);
    if (newAccessToken) {
      // Add the new acess token to the response header
      res.setHeader("x-access-token", newAccessToken);

      const { decoded } = verifyJwt(newAccessToken);
      console.log("decoded", decoded);
      res.locals.user = decoded;
    }
    return next();
  }

  next();
};

export default deserializeUser;
