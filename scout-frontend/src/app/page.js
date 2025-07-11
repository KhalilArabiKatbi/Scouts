'use client'; // Make this a client component to be wrapped by withAuth

import MusicListPage from './MusicListPage';
import withAuth from './withAuth'; // Import the HOC
import { useRouter } from 'next/navigation'; // Import for redirection

function HomePageContent() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    router.push('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Scout Music Manager</h1>
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

// Wrap HomePageContent with withAuth and export as default
export default withAuth(HomePageContent);
