import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import Aside from './Aside';
import AdminHeader from './AdminHeader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;  // Changed to 6 records per page

  useEffect(() => {
    const unsubscribe = db.collection('orders').onSnapshot(snapshot => {
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Order data:', data);
        return {
          product: data.product || {},
          addressInfo: data.addressInfo || {},
        };
      });
      setOrders(ordersData);
    });
    return () => unsubscribe();
  }, []);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const nextPage = () => {
    if (currentPage * ordersPerPage < orders.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div>
      <div className="flex h-screen bg-gray-800">
        <Aside />
        <div className="flex flex-col flex-1 w-full overflow-y-auto">
          <AdminHeader />
          <main className="min-h-screen">
            <div className="grid mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-100 border-4 border-green-400">
              <div className="grid grid-cols-12 gap-6">
                <div className="grid grid-cols-12 col-span-12 gap-6 xxl:col-span-9">
                  <div className="col-span-12 mt-8">
                    <div className="flex items-center h-10 intro-y">
                      <h2 className="mr-5 text-lg font-medium truncate mb-2">ORDERS</h2>
                    </div>
                    {orders.length === 0 && <div>No orders to display</div>}
                    <div className="grid grid-cols-12 gap-8 mb-7">
                      {currentOrders.map((order, orderIndex) => (
                        <div key={orderIndex} className="col-span-12 sm:col-span-6 xl:col-span-4">
                          {Object.keys(order.product).length === 0 ? (
                            <div>No products in this order</div>
                          ) : (
                            <div className="mb-2">
                              <div className="transform hover:scale-105 transition duration-300 shadow-xl rounded-lg intro-y bg-white">
                                <div className="p-5">
                                  <div className="flex justify-between">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                  </div>
                                  <div className="ml-2 w-full flex-1">
                                    <div>
                                      <div className="mt-1 text-base text-gray-600"><b>Product Name:</b> {order.product.ProductName}</div>
                                      <div className="mt-1 text-base text-gray-600"><b>Price:</b> {order.product.ProductPrice}</div>
                                      <div className="mt-1 text-base text-gray-600"><b>Type:</b> {order.product.TransactionType}</div>
                                      <div className="mt-1 text-base text-gray-600"><b>Customer Name:</b> {order.addressInfo.name}</div>
                                      <div className="mt-1 text-base text-gray-600"><b>Order Date:</b> {order.addressInfo.date}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4">
                      <button 
                        onClick={prevPage} 
                        disabled={currentPage === 1} 
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                      >
                        Previous
                      </button>
                      <button 
                        onClick={nextPage} 
                        disabled={currentPage * ordersPerPage >= orders.length} 
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Orders;
