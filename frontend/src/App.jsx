import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import StoreList from './components/stores/StoreList';
import StoreCreate from './components/StoreCreate';

const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-indigo-700 via-cyan-400 to-indigo-600 text-gray-100">
      <Router>
        <Navbar />
        <main className="flex-grow container mx-auto p-6">
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <StoreList />
                </RequireAuth>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin/create-store"
              element={
                <RequireAuth>
                  {user?.role === 'system_admin' ? <StoreCreate /> : <p>Unauthorized</p>}
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
