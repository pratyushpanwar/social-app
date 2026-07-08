import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <Toaster position="top-center"/>
      <App/>
      <ReactQueryDevtools initialIsOpen={false } />
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>

)
