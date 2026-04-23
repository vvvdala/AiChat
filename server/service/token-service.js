import jwt from "jsonwebtoken";
import Token from "../models/token.js";

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30min",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.query().where("UserId", userId).first();
    if (tokenData) {
      await tokenData.$query().patch({ RefreshToken: refreshToken });
      return tokenData;
    }

    const token = await Token.query().insert({
      UserId: userId,
      RefreshToken: refreshToken,
    });
    return token;
  }

  async findToken(refreshToken) {
    return await Token.query().where("RefreshToken", refreshToken).first();
  }

  async removeToken(refreshToken) {
    const token = await Token.query()
      .where("RefreshToken", refreshToken)
      .first();
    if (token) {
      await token.$query().delete();
      return token;
    }
    return null;
  }
}

export default new TokenService();
