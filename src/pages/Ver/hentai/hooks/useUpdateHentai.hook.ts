import { useState } from 'react';
import { HentaiService } from '../services/hentai.service';
import type { UpdateHentaiRequest } from '../models/hentai-request.dto';
import { ApiException } from '@/config/models/api-error.model';
import { toast } from 'sonner';

export const useUpdateHentai = (onSuccess?: (id: number) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateHentai = async (id: number, data: UpdateHentaiRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const updatedId = await HentaiService.update(id, data);

      toast.success('Hentai actualizado exitosamente');
      onSuccess?.(updatedId);

      return true;
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al actualizar hentai');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateHentai, loading, error };
};
