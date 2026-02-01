import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/post.service';
import { CreatePostDto } from '../models/post-request.dto';

export const useAddPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) => postService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
