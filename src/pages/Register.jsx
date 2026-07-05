import React from 'react'
import { useForm } from 'react-hook-form'
import { useRegister } from '../hooks/useAuth'
import { Input } from '../components/index'
import { Link } from 'react-router-dom'


function Register() {
  const registerUser = useRegister(); 
  const { 
     handleSubmit,
     register,
    formState: {errors}
  } = useForm()

  const submit = (data) => {
    registerUser.mutate(data)
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-lg">
        <div className="card-body p-8">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-3">
              <span className="text-primary-content text-2xl font-bold">X</span>
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-sm text-base-content/60 mt-1">
              Sign up to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(submit)} noValidate>

            <Input
              label="Username"
              type="text"
              placeholder=""
              error={errors.username?.message}
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
              })}
            />

            <Input
              label="Email"
              type="email"
              placeholder=""
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/i,
                  message: 'Enter a valid email',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder=""
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={registerUser.isPending}
            >
              {registerUser.isPending && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              {registerUser.isPending ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm mt-5 text-base-content/70">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary font-medium">
              Log in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register