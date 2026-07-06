import { useQuery, useMutation } from "@tanstack/react-query"
import api from "../api/client";
import toast from "react-hot-toast"


// GetAllPosts
export function useGetPosts(){
    return useQuery({
        queryKey:['posts'],
        queryFn: async() => {
            const res = await api.get('/social-media/posts')
            return res.data
        }
    })
}

// GetPostById
export function usePost(postId){
    return useQuery({
        queryKey:['post', postId],
        queryFn: async() => {
            const res = await api.get(`/social-media/posts/${postId}`)
            return res.data
        },
        enabled: !!postId
    })
}

// CreatePost