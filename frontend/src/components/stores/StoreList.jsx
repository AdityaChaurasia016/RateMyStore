import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

const StoreList = () => {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({}); 
  const [error, setError] = useState('');

  const fetchStores = async () => {
    try {
      const res = await api.get('/stores');
      setStores(res.data);
      const ratingMap = {};
      res.data.forEach(s => {
        ratingMap[s.id] = s.userRating || '';
      });
      setRatings(ratingMap);
    } catch {
      setError('Failed to load stores');
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const submitRating = async (storeId) => {
    const ratingValue = ratings[storeId];
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert('Please enter a rating between 1 and 5');
      return;
    }
    try {
      await api.post('/ratings', { store_id: storeId, rating: Number(ratingValue) });
      alert('Rating submitted!');
      fetchStores();
    } catch {
      alert('Failed to submit rating');
    }
  };

  const handleRatingChange = (storeId, value) => {
    if (value === '' || (Number(value) >= 1 && Number(value) <= 5)) {
      setRatings(prev => ({ ...prev, [storeId]: value }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h2 className="text-4xl font-extrabold text-indigo-100 mb-8 tracking-wide drop-shadow-md">
        Stores
      </h2>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {stores.map(store => (
        <div
          key={store.id}
          className="border border-gray-600 rounded-lg p-6 mb-6 bg-white/10 backdrop-blur-md shadow-lg"
        >
          <h3 className="text-2xl text-gray-200 font-bold  drop-shadow-sm mb-1">
            {store.name}
          </h3>
          <p className=" italic mb-3">{store.address}</p>
          <p className="text-gray-200 font-semibold mb-4">
            Average rating:{' '}
            <span className="text-gray-200">
              {store.averageRating || 'N/A'}
            </span>
          </p>

          {user && user.role === 'normal_user' && (
            <>
              <label className="block mb-2 font-medium text-indigo-200">
                Your rating:
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={ratings[store.id]}
                  onChange={(e) => handleRatingChange(store.id, e.target.value)}
                  className="ml-3 w-16 p-1 rounded-md bg-gray-200 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </label>
              <button
                onClick={() => submitRating(store.id)}
                className="bg-cyan-500 hover:bg-cyan-400 transition rounded-md px-5 py-2 font-semibold text-indigo-900 shadow-md"
              >
                Submit Rating
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default StoreList;
