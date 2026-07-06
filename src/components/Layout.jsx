import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="min-h-screen flex bg-base-200">


      <Navbar />


      <main className="flex-1 max-w-2xl mx-auto w-full min-h-screen bg-base-100 border-x border-base-200">
    
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;