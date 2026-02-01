import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/common/components/layout/Layout';
import { HomePage } from '@/pages/Home/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Agregar más rutas aquí
    ],
  },
]);
