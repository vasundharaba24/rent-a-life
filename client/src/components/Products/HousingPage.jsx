// ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../../../firebase';
import Navbar from '../Navbar';
import Footer from '../Footer1';
import Modal from './Model';
import { auth } from '../../../config'; 

const createOrdersCollection = async () => {
  try {
    const ordersCollectionRef = db.collection('orders');
    const doc = await ordersCollectionRef.get();

    if (doc.empty) {
      await ordersCollectionRef.add({
        placeholder: true
      });
      console.log('Collection "orders" created successfully');
    } else {
      console.log('Collection "orders" already exists');
    }
  } catch (error) {
    console.error('Error creating collection "orders":', error);
  }
};


function HousingPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [ownerName, setOwnerName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    createOrdersCollection();
  }, []);

  const handleTransactionType = (type) => {
    setTransactionType(type);
    setShowModal(true);
    setName('');
    setAddress('');
    setPincode('');
    setPhoneNumber('');
  };

  const buyNow = async () => {
    const user = auth.currentUser;
    if (!user) {
      return toast.error("Please log in to place an order", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }

    if (name === "" || address === "" || pincode === "" || phoneNumber === "") {
      return toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }

    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber,
      date: new Date().toLocaleString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }
      )
    };
  
    try {
   
      const orderInfo = {
        product: product,
        addressInfo: addressInfo,
        date: new Date().toLocaleString(
          "en-US",
          {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }
        ),
        email: user.email,
      
      };
     
      const docRef = await db.collection('orders').add(orderInfo);
      console.log('Order placed successfully with ID: ', docRef.id);
      toast.success('Order Placed Successfully');
  
      console.error('Error placing order:', error); 
      toast.error('Failed to place order. Please try again later.');

      toast.success('Order Placed Successfully');

    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again later.');
    }

    var options = {
      key: "rzp_test_YszXynKy3oW66a",
      key_secret: "O40vsM6hE6CVjNyCEvXHNgOS",
      amount: parseInt(product.ProductPrice * 100),
      currency: "INR",
      order_receipt: 'order_rcptid_' + name,
      name: "E-Bharat",
      description: "for testing purpose",
      handler: function (response) {
        console.log(response);
        toast.success('Payment Successful');
        navigate('/');
         // Add order details to the 'orders' collection

        db.collection('Product').doc(productId).delete()
        .then(() => {
          toast.success('Product Deleted Successfully');
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
          toast.error('Failed to delete product. Please try again later.');
        });

        // Add order details to the 'orders' collection
        db.collection('orders').add(orderInfo)
        .then((docRef) => {
          console.log('Order placed successfully with ID: ', docRef.id);
          toast.success('Order Placed Successfully');
        })
        .catch((error) => {
          console.error('Error placing order:', error);
          toast.error('Failed to place order. Please try again later.');
        });

      },
      theme: {
        color: "#3399cc"
      }
    };
  
    var pay = new window.Razorpay(options);
    pay.open();
  };
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = db.collection('House').doc(productId);
        console.log(productId);
        const doc = await productRef.get();
        if (doc.exists) {
          const productData = doc.data();
          setProduct(productData);
        } else {
          console.log('No such product!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
  
    const fetchProductDetails = async () => {
      try {
        const productDoc = await db.collection('House').doc(productId).get();
        const productData = productDoc.data();
        //console.log(productData);           
        setProduct(productData);
        console.log(productData);

        
        const ownerEmail = productData.Email;
        const ownerQuerySnapshot = await db.collection('Register').where('email', '==', ownerEmail).get();
        if (!ownerQuerySnapshot.empty) {
          const ownerData = ownerQuerySnapshot.docs[0].data();
         
          setOwnerName(ownerData.name); 
          setContactNo(ownerData.contact);
          setProfileImage(ownerData.imageUrl);
          setCity(ownerData.city);
        } else {
          setOwnerName('Owner Name Not Found'); // Handle case where owner's name is not found
        }
      } catch (error) {
        console.error(`Error fetching product details for ${productId}:`, error);
      }
    };

    fetchProductDetails();
  }, [productId]);


  return (
    <div>
      <Navbar />
      {product ? (
        <div>
          <div className="bg-gray-100 dark:bg-gray-800 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row -mx-4">
                <div className="md:flex-1 px-4">
                  <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                    <img className="w-full h-full object-cover rounded" src={product.ProductImg} alt={product.ProductName} />
                  </div>

                  {transactionType && showModal && (
                    <Modal
                      name={name}
                      address={address}
                      pincode={pincode}
                      phoneNumber={phoneNumber}
                      setName={setName}
                      setAddress={setAddress}
                      setPincode={setPincode}
                      setPhoneNumber={setPhoneNumber}
                      buyNow={buyNow}
                    />
                  )}

                  <div className="flex -mx-2 mb-4">
                    {product.TransactionType === 'sell' && (
                      <div className="w-1/2 px-2">
                        <button className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700" onClick={() => handleTransactionType('sell')}>Sell</button>
                      </div>
                    )}
                    {product.TransactionType === 'rent' && (
                      <div className="w-1/2 px-2">
                        <button className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700" onClick={() => handleTransactionType('rent')}>Rent</button>
                      </div>
                    )}
                    {product.TransactionType === 'both' && (
                      <>
                        <div className="w-1/2 px-2">
                          <button className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700" onClick={() => handleTransactionType('sell')}>Sell</button>
                        </div>
                        <div className="w-1/2 px-2">
                          <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600" onClick={() => handleTransactionType('rent')}>Rent</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="md:flex-1 px-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{product.ProductName}</h2>
                  <div className="flex mb-4">
                    <div className="mr-4">
                      <span className="font-bold text-gray-700 dark:text-gray-300 mb-2">Price:</span>
                      <span className="text-gray-600 dark:text-gray-300 mb-2">{product.ProductPrice}.00</span>
                      <div className=''> 
                      <br></br>
                      <p className="font-bold text-gray-700 dark:text-gray-300">Product Description:</p>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                        {product.ProductDes}
                      </p>
                      </div>

                      <div className=''> 
                      <br></br>
                      <p className="font-bold text-gray-700 dark:text-gray-300">Email:</p>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                        {product.Email}
                      </p>
                      <div className= "rounded-full overflow-hidden bg-gray-200 h-10 w-10 flex items-center justify-center shadow-md"
                      style={{
                        boxShadow: '0 0 5px rgba(0, 0, 255, 0.5)',
                        border: 'none',
                      }}>
                      <img className="w-full h-full object-cover rounded" src={profileImage} alt={product.ProductName} />
                    </div>
                      <p className="font-bold text-gray-700 dark:text-gray-300">Owner:</p>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                        {ownerName}
                      </p>

                      <p className="font-bold text-gray-700 dark:text-gray-300">Contact:</p>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                        {contactNo}
                      </p>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                        {city}
                      </p>
                      </div>
                      
                    </div>
                    <div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Footer />
    </div>
  );
}

export default HousingPage;