import { useQuery } from '@tanstack/react-query';
import { postService } from '../services/post.service';

export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: postService.getAll,
  });
};
