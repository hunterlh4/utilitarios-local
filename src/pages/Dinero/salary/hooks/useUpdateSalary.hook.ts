import { useMutation, useQueryClient } from '@tanstack/react-query';
import { salaryService } from '../services/salary.service';
import type { UpdateSalaryDto } from '../models/salary-request.dto';

export const useUpdateSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSalaryDto }) =>
      salaryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary'] });
    },
  });
};
