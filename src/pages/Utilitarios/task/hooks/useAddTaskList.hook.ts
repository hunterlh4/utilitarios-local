import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task.service';
import { CreateTaskListDto } from '../models/task-request.dto';

export const useAddTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskListDto) => taskService.createList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
};
