import { useQuery } from '@tanstack/react-query';
import { comicService } from '../services/comic.service';

export const useGetAllComics = () => {
  return useQuery({
    queryKey: ['comic'],
    queryFn: comicService.getAll,
  });
};
