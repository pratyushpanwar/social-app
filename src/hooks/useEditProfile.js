import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSelector, useDispatch } from "react-redux"
import api from '../api/client'
import { useNavigate } from "react-router-dom"
import { setAuth } from "../store/AuthSlice"
import toast from "react-hot-toast"

export function useUpdateProfile(){
    const diapatch = useDispatch()
    const navigate = useNavigate()
    const qc = useQueryClient()
    const { token, user } = useSelector(state => state.auth)
    return useMutation({
        mutationFn: (data) => 
            api.patch('/social-media/profile',data).then(res => res.data.data),
        onSuccess:(updated) => {
            diapatch(setAuth({ user: {...user, ...updated }, token }))
            qc.invalidateQueries({ queryKey: ['profile'] })
            toast.success('Profile updated!');
            navigate(`/profile/${updated.username ?? user.username}`);
        },
        onError:(err) => {
        toast.error(err.response?.data?.message || 'Failed to update profile')  
        }
    })
}

export function useUpdateCoverImage() {

    const qc = useQueryClient()
    return useMutation({
        mutationFn:(file) => {
            const form = new FormData()
            form.append('coverImage', file)
            return api.patch('/social-media/profile/cover-image', form, {
                headers: { 'Content-Type': 'multipart/form-data'},
            }).then( res => res.data.data)
        },
        onSuccess:() => {
            qc.invalidateQueries({ queryKey: ['profile'] })
            toast.success('Cover image updated!');
        },
        onError: () => toast.error('Failed to update cover image'),
    })
}

export function useUpdateAvatar() {
    const dispatch = useDispatch()
    const { user, token } = useSelector(state => state.auth)
    const qc = useQueryClient()

    return useMutation({
        mutationFn:(file) => {
            const form = new FormData()
            form.append('avatar', file)
            return api.patch('/users/avatar', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(res => res.data.data)
        },
        onSuccess:(updated) => {
            qc.invalidateQueries({ queryKey: ['profile'] })
            dispatch(setAuth({ user: { ...user, ...updated }, token }))
            toast.success('Avatar image Updated');
        },
        onError:() => toast.error('Failed to update image')
    })
}