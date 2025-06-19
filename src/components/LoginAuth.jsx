import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const SigninAuth = () => {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
            // If the token exists, redirect to the dashboard
            navigate('/dashboard');
        }
    }, [navigate]);

    const onClickHandler = async () => {
      try {
          const response = await axios.post('http://localhost:3000/api/v1/login', {
              email,
              password,
          });

          if (response.status === 200) {
              // Save the JWT token to localStorage
              localStorage.setItem('token', response.data.token);
              // Redirect to dashboard
              navigate('/dashboard');
          } else {
              alert('Login failed. Please try again.');
          }
      } catch (error) {
          console.error('Error during login:', error);
          alert('An error occurred during login. Please check your credentials or try again later.');
      }
  };

    return(<div className="h-screen flex flex-col items-center justify-center">
        <div className="flex justify-center">
          <div className="text-4xl font-bold pt-12">
            Login to your account
          </div>
        </div>
        <div className="flex justify-center">
          <div className="text-sm text-slate-600 pt-1">
            Don't have an account?
          </div>
          <div className="text-sm text-slate-600 pt-1 pl-1 underline">
            <Link to='/Signup'>Signup</Link> 
          </div>
        </div>
        
        <div className="w-full max-w-md px-8">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input 
              type="text" 
              onChange={(e) => setEmail(e.target.value)} 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="email@example.com" 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Password" 
              required 
            />
          </div>
          <div className="flex justify-center pt-2">
            <button 
              type="button" 
              onClick={onClickHandler}
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
              Login
            </button>
          </div>
        </div>
      </div>
      
    )
}