'use client';

import ScoutContentListPage from '../../ScoutContentListPage';
import withAuth from '../../withAuth';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../Header';

function ScoutContentPage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category; // This will be 'all', 'pioneering', or 'knots'

  return (
    <div className="min-h-screen bg-gray-100 font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-20">
        <ScoutContentListPage category={category} />
      </main>
    </div>
  );
}

export default withAuth(ScoutContentPage);
