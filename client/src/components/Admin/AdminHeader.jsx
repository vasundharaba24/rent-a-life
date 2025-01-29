import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../../config';
import { FiLogOut } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { db } from '../../../firebase'; // Import db from firebase

const AdminHeader = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]); // Define products state variable
  const [searchResults, setSearchResults] = useState([]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("logged out.!");
      console.log("logged out");
      navigate('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = await db.collection('Product').get();
        const productsData = productsCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Function to filter products based on search query
  const filterProducts = () => {
    return products.filter(product =>
      product.ProductName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Function to handle search input change
  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
    if (event.target.value !== '') {
      // Update search results based on filtered products
      setSearchResults(filterProducts());
    } else {
      // Reset search results when search query is empty
      setSearchResults([]);
    }
  };

  return (
    <div>
      <header className="z-40 py-4 bg-gray-800">
        <div className="flex items-center justify-between h-8 px-6 mx-auto">
          {/* Logo */}
          <a href="/" className="flex items-center">
            {/* Your site logo */}
          </a>

          {/* Logout button */}
          <button
            className="p-1 rounded-md focus:outline-none focus:shadow-outline-purple"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <FiLogOut className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>
    </div>
  );
};

export default AdminHeader;