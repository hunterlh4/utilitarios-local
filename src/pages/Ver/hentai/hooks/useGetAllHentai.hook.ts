import { useState, useEffect } from 'react';
import { HentaiService } from '../services/hentai.service';
import type { Hentai } from '../models/hentai.model';
import { ApiException } from '@/config/models/api-error.model';
import { ContentStatus } from '@/common/enums/ver.enum';

export const useGetAllHentai = () => {
  const [hentais, setHentais] = useState<Hentai[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContentStatus | undefined>();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const fetchHentais = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await HentaiService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter,
      });

      setHentais(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al cargar hentais');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHentais();
  }, [pagination.page, pagination.limit, statusFilter]);

  return {
    hentais,
    loading,
    error,
    pagination,
    statusFilter,
    setStatusFilter,
    changePage: (page: number) => setPagination((prev) => ({ ...prev, page })),
    refetch: fetchHentais,
  };
};
