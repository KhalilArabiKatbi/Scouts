import { useState } from 'react';
import axios from 'axios';

export default function ChantForm({ onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    lyrics: '',
    category: 'CAMPFIRE',
    difficulty: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/chants/', formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      onAdd(response.data);
      setFormData({ title: '', lyrics: '', category: 'CAMPFIRE', difficulty: 1 });
    } catch (error) {
      console.error('Error adding chant:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Add New Chant</h2>
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <textarea
          placeholder="Lyrics"
          value={formData.lyrics}
          onChange={(e) => setFormData({...formData, lyrics: e.target.value})}
          className="p-2 border rounded"
          rows={4}
          required
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="p-2 border rounded"
        >
          <option value="CAMPFIRE">Campfire</option>
          <option value="MARCHING">Marching</option>
          <option value="TRADITIONAL">Traditional</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Chant
        </button>
      </div>
    </form>
  );
}