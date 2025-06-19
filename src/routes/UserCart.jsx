import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Ensure jwt-decode is correctly imported
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]); // Ensure it's initialized as an array
  const [totalSum, setTotalSum] = useState(0);
  const token = localStorage.getItem('token'); // Assuming the token is stored here
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    if (token) {
      const { email } = jwtDecode(token); // Decode the token to get the email
      fetchCartItems(email);
    }
  }, [token]);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.recipe_cost) || 0) * ((item.quantity) || 0), 0);
    setTotalSum(total);
  }, [cartItems]);

  const fetchCartItems = async (userEmail) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/cart/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}` // Add the token to the request headers
        }
      });
      console.log('Cart Items:', response.data);
      // Ensure that the response data is always an array
      setCartItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]); // Reset cart items on error
    }
  };

  const handleAdd = async (recipeId) => {
    try {
      await axios.post('http://localhost:3000/api/v1/cart/add', { recipe_id: recipeId, quantity: 1 }, {
        headers: {
          Authorization: `Bearer ${token}` // Add the token to the request headers
        }
      });
      fetchCartItems(jwtDecode(token).email); // Refresh cart after adding
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const handleRemove = async (recipeId) => {
    const email = jwtDecode(token).email; // Extract email again
    try {
      await axios.delete(`http://localhost:3000/api/v1/cart/remove/${email}/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Add the token to the request headers
        }
      });
      fetchCartItems(email); // Refresh cart after removing
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handlePlaceOrder = async () => {
    const userEmail = jwtDecode(token).email; // Extract email again
    const orderDetails = cartItems.map(item => ({
      user_email: userEmail,
      recipe_id: item.recipe_id,
      ingredients_added: item.ingredients_added || '', 
      ingredients_removed: item.ingredients_removed || '',
      order_cost: (parseFloat(item.recipe_cost) || 0) * ((item.quantity) || 0) // 
    }));

    try {
      await axios.post('http://localhost:3000/api/v1/order/place', { orders: orderDetails }, {
        headers: {
          Authorization: `Bearer ${token}` // Add the token to the request headers
        }
      });
      // Optionally clear cart or show a success message
      alert('Order placed successfully!');
      navigate('/order'); // Navigate to the '/order' route
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Cart Items</h2>
          </div>
          <div className="p-6">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.recipe_id} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center">
                    <img src={item.recipe_imgurl} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">${parseFloat(item.recipe_cost).toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => handleAdd(item.recipe_id)} className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">+</button>
                    <span className="mx-2 font-semibold">{(item.quantity || 0)}</span>
                    <button onClick={() => handleRemove(item.recipe_id)} className="ml-2 text-gray-500 hover:text-gray-700">✖</button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-gray-200"></div>
          <div className="p-6 flex justify-between items-center">
            <div className="text-xl font-bold">Total: ${isNaN(totalSum) ? '0.00' : totalSum.toFixed(2)}</div>
            <button onClick={handlePlaceOrder} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCart;
