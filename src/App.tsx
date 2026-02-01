import { RouterProvider } from 'react-router-dom';
import { router } from './config/router/routes.config';
import { Toaster } from '@/common/components/ui/sonner';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
