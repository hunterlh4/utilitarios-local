import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/task.service';

export const useGetAllTaskLists = () => {
  return useQuery({
    queryKey: ['task-lists'],
    queryFn: taskService.getAll,
  });
};
