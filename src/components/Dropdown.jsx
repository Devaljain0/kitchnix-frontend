import { useState } from "react";

function Dropdown({ label, items }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (onClick) => {
    if (onClick) onClick(); // Execute the item's onClick function if provided
    setDropdownOpen(false); // Optionally close the dropdown after an item is clicked
  };

  return (
    <div className="relative inline-block">
      <button
        id="dropdownHoverButton"
        onClick={toggleDropdown}
        className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center transition-all duration-300 ease-in-out"
        type="button"
      >
        {label}
        <svg
          className="w-2.5 h-2.5 ms-3 transition-transform duration-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
  
      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div
          id="dropdownHover"
          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 mt-2 transition-opacity duration-300 ease-in-out"
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-500">
            {items.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href || "#"}
                  onClick={() => handleItemClick(item.onClick)}
                  className="block px-4 py-2 hover:bg-green-600 hover:text-white transition-colors duration-200 ease-in-out rounded-md"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
  
  export default Dropdown;
