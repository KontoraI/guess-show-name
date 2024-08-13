import GamePage from "../pages/GamePage";
import LoginPage from "../pages/LoginPage";
import { IRoute, RoutesName } from "../types/routeType";

export const privateRoute: IRoute = {
  path: RoutesName.GAME,
  element: GamePage,
};

export const publicRoute: IRoute = {
  path: RoutesName.LOGIN,
  element: LoginPage,
};
