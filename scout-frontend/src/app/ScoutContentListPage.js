'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ScoutContentForm from './scout_content_form';
import Header from './Header';

const API_CONTENT_BASE_URL = 'http://localhost:8000/api/content';

export default function ScoutContentListPage({ category }) {
  const [scoutItems, setScoutItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingScoutItem, setEditingScoutItem] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchScoutItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('accessToken');

    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
    if (filterType) params.append('type', filterType);
    if (filterDifficulty) params.append('difficulty', filterDifficulty);

    if (category && category !== 'all') {
        // Convert category from URL to the backend value
        const backendCategory = category.toUpperCase();
        params.append('category', backendCategory);
    }


    try {
      const response = await axios.get(`${API_CONTENT_BASE_URL}/scout-content/?${params.toString()}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      setScoutItems(Array.isArray(response.data) ? response.data : (response.data.results || []));
    } catch (err) {
      console.error('Error fetching scout items:', err.response ? err.response.data : err.message);
      setError(err.response ? JSON.stringify(err.response.data) : err.message);
      setScoutItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, filterType, filterDifficulty, category]);

  useEffect(() => {
    fetchScoutItems();
  }, [fetchScoutItems]);

  const handleFormSubmit = (scoutItem) => {
    fetchScoutItems();
    setShowForm(false);
    setEditingScoutItem(null);
  };

  const handleEdit = (item) => {
    setEditingScoutItem(item);
    setShowForm(true);
  };

  const openNewScoutContentForm = () => {
    setEditingScoutItem(null);
    setShowForm(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setError(null);
      const token = localStorage.getItem('accessToken');
      try {
        await axios.delete(`${API_CONTENT_BASE_URL}/scout-content/${itemId}/`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        setScoutItems(prevItems => prevItems.filter(item => item.id !== itemId));
      } catch (err) {
        console.error('Error deleting scout item:', err.response ? err.response.data : err.message);
        setError(`Failed to delete item: ${err.response ? JSON.stringify(err.response.data) : err.message}`);
      }
    }
  };

  if (isLoading && !showForm) {
    return <div className="text-center p-8">Loading scout content...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500 bg-red-100 border border-red-300 p-4 rounded-md">Error fetching scout content: {error}</p>
        <button
            onClick={fetchScoutItems}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Retry
        </button>
      </div>
    );
  }

  const getTitle = () => {
    if (category === 'pioneering') return 'اعمال ريادة';
    if (category === 'knots') return 'عقد';
    return 'All Scout Content';
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 md:p-8 mt-20">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">{getTitle()}</h1>
          <button
            onClick={openNewScoutContentForm}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-sm self-start md:self-auto"
          >
            Add New
          </button>
        </div>

        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">Search (Name/Usage)</label>
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
                <option value="KNOT">عقدة</option>
                <option value="LASHING_1">ربطة 1</option>
                <option value="LASHING_2">ربطة 2</option>
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
          </div>
        </div>

        {showForm && (
          <div className="my-8">
            <ScoutContentForm
              scoutItem={editingScoutItem}
              onFormSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingScoutItem(null);
              }}
            />
          </div>
        )}

        {scoutItems.length === 0 && !isLoading && (
          <p className="text-gray-600">No scout content found. Add some!</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scoutItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">{item.name}</h2>
              {item.picture && <img src={item.picture} alt={item.name} className="w-full h-48 object-cover rounded-md mb-4" />}
              <p className="text-sm text-gray-500 mb-1">Type: <span className="font-medium text-gray-700">{item.type_display || item.type}</span></p>
              {item.category_display && <p className="text-sm text-gray-500 mb-1">Category: <span className="font-medium text-gray-700">{item.category_display}</span></p>}
              {item.difficulty_display && <p className="text-sm text-gray-500 mb-1">Difficulty: <span className="font-medium text-gray-700">{item.difficulty_display}</span></p>}
              {item.usage && <p className="text-sm text-gray-600 mt-2 mb-3 whitespace-pre-line truncate h-20">{item.usage}</p>}
              {item.youtube_link && <a href={item.youtube_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Watch on YouTube</a>}

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
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
