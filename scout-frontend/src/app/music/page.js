'use client';

import MusicListPage from '../MusicListPage';
import withAuth from '../withAuth';
import { useRouter } from 'next/navigation';

function MusicPageContent() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-[family-name:var(--font-geist-sans)]">
      <header className="bg-[rgba(90,25,225,0.84)]">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Troop 22</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <MusicListPage />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Scout Music App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default withAuth(MusicPageContent);
