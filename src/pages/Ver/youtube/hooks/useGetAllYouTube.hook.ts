import { useQuery } from '@tanstack/react-query';
import { youtubeService } from '../services/youtube.service';

export const useGetAllYouTube = () => {
  return useQuery({
    queryKey: ['youtube'],
    queryFn: youtubeService.getAll,
  });
};
