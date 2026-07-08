import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

export function usePost(postId){
    return useQuery({
        queryKey:['post',postId],
        queryFn: () => 
            api.get(`/social-media/posts/${postId}`).then(res => res.data.data),
        enabled: !!postId,
        
    })
}
