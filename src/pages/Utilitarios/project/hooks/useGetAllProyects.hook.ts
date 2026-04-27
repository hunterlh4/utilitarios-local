import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/project.service';

export const useGetAllProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getAll,
  });
};
