import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import { API_URL } from "../http";

export default class AuthStore {
  user = {};
  users = [];
  isAuth = false;
  isLoading = true;
  isUsersLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool) {
    this.isAuth = bool;
  }

  setUser(user) {
    this.user = user;
  }

  setUsers(data) {
    this.users = data;
  }

  setLoading(bool) {
    this.isLoading = bool;
  }

  setUsersLoading(bool) {
    this.isUsersLoading = bool;
  }

  async login(email, password) {
    try {
      const response = await AuthService.login(email, password);
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);

      const pendingInvite = localStorage.getItem("pendingInvite");
      if (pendingInvite) {
        localStorage.removeItem("pendingInvite");
        window.location.href = `/invite/${pendingInvite}`;
      }
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  }

  async registration(email, password, username, name, surname) {
    try {
      const response = await AuthService.registration(
        email,
        password,
        username,
        name,
        surname,
      );
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({});
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/refresh`, {
        withCredentials: true,
      });
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      this.setLoading(false);
    }
  }

  async editProfile(avatar) {
    try {
      const { data } = await AuthService.editProfile(avatar);
      console.log(data);
      this.setUser({ ...this.user, Avatar: data.Avatar });
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  }

  async getUsers() {
    try {
      this.setUsersLoading(true);
      const { data } = await AuthService.getUsers();
      console.log(data);
      this.setUsers(data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      this.setUsersLoading(false);
    }
  }
}
