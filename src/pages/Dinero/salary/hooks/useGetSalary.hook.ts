import { useQuery } from '@tanstack/react-query';
import { salaryService } from '../services/salary.service';

export const useGetSalary = () => {
  return useQuery({
    queryKey: ['salary'],
    queryFn: salaryService.get,
  });
};
