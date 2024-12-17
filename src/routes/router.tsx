import { Login, Home, Records, Register, Upload, Factura } from '../pages';
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';
import PrivateRouter from './PrivateRouter';
import PublicRouter from './PublicRouter';
import { useAppContext } from '../app-context/app-context';
import { ROUTES } from './constants';

export const AppRouter = () => {
  const { user } = useAppContext();
  const isLoggedIn = Boolean(user);

  const routes: RouteObject[] = [
    {
      path: '/',
      element: isLoggedIn ?  <PrivateRouter /> : <Navigate to = "/login" />,
      children: [
        { path: ROUTES.HOME.path, element: <Home /> },
        { path: ROUTES.RECORDS.path, element: <Records /> },
        { path: ROUTES.REGISTER.path, element: <Register /> },
        { path: ROUTES.UPLOAD.path, element: <Upload /> },
        { path: ROUTES.FACTURA.path, element: <Factura /> },
      ],
    },
    {
      path: '/login',
      element: isLoggedIn ? <Navigate to = "/"/> : <PublicRouter />,
      children: [{ path: '/login', element: <Login /> }],
    },
  ];

  return createBrowserRouter(routes);
};