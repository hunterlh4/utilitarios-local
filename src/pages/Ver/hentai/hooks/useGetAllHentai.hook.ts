import { useQuery } from '@tanstack/react-query';
import { hentaiService } from '../services/hentai.service';

export const useGetAllHentai = () => {
  return useQuery({
    queryKey: ['hentai'],
    queryFn: hentaiService.getAll,
  });
};
