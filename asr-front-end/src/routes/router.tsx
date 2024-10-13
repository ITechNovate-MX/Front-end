import {  Login } from "../pages/login";
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';

import PrivateRouter from './PrivateRouter';
import PublicRouter from './PublicRouter';
import { ROUTES } from "./constants";

export const AppRouter = () => {

  const routes: RouteObject[] = [

    {
        path: '/',
        element: <PublicRouter />,
        children: [
            { path: ROUTES.LOGIN.path, element: <Login /> }
        ],
    }
  ]
  return createBrowserRouter(routes);
};
