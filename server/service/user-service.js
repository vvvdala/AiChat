import User from "../models/user.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import tokenService from "./token-service.js";
import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/api-error.js";
import { userRepository } from "../db/repository.js";

class UserService {
  async registration(email, password, username, name, surname) {
    const candidate = await User.query()
      .where("Email", email)
      .orWhere("Username", username)
      .first();

    if (candidate) {
      if (candidate.email === email) {
        throw new Error("Email has already used");
      }
      if (candidate.username === username) {
        throw new Error("Username has already used");
      }
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const user = await User.query().insert({
      Username: username,
      Name: name,
      Surname: surname,
      Email: email,
      Password: hashPassword,
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({
      id: userDto.id,
      email: userDto.email,
      role: userDto.role,
    });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async login(email, password) {
    const user = await User.query().findOne({ Email: email });
    if (!user) {
      throw ApiError.BadRequest(`User with ${email} not found`);
    }
    const isPassEquals = await bcrypt.compare(password, user.Password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Incorrect password.`);
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({
      id: userDto.id,
      email: userDto.email,
      role: userDto.role,
    });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.query().findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({
      id: userDto.id,
      email: userDto.email,
      role: userDto.role,
    });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async editProfile(avatar, userId) {
    return await userRepository.editProfile(avatar, userId);
  }

  async getAllUsers() {
    const users = await User.query().select(
      "Id",
      "Name",
      "Surname",
      "Username",
      "Avatar",
    );
    return users;
  }

  async setRole(userId, role) {
    const user = await User.query().findById(userId);

    if (!user) throw ApiError.BadRequest("User not found");

    return await user.$query().patchAndFetch({ role });
  }
}

export default new UserService();
