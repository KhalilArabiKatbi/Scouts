'use client';

import MusicListPage from '../MusicListPage';
import withAuth from '../withAuth';
import { useRouter } from 'next/navigation';
import Header from '../Header';

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
      <Header />
      <main className="container mx-auto px-4 py-8 mt-20">
        <MusicListPage />
      </main>
    </div>
  );
}

export default withAuth(MusicPageContent);
