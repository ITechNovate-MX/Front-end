import { RouterProvider } from 'react-router-dom';
import { AppRouter } from './routes/router';
import { useAppContext } from './app-context/app-context';

const App = () => {
  const { loadingContext } = useAppContext();

  return (
    <>
      <RouterProvider router={AppRouter()} />
    </>
  );
}

export default App;