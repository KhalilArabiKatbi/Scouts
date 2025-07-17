'use client'; // Required for Next.js App Router components using hooks

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MusicForm from './music_form'; // Ensure this path is correct
import Header from './Header';

const API_CONTENT_BASE_URL = 'http://localhost:8000/api/content'; // Updated base for music content

export default function MusicListPage() {
  const [musicItems, setMusicItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingMusicItem, setEditingMusicItem] = useState(null); // null for new, object for edit

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  const fetchMusicItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('accessToken');

    // Construct query parameters
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (filterType) params.append('type', filterType);
    if (filterCategory) params.append('category', filterCategory);
    if (filterDifficulty) params.append('difficulty', filterDifficulty);

    try {
      const response = await axios.get(`${API_CONTENT_BASE_URL}/music/?${params.toString()}`, { // Use new constant
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      setMusicItems(Array.isArray(response.data) ? response.data : (response.data.results || [])); // Handle paginated or plain list response
    } catch (err) {
      console.error('Error fetching music items:', err.response ? err.response.data : err.message);
      setError(err.response ? JSON.stringify(err.response.data) : err.message);
      setMusicItems([]); // Clear items on error
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterType, filterCategory, filterDifficulty]);

  useEffect(() => {
    fetchMusicItems();
  }, [fetchMusicItems, searchTerm, filterType, filterCategory, filterDifficulty]); // Re-fetch when filters change

  const handleFormSubmit = (musicItem) => {
    // After form submission (add or edit), refresh list and close form
    fetchMusicItems();
    setShowForm(false);
    setEditingMusicItem(null);
  };

  const handleEdit = (item) => {
    setEditingMusicItem(item);
    setShowForm(true);
  };

  const openNewMusicForm = () => {
    setEditingMusicItem(null); // Ensure it's for a new item
    setShowForm(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this music entry?')) {
      setError(null); // Clear previous errors specific to list loading
      const token = localStorage.getItem('accessToken');
      try {
        await axios.delete(`${API_CONTENT_BASE_URL}/music/${itemId}/`, { // Use correct constant
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        // Refresh the list after successful deletion
        setMusicItems(prevItems => prevItems.filter(item => item.id !== itemId));
        // Or call fetchMusicItems(); if you prefer to refetch everything from server
      } catch (err) {
        console.error('Error deleting music item:', err.response ? err.response.data : err.message);
        // Display a more specific error related to the delete action if possible,
        // or use the general error state.
        setError(`Failed to delete item: ${err.response ? JSON.stringify(err.response.data) : err.message}`);
      }
    }
  };

  if (isLoading && !showForm) { // Only show full page loading if form isn't also open
    return <div className="text-center p-8">Loading music entries...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500 bg-red-100 border border-red-300 p-4 rounded-md">Error fetching music: {error}</p>
        <button
            onClick={fetchMusicItems}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto p-4 md:p-8 mt-20">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Music Entries</h1>
          <button
            onClick={openNewMusicForm}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-sm self-start md:self-auto"
          >
            Add New Music
          </button>
        </div>

        {/* Search and Filter UI */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">Search (Title/Lyrics)</label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Enter search term..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>
            <div>
              <label htmlFor="filterType" className="block text-sm font-medium text-gray-700">Type</label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-500"
              >
                <option value="">All Types</option>
                <option value="SONG">Song (غنية)</option>
                <option value="CHANT">Chant (صيحة)</option>
                <option value="CLAP">Clap (صفقة)</option>
              </select>
            </div>
            <div>
              <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-500"
              >
                <option value="">All Categories</option>
                <option value="CAMPFIRE">Campfire</option>
                <option value="MARCHING">Marching</option>
                <option value="TRADITIONAL">Traditional</option>
                <option value="FUN">Fun</option>
              </select>
            </div>
            <div>
              <label htmlFor="filterDifficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select
                id="filterDifficulty"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-500"
              >
                <option value="">All Difficulties</option>
                <option value="1">Easy</option>
                <option value="2">Medium</option>
                <option value="3">Hard</option>
              </select>
            </div>
            {/* Consider adding a Reset Filters button here */}
          </div>
        </div>

        {showForm && (
          <div className="my-8">
            <MusicForm
              musicItem={editingMusicItem}
              onFormSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingMusicItem(null);
              }}
            />
          </div>
        )}

        {musicItems.length === 0 && !isLoading && (
          <p className="text-gray-600">No music entries found. Add some!</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">{item.title}</h2>
              <p className="text-sm text-gray-500 mb-1">Type: <span className="font-medium text-gray-700">{item.type_display || item.type}</span></p>
              {item.category_display && <p className="text-sm text-gray-500 mb-1">Category: <span className="font-medium text-gray-700">{item.category_display}</span></p>}
              {item.difficulty_display && <p className="text-sm text-gray-500 mb-1">Difficulty: <span className="font-medium text-gray-700">{item.difficulty_display}</span></p>}
              {item.lyrics && <p className="text-sm text-gray-600 mt-2 mb-3 whitespace-pre-line truncate h-20">{item.lyrics}</p>}
              {item.audio_file && (
                <div className="mt-3">
                  <audio controls src={item.audio_file} className="w-full">
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
                {/* Delete button will be added/wired up later */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-4 py-1.5 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
