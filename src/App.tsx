import { RouterProvider } from 'react-router-dom';
import { router } from './config/router/routes.config';
import { Toaster } from '@/common/components/ui/sonner';
import { LoadingOverlay, LoadingProvider } from '@/common/context/loading/LoadingContext';

function App() {
  return (
    <LoadingProvider>
      <RouterProvider router={router} />
      <LoadingOverlay />
      <Toaster />
    </LoadingProvider>
  );
}

export default App;
