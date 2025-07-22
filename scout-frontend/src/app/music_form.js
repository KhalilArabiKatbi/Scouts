import { useState, useEffect } from 'react';
import axios from 'axios';

const API_CONTENT_BASE_URL = 'http://192.168.1.7:8000/api/content'; // For music content
// Note: The /api/token/ endpoint is separate and not covered by this base URL.

export default function MusicForm({ musicItem, onFormSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'SONG',
    lyrics: '',
    category: 'CAMPFIRE',
    difficulty: 1,
    audio_file: null,
    video_file: null, // Added
    web_link: '',     // Added
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [audioFileName, setAudioFileName] = useState('');
  const [videoFileName, setVideoFileName] = useState('');

  useEffect(() => {
    if (musicItem) {
      setIsEditMode(true);
      setFormData({
        title: musicItem.title || '',
        type: musicItem.type || 'SONG',
        lyrics: musicItem.lyrics || '',
        category: musicItem.category || 'CAMPFIRE',
        difficulty: musicItem.difficulty || 1,
        audio_file: null,
        video_file: null,
        web_link: musicItem.web_link || '',
      });
      setAudioFileName(musicItem.audio_file ? musicItem.audio_file.split('/').pop() : '');
      setVideoFileName(musicItem.video_file ? musicItem.video_file.split('/').pop() : '');
    } else {
      setIsEditMode(false);
      setFormData({
        title: '',
        type: 'SONG',
        lyrics: '',
        category: 'CAMPFIRE',
        difficulty: 1,
        audio_file: null,
        video_file: null,
        web_link: '',
      });
      setAudioFileName('');
      setVideoFileName('');
    }
  }, [musicItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0] || null;
    setFormData((prev) => ({ ...prev, [name]: file }));

    if (name === 'audio_file') {
      setAudioFileName(file ? file.name : (musicItem?.audio_file ? musicItem.audio_file.split('/').pop() : ''));
    } else if (name === 'video_file') {
      setVideoFileName(file ? file.name : (musicItem?.video_file ? musicItem.video_file.split('/').pop() : ''));
    }
  };

  const clearForm = () => {
    setFormData({
      title: '',
      type: 'SONG',
      lyrics: '',
      category: 'CAMPFIRE',
      difficulty: 1,
      audio_file: null,
      video_file: null,
      web_link: '',
    });
    setAudioFileName('');
    setVideoFileName('');
    setFormError(null);
    setFieldErrors({});
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const data = new FormData();
    data.append('title', formData.title);
    data.append('type', formData.type);
    data.append('lyrics', formData.lyrics);
    data.append('category', formData.category);
    data.append('difficulty', parseInt(formData.difficulty, 10));
    data.append('web_link', formData.web_link);

    if (formData.audio_file) {
      data.append('audio_file', formData.audio_file);
    }
    if (formData.video_file) {
      data.append('video_file', formData.video_file);
    }


    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': token ? `Bearer ${token}` : '',
      // 'Content-Type': 'multipart/form-data' is automatically set by browser when using FormData
    };

    try {
      let response;
      if (isEditMode && musicItem) {
        response = await axios.put(`${API_CONTENT_BASE_URL}/music/${musicItem.id}/`, data, { headers }); // Use new constant
      } else {
        response = await axios.post(`${API_CONTENT_BASE_URL}/music/`, data, { headers }); // Use new constant
      }
      onFormSubmit(response.data); // Callback with new/updated item
      clearForm(); // Clear form after successful submission
      if (onCancel) onCancel(); // Close form if cancel function provided
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} music:`, err.response ? err.response.data : err.message);
      if (err.response && err.response.data && typeof err.response.data === 'object') {
        // Check for DRF validation errors (typically an object with field names as keys)
        const backendErrors = err.response.data;
        const specificFieldErrors = {};
        let generalError = '';

        for (const key in backendErrors) {
          if (Object.prototype.hasOwnProperty.call(backendErrors, key)) {
            // DRF often returns a list of error messages for each field
            specificFieldErrors[key] = backendErrors[key].join ? backendErrors[key].join(' ') : backendErrors[key];
          }
        }

        if (Object.keys(specificFieldErrors).length > 0) {
            setFieldErrors(specificFieldErrors);
            // Check for non_field_errors or detail for general messages
            if (specificFieldErrors.non_field_errors) {
                generalError = specificFieldErrors.non_field_errors;
            } else if (specificFieldErrors.detail) {
                generalError = specificFieldErrors.detail;
            } else {
                generalError = 'Please correct the highlighted fields.';
            }
        } else {
            // If not a structured DRF error, use a generic message
            generalError = err.response.data.detail || 'An unexpected error occurred.';
        }
        setFormError(generalError);

      } else {
        // Network error or non-JSON response
        setFormError(err.message || 'A network error occurred.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-xl space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">{isEditMode ? 'Edit Music Entry' : 'Add New Music Entry'}</h2>

      {formError && !fieldErrors.non_field_errors && !fieldErrors.detail && ( // Show general error if not already part of fieldErrors
        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md mb-4">
          {formError}
        </div>
      )}
      {fieldErrors.non_field_errors && (
        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md mb-4">
          
          {fieldErrors.non_field_errors}
        </div>
      )}
       {fieldErrors.detail && ( // For errors like "Authentication credentials were not provided."
        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md mb-4">
          {fieldErrors.detail}
        </div>
      )}


      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Song or Chant Title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black`}
          required
        />
        {fieldErrors.title && <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.type ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        >
          <option value="SONG">Song (غنية)</option>
          <option value="CHANT">Chant (صيحة)</option>
          <option value="CLAP">Clap (صفقة)</option>
        </select>
        {fieldErrors.type && <p className="mt-1 text-xs text-red-600">{fieldErrors.type}</p>}
      </div>

      <div>
        <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700">Lyrics</label>
        <textarea
          id="lyrics"
          name="lyrics"
          placeholder="Full lyrics..."
          value={formData.lyrics}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.lyrics ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black`}
          rows={4}
        />
        {fieldErrors.lyrics && <p className="mt-1 text-xs text-red-600">{fieldErrors.lyrics}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.category ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        >
          <option value="CAMPFIRE">Campfire</option>
          <option value="MARCHING">Marching</option>
          <option value="TRADITIONAL">Traditional</option>
          <option value="FUN">Fun</option>
        </select>
        {fieldErrors.category && <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>}
      </div>

      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
        <select
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.difficulty ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        >
          <option value={1}>Easy</option>
          <option value={2}>Medium</option>
          <option value={3}>Hard</option>
        </select>
        {fieldErrors.difficulty && <p className="mt-1 text-xs text-red-600">{fieldErrors.difficulty}</p>}
      </div>

      <div>
        <label htmlFor="audio_file" className="block text-sm font-medium text-gray-700">Audio File</label>
        <input
          id="audio_file"
          name="audio_file"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className={`mt-1 block w-full text-sm ${fieldErrors.audio_file ? 'text-red-700' : 'text-gray-500'} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100`}
        />
        {audioFileName && !fieldErrors.audio_file && <p className="mt-1 text-xs text-gray-500">Current file: {audioFileName}</p>}
        {fieldErrors.audio_file && <p className="mt-1 text-xs text-red-600">{fieldErrors.audio_file}</p>}
      </div>

      <div>
        <label htmlFor="video_file" className="block text-sm font-medium text-gray-700">Video File</label>
        <input
          id="video_file"
          name="video_file"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className={`mt-1 block w-full text-sm ${fieldErrors.video_file ? 'text-red-700' : 'text-gray-500'} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100`}
        />
        {videoFileName && !fieldErrors.video_file && <p className="mt-1 text-xs text-gray-500">Current file: {videoFileName}</p>}
        {fieldErrors.video_file && <p className="mt-1 text-xs text-red-600">{fieldErrors.video_file}</p>}
      </div>

      <div>
        <label htmlFor="web_link" className="block text-sm font-medium text-gray-700">Web Link</label>
        <input
          id="web_link"
          name="web_link"
          type="url"
          placeholder="https://example.com"
          value={formData.web_link}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.web_link ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black`}
        />
        {fieldErrors.web_link && <p className="mt-1 text-xs text-red-600">{fieldErrors.web_link}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={() => { clearForm(); onCancel(); }}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditMode ? 'Update Music' : 'Add Music'}
        </button>
      </div>
    </form>
  );
}