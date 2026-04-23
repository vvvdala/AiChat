import $api from "../http";

export default class AuthService {
  static async login(email, password) {
    return $api.post("/login", { email, password });
  }

  static async registration(email, password, username, name, surname) {
    console.log("Sending data:", { email, password, username, name, surname });
    return $api.post("/registration", {
      email,
      password,
      username,
      name,
      surname,
    });
  }

  static async editProfile(avatar) {
    return $api.patch("/profile/edit", { avatar });
  }

  static async logout() {
    return $api.post("/logout");
  }

  static async getUsers() {
    return $api.get("/users");
  }
}
