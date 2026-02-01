import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task.service';

export const useDeleteTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
};
