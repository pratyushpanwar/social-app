  import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
  import api from "../api/client";
  import toast from "react-hot-toast";


  // Fetch Feed

  export function usePosts() {  
      return useInfiniteQuery({
          queryKey: ['posts'],
          initialPageParam: 1,
          queryFn: async({ pageParam}) => {
              const res = await api.get(`/social-media/posts?page=${pageParam}&limit=10`)
              
              return res.data.data
          },
          getNextPageParam: (lastPage) => 
              lastPage.hasNextPage ? lastPage.page + 1 : undefined,

      })
  }

  // Like / Unlike

  export function useLikePost() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({postId}) =>
        api.post(`/social-media/like/post/${postId}`),

      // runs before the API call — updates UI instantly
      onMutate: async ({postId, username}) => {
        await qc.cancelQueries({ queryKey: ['posts'] });
        await qc.cancelQueries({ queryKey: ['post', postId]})
        await qc.cancelQueries({ queryKey: ['userPosts', username]})

        const previousFeed = qc.getQueryData(['posts']);
        const previousPost = qc.getQueryData(['post', postId]);
        const previousProfile = qc.getQueryData(['userPosts', username]);

        if(previousFeed) {
        qc.setQueryData(['posts'], (old) => ({
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            posts: page.posts.map(post =>
              post._id === postId
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                  }
                : post
            ),
          })),
        }));
      }

      if(previousPost) {
        qc.setQueryData(['post', postId], (old) => ({
            ...old,
            isLiked: !old.isLiked,
            likes: old.isLiked ? old.likes - 1 : old.likes + 1,
          }));
      }

      if(previousProfile) {
        qc.setQueryData(['userPosts', username], (old) => {
          if (!old) return old;

          return old.map(post =>
          post._id === postId
          ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked
              ? post.likes - 1
              : post.likes + 1,
          }
        : post
    );
  });
      }
      

        return { previousFeed, previousPost, previousProfile};
      },
      // if API fails → revert
      onError: (_, {postId, username}, ctx) => {
        console.log('mkb aaag!')
        if (ctx?.previousFeed) qc.setQueryData(['posts'], ctx.previousFeed);
        if (ctx?.previousPost) qc.setQueryData(['post', postId], ctx.previousPost);
        if (ctx?.previousProfile) qc.setQueryData(['userPosts', username], ctx.previousProfile);
      },
      // always re-sync with server
      onSettled: (_, __,{postId, username}) => {
        console.log('tmkc')
        qc.invalidateQueries({ queryKey: ['posts'] });
        qc.invalidateQueries({ queryKey: ['post', postId] });
        qc.invalidateQueries({ queryKey: ['userPosts', username]})
      },
    });
  } 

  //CreatePost

  export function useCreatePost() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: async({content}) => {

        const formData = new FormData()
        formData.append('content',content)
        const res = await api.post('/social-media/posts', formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        })
        return res.data;
      },
      onSuccess: () => {
        toast.success('Posted!');
        qc.invalidateQueries({ queryKey: ['posts'] });
      },
      onError: () => {
        toast.error('Failed to post')
      },
    });
  }

