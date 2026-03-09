import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task.service';
import type { CreateTaskDto } from '../models/task-request.dto';

export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
};
