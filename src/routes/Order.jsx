import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Make sure jwt-decode is installed

const OrderSummary = () => {
  const [orderDetails, setOrderDetails] = useState([]); // Initialize as an empty array
  const [totalOrderCost, setTotalOrderCost] = useState(0);
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

  useEffect(() => {
    if (token) {
      const { email } = jwtDecode(token); // Decode the token to extract the user email
      fetchOrderSummary(email); // Fetch the order summary for the user
    }
  }, [token]);

  useEffect(() => {
    // Calculate total cost of all orders in the summary
    const total = orderDetails.reduce(
      (sum, order) => sum + (parseFloat(order.order_cost) || 0),
      0
    );
    setTotalOrderCost(total);
  }, [orderDetails]);

  const fetchOrderSummary = async (userEmail) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/cart/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}` // Add the token to the request headers
        }
      });
      console.log('Order Summary:', response.data);
      // Ensure the response is an array of order details
      setOrderDetails(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching order summary:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Order Summary</h1>
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Your Orders</h2>
          </div>
          <div className="p-6">
            {orderDetails.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              orderDetails.map((order) => (
                <div key={order.order_id} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                  <div>
                    <h3 className="font-semibold">Order ID: {order.order_id}</h3>
                    <p className="text-sm text-gray-600">Recipe: {order.recipe_name}</p>
                    <p className="text-sm text-gray-600">Ingredients Added: {order.ingredients_added}</p>
                    <p className="text-sm text-gray-600">Ingredients Removed: {order.ingredients_removed}</p>
                    <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                  </div>
                  <div className="text-lg font-bold">
                    ${parseFloat(order.order_cost).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-gray-200"></div>
          <div className="p-6 flex justify-between items-center">
            <div className="text-xl font-bold">Total Order Cost: ${totalOrderCost.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
