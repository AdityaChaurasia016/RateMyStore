import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StoreCreate = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user || user.role !== 'system_admin') {
    return <p>You are not authorized to view this page.</p>;
  }

  const validate = () => {
    if (form.name.length < 1 || form.name.length > 60) return 'Name is required and max 60 chars';
    if (form.address.length > 400) return 'Address max 400 chars';
    return '';
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await api.post('/stores', form);
      setSuccess('Store created successfully!');
      setForm({ name: '', email: '', address: '' });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 glass-container p-8 rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-semibold text-white mb-6 text-center">Create Store</h2>

      <input
        name="name"
        placeholder="Store Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 rounded-md bg-white/70 text-indigo-900 placeholder-indigo-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
      />
      <input
        name="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-md bg-white/70 text-indigo-900 placeholder-indigo-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
      />
      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-md bg-white/70 text-indigo-900 placeholder-indigo-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
      />

      {error && <p className="text-red-400">{error}</p>}
      {success && <p className="text-green-400">{success}</p>}

      <button
        type="submit"
        className="w-full bg-cyan-400 text-indigo-900 font-semibold rounded-md py-3 hover:bg-cyan-300 transition"
      >
        Add Store
      </button>
    </form>
  );
};

export default StoreCreate;