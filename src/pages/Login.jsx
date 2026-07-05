import React from 'react'
import { Input } from '../components'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'

function Login() {
    const loginUser = useLogin()

    const {
        register,
        handleSubmit,
        formState: {errors}

    } = useForm()

    const submit = (data) => {
        loginUser.mutate(data)
    }  

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-lg">
        <div className="card-body p-8">

          {/* ── Logo ── */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-3">
              <span className="text-primary-content text-2xl font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-base-content/60 mt-1">Log in to continue</p>
          </div>

          {/* ── Form ── */}
          {/* noValidate disables browser default popups — our errors show instead */}
          <form onSubmit={handleSubmit(submit)} noValidate>

            <Input
              label="Username"
              type="text"
              placeholder=""
              error={errors.email?.message}
              {...register('username', {
                required: 'Username is required',
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
                  message: 'At least 6 characters',
                },
              })}
            />

            {/* DaisyUI loading spinner is built in — just add the class */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loginUser.isPending}
            >
              {loginUser.isPending && (
                <span className="loading loading-spinner loading-sm" />
              )}
              {loginUser.isPending ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="text-center text-sm mt-5 text-base-content/70">
            Don't have an account?{' '}
            <Link to="/register" className="link link-primary font-medium">
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login