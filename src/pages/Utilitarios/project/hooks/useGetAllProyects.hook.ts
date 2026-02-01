import { useQuery } from '@tanstack/react-query';
import { proyectService } from '../services/project.service';

export const useGetAllProyects = () => {
  return useQuery({
    queryKey: ['proyects'],
    queryFn: proyectService.getAll,
  });
};
