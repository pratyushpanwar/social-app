import api from "../api/client";
import { useQuery } from "@tanstack/react-query";


export function useProfile(username) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: async() =>{
     const res = await api.get(`/social-media/profile/u/${username}`)
     
     return (res.data.data)
    },

    enabled: !!username,
  });
}

export function useUserPosts(username) {
  return useQuery({
    queryKey: ['userPosts', username],
    queryFn: async() =>{
        const res = await api.get(`/social-media/posts/get/u/${username}`)
        return res.data.data.posts ?? []
         
        },
    enabled: !!username,
  });
}