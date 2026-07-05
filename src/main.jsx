import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
BrowserRouter 
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Login, Register } from './pages'


const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <Toaster position="top-center"/>
        <Routes>
          <Route path='/login' element={ <Login/> }/>
          <Route path='/register' element={ <Register/> }/>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>

)
