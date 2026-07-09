import api from "../api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useBookmarks(){
    return useQuery({
        queryKey: ['bookmarks'],
        queryFn: () => api.get(`/social-media/bookmarks`).then(res => res.data.data)

    })
}


export function useToggleBookmark(){
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (postId) => api.post(`/social-media/bookmarks/${postId}`).then(res => res.data.data),

        onMutate: async(postId) => {
            await qc.cancelQueries({queryKey: ['post', postId]})
            const previousPost = qc.getQueryData(['post', postId]);

            

            if(previousPost){

                qc.setQueryData(['post', postId], old => {
                if (!old) return old;

                return {
                    ...old,
                    isBookmarked: !old.isBookmarked,
                };
                });
            }

            qc.setQueryData(['posts'], (old) => {
                if (!old?.pages) return old;
                return {
                ...old,
                pages: old.pages.map(page => ({
                    ...page,
                    posts: (page.posts ?? []).map(post =>
                    post._id === postId
                        ? { ...post, isBookmarked: !post.isBookmarked }
                        : post
                    ),
                })),
                };
            });
        },

    

     onError: (_, postId, ctx) => {
        console.log(_);
      if (ctx?.previousPost) qc.setQueryData(['post', postId], ctx.previousPost);
      toast.error('Failed to bookmark');
    },

     onSettled: (_, __, postId) => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      qc.invalidateQueries({ queryKey: ['posts'] });
      qc.invalidateQueries({ queryKey: ['post', postId] });
      qc.invalidateQueries({queryKey: ['userPosts']})
    },
    })
}