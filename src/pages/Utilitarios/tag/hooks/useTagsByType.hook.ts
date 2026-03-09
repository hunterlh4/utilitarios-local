import { useQuery } from '@tanstack/react-query';
import { tagService } from '../services/tag.service';

export const useTagsByType = (type: number | null) => {
  return useQuery({
    queryKey: ['tags', type],
    queryFn: () => (type !== null ? tagService.getByType(type) : Promise.resolve([])),
    enabled: type !== null,
  });
};
