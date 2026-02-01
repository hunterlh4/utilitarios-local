import { useState } from 'react';
import { HentaiService } from '../services/hentai.service';
import type { CreateHentaiRequest } from '../models/hentai-request.dto';
import { ApiException } from '@/config/models/api-error.model';
import { toast } from 'sonner';

export const useAddHentai = (onSuccess?: (id: number) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addHentai = async (data: CreateHentaiRequest): Promise<number | null> => {
    try {
      setLoading(true);
      setError(null);

      const id = await HentaiService.create(data);

      toast.success('Hentai creado exitosamente');
      onSuccess?.(id);

      return id;
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al crear hentai');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addHentai, loading, error };
};
