import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 glass-container p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center text-white">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-md bg-white/70 text-indigo-900 placeholder-indigo-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-md bg-white/70 text-indigo-900 placeholder-indigo-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
        {error && <p className="text-red-400 text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-cyan-400 text-indigo-900 font-semibold rounded-md py-3 hover:bg-cyan-300 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;