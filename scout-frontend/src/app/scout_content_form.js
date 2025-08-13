import { useState, useEffect } from 'react';
import axios from 'axios';

const API_CONTENT_BASE_URL = 'http://localhost:8000/api/content';

export default function ScoutContentForm({ scoutItem, onFormSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'KNOT',
    category: 'KNOTS',
    difficulty: 1,
    usage: '',
    youtube_link: '',
    model_3d: '',
    picture: null,
    video: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [pictureFileName, setPictureFileName] = useState('');
  const [videoFileName, setVideoFileName] = useState('');

  useEffect(() => {
    if (scoutItem) {
      setIsEditMode(true);
      setFormData({
        name: scoutItem.name || '',
        type: scoutItem.type || 'KNOT',
        category: scoutItem.category || 'KNOTS',
        difficulty: scoutItem.difficulty || 1,
        usage: scoutItem.usage || '',
        youtube_link: scoutItem.youtube_link || '',
        model_3d: scoutItem.model_3d || '',
        picture: null,
        video: null,
      });
      setPictureFileName(scoutItem.picture ? scoutItem.picture.split('/').pop() : '');
      setVideoFileName(scoutItem.video ? scoutItem.video.split('/').pop() : '');
    } else {
      setIsEditMode(false);
      clearForm();
    }
  }, [scoutItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0] || null;
    setFormData((prev) => ({ ...prev, [name]: file }));

    if (name === 'picture') {
      setPictureFileName(file ? file.name : (scoutItem?.picture ? scoutItem.picture.split('/').pop() : ''));
    } else if (name === 'video') {
      setVideoFileName(file ? file.name : (scoutItem?.video ? scoutItem.video.split('/').pop() : ''));
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      type: 'KNOT',
      category: 'KNOTS',
      difficulty: 1,
      usage: '',
      youtube_link: '',
      model_3d: '',
      picture: null,
      video: null,
    });
    setPictureFileName('');
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
    Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
            data.append(key, formData[key]);
        }
    });

    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': token ? `Bearer ${token}` : '',
    };

    try {
      let response;
      if (isEditMode && scoutItem) {
        response = await axios.put(`${API_CONTENT_BASE_URL}/scout-content/${scoutItem.id}/`, data, { headers });
      } else {
        response = await axios.post(`${API_CONTENT_BASE_URL}/scout-content/`, data, { headers });
      }
      onFormSubmit(response.data);
      clearForm();
      if (onCancel) onCancel();
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} scout content:`, err.response ? err.response.data : err.message);
      if (err.response && err.response.data && typeof err.response.data === 'object') {
        const backendErrors = err.response.data;
        setFieldErrors(backendErrors);
        setFormError('Please correct the highlighted fields.');
      } else {
        setFormError(err.message || 'A network error occurred.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-xl space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">{isEditMode ? 'Edit Scout Content' : 'Add New Scout Content'}</h2>

      {formError && (
        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md mb-4">
          {formError}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black`} />
        {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
        <select id="type" name="type" value={formData.type} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.type ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm`}>
          <option value="KNOT">عقدة</option>
          <option value="LASHING_1">ربطة 1</option>
          <option value="LASHING_2">ربطة 2</option>
        </select>
        {fieldErrors.type && <p className="mt-1 text-xs text-red-600">{fieldErrors.type}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select id="category" name="category" value={formData.category} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.category ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm`}>
          <option value="KNOTS">عقد</option>
          <option value="PIONEERING">عمل ريادي</option>
        </select>
        {fieldErrors.category && <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>}
      </div>

      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
        <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.difficulty ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm`}>
          <option value={1}>Easy</option>
          <option value={2}>Medium</option>
          <option value={3}>Hard</option>
        </select>
        {fieldErrors.difficulty && <p className="mt-1 text-xs text-red-600">{fieldErrors.difficulty}</p>}
      </div>

      <div>
        <label htmlFor="usage" className="block text-sm font-medium text-gray-700">Usage</label>
        <textarea id="usage" name="usage" value={formData.usage} onChange={handleChange} rows={4} className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.usage ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black`} />
        {fieldErrors.usage && <p className="mt-1 text-xs text-red-600">{fieldErrors.usage}</p>}
      </div>

      <div>
        <label htmlFor="youtube_link" className="block text-sm font-medium text-gray-700">YouTube Link</label>
        <input id="youtube_link" name="youtube_link" type="url" value={formData.youtube_link} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.youtube_link ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black`} />
        {fieldErrors.youtube_link && <p className="mt-1 text-xs text-red-600">{fieldErrors.youtube_link}</p>}
      </div>

      <div>
        <label htmlFor="model_3d" className="block text-sm font-medium text-gray-700">3D Model Link</label>
        <input id="model_3d" name="model_3d" type="url" value={formData.model_3d} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${fieldErrors.model_3d ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black`} />
        {fieldErrors.model_3d && <p className="mt-1 text-xs text-red-600">{fieldErrors.model_3d}</p>}
      </div>

      <div>
        <label htmlFor="picture" className="block text-sm font-medium text-gray-700">Picture</label>
        <input id="picture" name="picture" type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm" />
        {pictureFileName && <p className="mt-1 text-xs text-gray-500">Current file: {pictureFileName}</p>}
        {fieldErrors.picture && <p className="mt-1 text-xs text-red-600">{fieldErrors.picture}</p>}
      </div>

      <div>
        <label htmlFor="video" className="block text-sm font-medium text-gray-700">Video</label>
        <input id="video" name="video" type="file" accept="video/*" onChange={handleFileChange} className="mt-1 block w-full text-sm" />
        {videoFileName && <p className="mt-1 text-xs text-gray-500">Current file: {videoFileName}</p>}
        {fieldErrors.video && <p className="mt-1 text-xs text-red-600">{fieldErrors.video}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button type="button" onClick={() => { clearForm(); onCancel(); }} className="px-4 py-2 border rounded-md">
            Cancel
          </button>
        )}
        <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          {isEditMode ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}
