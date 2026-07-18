import React from 'react'
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Bookmark, User, LogOut } from 'lucide-react';
import { useLogout } from '../hooks/useAuth';

function Navbar() {

  const user = useSelector((state) => state.auth.user)
  const logout = useLogout()
  
  const links = [
    { to: '/',                     Icon: Home,    label: 'Home',      end: true },
    { to: '/bookmarks',            Icon: Bookmark, label: 'Bookmarks' },
    { to: `/profile/${user?.account?.username}`, Icon: User,    label: 'Profile' },
  ]
  return (
    <aside className="w-16 lg:w-60 h-screen sticky top-0 bg-base-100 border-r border-base-200 flex flex-col p-3">

      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8 mt-1">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-content font-bold text-lg">S</span>
        </div>
        <span className="hidden lg:block font-bold text-lg">Social</span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ to, Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
               ${isActive
                 ? 'bg-primary/10 text-primary'
                 : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
               }`
            }
          >
            <Icon size={20} />
            <span className="hidden lg:block">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info + logout at bottom */}
      <div className="border-t border-base-200 pt-3">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="avatar placeholder flex-shrink-0">
            <div className="bg-primary text-primary-content rounded-full w-8">
              <span className="text-sm relative left-3 top-0.5">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="hidden lg:block min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-base-content/50 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors w-full"
        >
          <LogOut size={18} />
          <span className="hidden lg:block">Log out</span>
        </button>
      </div>
    </aside>
  );
}

export default Navbar