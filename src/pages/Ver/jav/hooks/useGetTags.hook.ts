import { useQuery } from '@tanstack/react-query';
import { tagService } from '@/common/services/tag.service';

export const useGetTags = (type: number) => {
  return useQuery({
    queryKey: ['tags', type],
    queryFn: () => tagService.getByType(type),
  });
};
