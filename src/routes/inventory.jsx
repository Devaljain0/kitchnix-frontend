import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import SupplierLogin from './SupplierLogin'; // Import the login component

function Inventory() {
  const [ingredients, setIngredients] = useState([]);
  const [form, setForm] = useState({
    ingredient_name: '',
    available_quantity: 0,
    ingredient_cost: 0.0,
  });

  const [editingId, setEditingId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication check

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchIngredients();
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  // Fetch ingredients from the backend
  const fetchIngredients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/ingredients', {
        headers: {
          Authorization: `Bearer ${token}` // Attach token in header
        }
      });
      setIngredients(response.data);
    } catch (error) {
      console.error('Error fetching ingredients', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Add or update an ingredient
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (editingId) {
      // Update existing ingredient
      try {
        await axios.put(`http://localhost:3000/ingredients/${editingId}`, form, {
          headers: {
            Authorization: `Bearer ${token}` // Attach token in header
          }
        });
        fetchIngredients();
        setEditingId(null);
        setForm({ ingredient_name: '', available_quantity: 0, ingredient_cost: 0.0 });
      } catch (error) {
        console.error('Error updating ingredient', error);
      }
    } else {
      // Add new ingredient
      try {
        await axios.post('http://localhost:3000/ingredients', form, {
          headers: {
            Authorization: `Bearer ${token}` // Attach token in header
          }
        });
        fetchIngredients();
        setForm({ ingredient_name: '', available_quantity: 0, ingredient_cost: 0.0 });
      } catch (error) {
        console.error('Error adding ingredient', error);
      }
    }
  };

  // Delete an ingredient
  const deleteIngredient = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/ingredients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Attach token in header
        }
      });
      fetchIngredients();
    } catch (error) {
      console.error('Error deleting ingredient', error);
    }
  };

  // Populate the form for editing
  const editIngredient = (ingredient) => {
    setEditingId(ingredient.ingredient_id);
    setForm({
      ingredient_name: ingredient.ingredient_name,
      available_quantity: ingredient.available_quantity,
      ingredient_cost: ingredient.ingredient_cost,
    });
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // If not authenticated, show the login page
  if (!isAuthenticated) {
    return <supplierLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">Supplier Inventory Management</h1>
        <button className="bg-red-500 text-white py-2 px-4 rounded mb-4" onClick={handleLogout}>
          Logout
        </button>

        {/* Form to add or update ingredient */}
        <form className="bg-green-100 p-6 rounded-lg shadow-md" onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-green-700 font-semibold mb-2">Ingredient Name</label>
            <input
              type="text"
              name="ingredient_name"
              placeholder="Ingredient Name"
              value={form.ingredient_name}
              onChange={handleInputChange}
              className="w-full p-2 border border-green-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-green-700 font-semibold mb-2">Available Quantity</label>
            <input
              type="number"
              name="available_quantity"
              placeholder="Available Quantity"
              value={form.available_quantity}
              onChange={handleInputChange}
              className="w-full p-2 border border-green-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-green-700 font-semibold mb-2">Ingredient Cost (₹)</label>
            <input
              type="number"
              name="ingredient_cost"
              placeholder="Ingredient Cost"
              step="0.01"
              value={form.ingredient_cost}
              onChange={handleInputChange}
              className="w-full p-2 border border-green-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
          >
            {editingId ? 'Update Ingredient' : 'Add Ingredient'}
          </button>
        </form>

        {/* Ingredients List */}
        <h2 className="text-2xl font-bold text-green-700 mt-10 mb-6">Ingredients List</h2>
        <ul className="bg-green-50 p-6 rounded-lg shadow-md">
          {ingredients.map((ingredient) => (
            <li
              key={ingredient.ingredient_id}
              className="mb-4 p-4 border-b border-green-300 flex justify-between items-center"
            >
              <div>
                <span className="font-semibold text-green-700">
                  {ingredient.ingredient_name}
                </span>{' '}
                - {ingredient.available_quantity} units @ ₹{ingredient.ingredient_cost}
              </div>
              <div className="flex space-x-4">
                <button
                  className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                  onClick={() => editIngredient(ingredient)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  onClick={() => deleteIngredient(ingredient.ingredient_id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Inventory;
