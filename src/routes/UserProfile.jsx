import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function UserProfile() {
  const [profile, setProfile] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.email) {
          setEmail(decoded.email);
        }
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setFormData({
          name: res.data.name || "",
          phone: res.data.phone || "",
          address: res.data.address || ""
        });
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:3000/api/v1/user/profile", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/user/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders || []);
      setShowOrders(true);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Profile Details</h2>

        {isEditing ? (
          <>
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Phone"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Address"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleSave}
            >
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Address:</strong> {profile.address}</p>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      <div className="mb-4">
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={fetchOrders}
        >
          Your Orders
        </button>
      </div>

      {showOrders && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map(order => (
                <li key={order.order_id} className="border p-3 rounded">
                  <p><strong>Order ID:</strong> {order.order_id}</p>
                  <p><strong>Recipe ID:</strong> {order.recipe_id}</p>
                  <p><strong>Ingredients Added:</strong> {order.ingredients_added}</p>
                  <p><strong>Ingredients Removed:</strong> {order.ingredients_removed}</p>
                  <p><strong>Cost:</strong> ₹{order.order_cost}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
