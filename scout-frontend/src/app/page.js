// Main page for the application
import MusicListPage from './MusicListPage'; // Adjust path if necessary

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          {/* You can add a more sophisticated header or navbar here if needed */}
          <h1 className="text-2xl font-semibold text-gray-800">Scout Music Manager</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <MusicListPage />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Scout Music App. All rights reserved.</p>
          {/* You can add more footer content here */}
        </div>
      </footer>
    </div>
  );
}
