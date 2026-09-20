export interface Route {
  path: string;
  component: () => HTMLElement;
}

export interface User {
  username: string;
  isLoggedIn: boolean;
}