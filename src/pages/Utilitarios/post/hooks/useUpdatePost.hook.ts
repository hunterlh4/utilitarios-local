import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/post.service';
import { UpdatePostDto } from '../models/post-request.dto';

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostDto }) =>
      postService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
