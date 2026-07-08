import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/client';

export function useComments(postId) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () =>
      api.get(`/social-media/comments/post/${postId}`).then(res => res.data.data),
    enabled: !!postId,
  });
}

export function useAddComment(postId){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (content) => 
            api.post(`/social-media/comments/post/${postId}`, {content}),

        onSuccess: () => {
            toast.success('Comment added')
            qc.invalidateQueries({ queryKey: ['comments', postId]})
            qc.invalidateQueries({ queryKey: ['posts']})
            qc.invalidateQueries({ queryKey: ['post', postId]})
        },
        onError: (err) => {
            console.log(err.message);
            
            toast.error('Failed to add comment')
        }
    })
}

export function useDeleteComment(postId) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (commentId) => 
            api.delete(`/social-media/comments/${commentId}`),
        onSuccess: () => {
            toast.success('Comment Deleted')
            qc.invalidateQueries({ queryKey: ['comments', postId]})
            qc.invalidateQueries({ queryKey: ['posts']})
        },
        onError: (err) => {
            console.log(err);
            
            toast.error("Failed to Delete")
        }
    })
}