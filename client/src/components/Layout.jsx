import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { MobileNav } from './MobileNav.jsx';

export function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MobileNav />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        <main className="flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
