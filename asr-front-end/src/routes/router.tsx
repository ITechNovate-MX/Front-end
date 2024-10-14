import {  Login, Home, Records, Register, Upload } from '../pages';
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';

import PrivateRouter from './PrivateRouter';
import PublicRouter from './PublicRouter';
import { ROUTES } from "./constants";

export const AppRouter = () => {

  const routes: RouteObject[] = [
    {
      path: '/',
      element: <PrivateRouter />,
      children: [
          { path: ROUTES.HOME.path, element: <Home/> },
          { path: ROUTES.RECORDS.path, element: <Records /> },
          { path: ROUTES.REGISTER.path, element: <Register /> },
          { path: ROUTES.UPLOAD.path, element: <Upload /> },
      ],
  },
  {
      path: '/login',
      element: <PublicRouter />,
      children: [
          { path: '/login', element: <Login /> }
      ],
  }
  ]
  return createBrowserRouter(routes);
};
