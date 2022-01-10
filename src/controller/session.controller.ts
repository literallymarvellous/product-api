import config from "config";
import {
  createSession,
  findSessions,
  updateSession,
} from "./../service/session.service";
import { validatePassword } from "../service/user.service";
import { Request, Response } from "express";
import { signJwt } from "../utils/jwt.utils";

export const createUserSessionHandler = async (req: Request, res: Response) => {
  // validate the email and password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }
  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") }
  );

  // create refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    {
      expiresIn: config.get("refreshTokenTtl"),
    }
  );

  // send access & refresh token
  res.send({ accessToken, refreshToken });
};

export const getUserSessionsHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;
  console.log("userid", userId);

  const sessions = await findSessions({ user: userId, valid: true });
  console.log(sessions);
  return res.send(sessions);
};

export const deleteSessionHandler = async (req: Request, res: Response) => {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
};
