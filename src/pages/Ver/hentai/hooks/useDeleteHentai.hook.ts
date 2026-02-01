import { useState } from 'react';
import { HentaiService } from '../services/hentai.service';
import { ApiException } from '@/config/models/api-error.model';
import { toast } from 'sonner';

export const useDeleteHentai = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteHentai = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await HentaiService.delete(id);

      toast.success('Hentai eliminado exitosamente');
      onSuccess?.();

      return true;
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al eliminar hentai');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteHentai, loading, error };
};
