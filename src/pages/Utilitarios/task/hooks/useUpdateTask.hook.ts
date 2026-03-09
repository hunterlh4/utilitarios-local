import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task.service';
import type { UpdateTaskDto } from '../models/task-request.dto';

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
};
