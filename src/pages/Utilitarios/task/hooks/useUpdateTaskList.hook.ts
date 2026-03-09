import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task.service';
import type { UpdateTaskListDto } from '../models/task-request.dto';

export const useUpdateTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskListDto }) =>
      taskService.updateList(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
};
