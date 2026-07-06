import { useMutation } from "@tanstack/react-query";
import api from "../api/client";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuth, logout } from "../store/AuthSlice";
import { useNavigate } from "react-router-dom";



// Register
export function useRegister() {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (data) => 
            api.post('/users/register', data),
        

        onSuccess: (data) => {
            toast.success('Account created! Please log in.')
            navigate('/login')
            
        },
        onError: (err) => {
            toast.error( err.response?.data?.message || 'Registration failed')
            
        },
        onSettled: () => console.log("finally")
        
    })
}

// Login
export function useLogin() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    return useMutation({
        mutationFn: (data) => api.post('/users/login', data),

        onSuccess: (res) => {
            const {user, accessToken} = res.data.data
            dispatch(setAuth({user, token: accessToken}))
            toast.success(`Welcome back, ${user.username}!`);
            navigate('/')
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Login failed");
        },
        onSettled: () => {
            console.log('finally');
            
        }
    })
}


    // Logout
    export function useLogout() {
        
        const dispatch = useDispatch()
        const navigate = useNavigate()

        return () => {
            dispatch(logout())
            navigate('/login')
            toast.success('Logged out')
        }
    }