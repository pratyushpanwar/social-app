import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/client';


export function useFollow(userId, username) {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: () => api.post(`/social-media/follow/${userId}`),


    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['profile', username] });
      const previous = qc.getQueryData(['profile', username]);

      qc.setQueryData(['profile', username], (old) => {
        if (!old) return old;
        return {
          ...old,
          isFollowing: !old.isFollowing,
          followersCount: old.isFollowing
            ? old.followersCount - 1
            : old.followersCount + 1,
        };
      });

      return { previous };
    },

    onError: (_, __, ctx) => {
      if (ctx?.previous)
        qc.setQueryData(['profile', username], ctx.previous);
      toast.error('Something went wrong');
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['profile', username] });
    },
  });
}