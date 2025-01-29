import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { db, storage } from '../../../firebase'; 
import { toast } from 'react-toastify';

const User = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [formData, setFormData] = useState(() => {
    const storedFormData = JSON.parse(localStorage.getItem('formData'));
    return storedFormData || {
      name: userInfo.name,
      email: userInfo.email,
      city: userInfo.city,
      pincode: userInfo.pincode,
      address: userInfo.address,
      contact: userInfo.contact,
    };
  });
  const [profileImageUrl, setProfileImageUrl] = useState(null); 
  const [productDetails, setProductDetails] = useState([]); // State to store product details
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
  
    const fetchUserDetails = async () => {
      try {
        const userDoc = await db.collection('Register').doc(userInfo.UserId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setFormData({
            name: userData.name,
            email: userData.email,
            city: userData.city,
            pincode: userData.pincode,
            address: userData.address,
            contact: userData.contact
          });
          
        } else {
          console.error('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, [userInfo.UserId]); 

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUserInfo) {
          setUserInfo(storedUserInfo);
          setProfileImageUrl(storedUserInfo.imageUrl);
          setIsLoggedIn(true);
          Modal.setAppElement('#root');
        } else {
          const currentUser = firebase.auth().currentUser;
          if (currentUser) {
            const userInfoSnapshot = await db.collection('Register').where('email', '==', currentUser.email).get();
            const userData = userInfoSnapshot.docs.map(doc => ({
              UserId: doc.id,
              ...doc.data(),
            }));
            setUserInfo(userData[0]);
            setProfileImageUrl(userData[0].imageUrl);
            setIsLoggedIn(true);
            Modal.setAppElement('#root');
            localStorage.setItem('userInfo', JSON.stringify(userData[0]));
          } else {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };
  
    fetchUserInfo();
  }, [setUserInfo, navigate]);

  useEffect(() => {
    // Fetch product details uploaded by the user
    const fetchProductDetails = async () => {
      try {
        const snapshot = await db.collection('Product').where('email', '==', userInfo.email).get();
        const products = snapshot.docs.map(doc => doc.data());
        setProductDetails(products);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProductDetails();
  }, [userInfo.email]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUserInfo(prevState => ({
        ...prevState,
        name: formData.name,
        email: formData.email,
        city: formData.city,
        pincode: formData.pincode,
        address: formData.address,
        contact: formData.contact 
      }));

      await db.collection('Register').doc(userInfo.UserId).update({
        name: formData.name,
        email: formData.email,
        city: formData.city,
        pincode: formData.pincode,
        address: formData.address,
        contact: formData.contact 
      });
      toast.success('User details updated successfully!', {autoClose:1000});
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <div>
    <main className="min-h-screen">
    <div className="grid mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-100 border-4 border-green-400">
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Profile Details</h1>
      <div className="flex items-center space-x-4">
        {profileImageUrl && (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold">{formData.name}</h2>
          <p className="text-gray-600">{formData.email}</p>
        </div>
      </div>
      <div className="mt-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 p-2 border border-gray-300  w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 p-2 border border-gray-300  w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
            <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
            <input type="text" id="contact" name="contact" value={formData.contact} onChange={handleInputChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
          </div>
          <div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600">Update Profile</button>
          </div>
        </form>
      </div>

      <div className="mt-4">
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600">Back to Home</button>
      </div>
    </div>
    </div>
    </main>
    </div>
  );
};

export default User;