import api from "../api/client";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../store/AuthSlice";

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

export function useMyProfile(){
  const dispatch = useDispatch()
  const { token, user } = useSelector(state => state.auth)
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: async() => {
      const res = await api.get('/social-media/profile');
      dispatch(setAuth({ user: res.data.data, token:token }))
      return res.data.data
    }
  })
}