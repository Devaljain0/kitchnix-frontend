import { Search } from "lucide-react";
import Dropdown from "./Dropdown";
import { useNavigate } from "react-router-dom";
import AvatarDropdown from "./AvatarDropdown";
import Logo from '../assets/kithnix_logo.jpg'

const Appbar = () => {
  const handleProfile = () => {
    navigate('/UserProfile'); // Navigate to the AllRecipes page
  };
    const navigate = useNavigate();
    const dropdownItems = [
        {
          label: "Dashboard",
          href: "#",
          onClick: () => alert("Dashboard clicked!"),
        },
        {
          label: "Settings",
          href: "#",
          onClick: () => alert("Settings clicked!"),
        },
        {
          label: "Earnings",
          href: "#",
          onClick: () => alert("Earnings clicked!"),
        },
        {
          label: "Sign out",
          href: "#",
          onClick: () => {
            localStorage.removeItem('token');
            navigate('/login');
          },
        },
      ];

      const avatarItems = [
        {
          label: "Profile",
          onClick: handleProfile,
        },
        {
          label: "Settings",
          href: "#",
          onClick: () => alert("Settings clicked!"),
        },
        {
          label: "Logout",
          href: "#",
          onClick: () => alert("Logout clicked!"),
        },
      ];
    
    return(
        <div className="sticky top-0 flex justify-between items-center border-b py-2  bg-white z-20 shadow-lg">
          <section className="flex pl-5 items-center w-2/5 ">
          <img src={Logo} alt="Kitchnix Logo" className="h-10 w-auto mr-10 mx-10" />
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="w-5" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2"
                placeholder="Search . . ."
                required
              />
            </div>
          </section>
          <nav className="space-x-6 text-sm text-green-600 ">
            <a href="#about" className="hover:underline">About Us</a>
            <a href="#dashboard" className="hover:underline">Dashboard</a>
            <a href="#mealkit" className="hover:underline">MealKit</a>
            <a href="#pricing" className="hover:underline">Pricing</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
          <div className="flex items-center space-x-10  pr-5">
            <Dropdown label="Dropdown" items={dropdownItems} />
            <div className="flex items-center">
              <AvatarDropdown items={avatarItems} />
            </div>
          </div>
        </div>
    )   
}

export default Appbar;