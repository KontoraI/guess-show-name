export interface IRoute {
    path: string;
    element: React.ComponentState;
  }
  
export enum RoutesName {
    LOGIN = "/login",
    GAME = "/",
  }