import { makeAutoObservable, makeObservable } from "mobx";

class Auth {
  isAuth: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsAuth() {
    this.isAuth = !this.isAuth;
  }
}

export const authService = new Auth();