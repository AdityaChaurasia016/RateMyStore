import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    if (form.name.length < 20 || form.name.length > 60) return "Name must be between 20-60 chars";
    if (form.address.length > 400) return "Address max 400 chars";
    const pwdRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;
    if (!pwdRegex.test(form.password)) return "Password needs 8-16 chars, uppercase & special char";
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) return "Invalid email";
    return '';
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    try {
      await api.post('/auth/signup', form);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (e) {
      setError(e.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-12 glass-container p-8 rounded-xl shadow-lg space-y-6"
    >
      <h2 className="text-3xl font-semibold text-white mb-6 text-center">Signup</h2>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 rounded-md bg-white/70 text-indigo-900 placeholder-indigo-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 rounded-md bg-white/70 text-indigo-900 placeholder-indigo-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />
      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-md bg-white/70 text-indigo-900 placeholder-indigo-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 rounded-md bg-white/70 text-indigo-900 placeholder-indigo-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />
      {error && <p className="text-red-400 text-center">{error}</p>}
      <button
        type="submit"
        className="w-full bg-cyan-400 hover:bg-cyan-300 text-indigo-900 font-semibold rounded-md py-3 shadow-md transition"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
