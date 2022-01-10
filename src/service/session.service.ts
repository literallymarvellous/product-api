import { signJwt, verifyJwt } from "./../utils/jwt.utils";
import { FilterQuery, FlattenMaps, LeanDocument, UpdateQuery } from "mongoose";
import config from "config";
import { get } from "lodash";
import SessionModel, { SessionDocument } from "../model/session.model";
import { findUser } from "./user.service";
// import { findUser } from "./user.service";

export const createSession = async (userId: string, userAgent: string) => {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toJSON();
};

// Re isuue an new access token
export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  // Decode refresh token
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "session")) {
    return false;
  }

  // get the seesion
  const session = await SessionModel.findById(get(decoded, "session"));

  //Make sure the seesion is still valid
  if (!session || !session?.valid) {
    return false;
  }

  const user = await findUser({ id: session.user });

  if (!user) {
    return false;
  }
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") }
  );

  return accessToken;
};

export const updateSession = async (
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) => {
  return SessionModel.updateOne(query, update);
};

export const findSessions = async (query: FilterQuery<SessionDocument>) => {
  return SessionModel.find(query).lean();
};
