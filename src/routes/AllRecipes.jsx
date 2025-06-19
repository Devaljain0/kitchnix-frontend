import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Globe, Clock, Loader } from 'lucide-react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


const RecipeCard = ({ id, title, description, image, cooktime }) => {
  const handleAddToCart = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token
    console.log("Token:", token);
    if (!token) {
      console.error('No token found. User might not be logged in.');
      return;
    }

    const checkTokenExpiry = (token) => {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      return decoded.exp < currentTime; // Returns true if token is expired
    };

    if (checkTokenExpiry(token)) {
      console.error('Token is expired. User needs to log in again.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/v1/cart/add', {
        recipe_id: id,
        quantity: 1, // or whatever quantity logic you want
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
        },
      });
      alert(`Recipe ${title} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
    >
      <img src={image || "/placeholder.svg?height=200&width=300"} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-[#15803d] mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span className="flex items-center"><Clock size={16} className="mr-1" /> {cooktime} mins</span>
          <span className="flex items-center"><Globe size={16} className="mr-1" /> {description}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
        >
          Start Cooking
        </button>
      </div>
    </motion.div>
  );
};

const Dropdown = ({ label, items, selectedItem, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22c55e]"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
        >
          {selectedItem || label}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {items.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect(item.label);
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [cuisine, setCuisine] = useState('');
  const [cooktime, setCooktime] = useState(180); // Maximum cook time
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/v1/recipes');
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    (cuisine ? recipe.recipe_cuisine === cuisine : true) &&
    recipe.recipe_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    recipe.recipe_cooktime <= cooktime
  );

  const cuisineOptions = [
    { label: "All Cuisines" },
    { label: "Indian" },
    { label: "Continental" },
    { label: "Chinese" },
    { label: "Italian" },
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      <header className="bg-[#22c55e] shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Discover Delicious Recipes</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}	
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Dropdown
            label="Filter by Cuisine"
            items={cuisineOptions}
            selectedItem={cuisine || "All Cuisines"}
            onSelect={(selected) => setCuisine(selected === "All Cuisines" ? "" : selected)}
          />
          <div className="w-1/3">
            <label htmlFor="cooktime-slider" className="block text-sm font-medium text-gray-700">Cook Time (up to {cooktime} mins)</label>
            <input
              id="cooktime-slider"
              type="range"
              min="10"
              max="180"
              value={cooktime}
              onChange={(e) => setCooktime(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-12 h-12 text-[#22c55e] animate-spin" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.recipe_id}
                  id={recipe.recipe_id}
                  title={recipe.recipe_name}
                  description={recipe.recipe_cuisine}
                  image={recipe.recipe_imgurl}
                  cooktime={recipe.recipe_cooktime}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredRecipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="text-center text-gray-500 mt-8"
          >
            No recipes found for your search criteria.
          </motion.div>
          
        )}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate('/cart')}
            className="bg-[#22c55e] text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
          >
            Go to Cart
          </button>
        </div>
      </main>
    </div>
  );
}
