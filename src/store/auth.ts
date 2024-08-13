import { makeAutoObservable } from "mobx";

class Auth {
  isAuth: boolean = false;

  constructor() {
    makeAutoObservable(this);

    this.isAuth = !!localStorage.getItem("user");
  }

  login = (user: any) => {
    this.isAuth = true;
    localStorage.setItem("user", JSON.stringify(user));
  };

  logout = () => {
    localStorage.clear();
    this.isAuth = false;
  };
}

export const authService = new Auth();
