import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function  SupplierLogin () {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/supplier/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token); // Store token in local storage
      console.log('Token stored:', localStorage.getItem('token'));
      navigate('/inventory'); // Redirect to inventory on success
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-1/3">
        <h2 className="text-2xl mb-4 text-center text-green-700">Supplier Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-green-400 rounded mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-green-400 rounded mb-4"
        />
        <button type="submit" className="w-full p-2 bg-green-600 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default SupplierLogin;
