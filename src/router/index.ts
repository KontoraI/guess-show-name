import GamePage from "../components/GamePage";
import LoginPage from "../components/LoginPage";

interface IRoute {
  path: string;
  element: React.ComponentState;
}

enum RoutesName {
  LOGIN = "/login",
  GAME = "/",
}

export const privateRoute: IRoute = {
  path: RoutesName.GAME,
  element: GamePage,
};

export const publicRoute: IRoute = {
  path: RoutesName.LOGIN,
  element: LoginPage,
};
