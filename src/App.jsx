import { Suspense } from 'react'
import { Feed, Login, Register, PostDetail } from './pages'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components';
import Layout from './components/Layout';


function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader/>}>
    <Routes>
        <Route path='/login' element={ <Login/> }/>
        <Route path='/register' element={ <Register/> }/>

        // Protected
        <Route element={<ProtectedRoute/>}>
          <Route element={<Layout/>}>

            <Route path="/"           element={<Feed />} />

            {/* <Route path="/profile/:id"  element={<Profile />} /> */}
            <Route path="/post/:id"     element={<PostDetail />} />
            {/* <Route path="/bookmarks"    element={<Bookmarks />} /> */}

          </Route>
        </Route>
    </Routes>
    </Suspense>
  )
}

export default App
