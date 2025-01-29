import React, { useState } from 'react';
import { storage, db } from '../../firebase';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddProduct = () => {
    const [email, setEmail] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productImg, setProductImg] = useState(null);
    const [productDes, setProductDes] = useState('');
    const [productType, setProductType] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [bathrooms, setBathrooms] = useState();
    const [bedrooms, setBedrooms] = useState();
    const [furnished, setFurnished] = useState(false);
    const [error, setError] = useState('');

    const types = ['image/png', 'image/jpeg']; 

    const productImgHandler = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile && types.includes(selectedFile.type)) {
            setProductImg(selectedFile);
            setError('');
        } else {
            setProductImg(null);
            setError('Please select a valid image type (jpg or png)');
        }
    }

    const addProduct = (e) => {
        e.preventDefault();
    
        if (!productName || !productPrice || !productImg || !productDes || !productType || !transactionType || !email) {
            setError('Please fill in all fields');
            return;
        }
    
        e.target.querySelector('button[type="submit"]').disabled = true;
    
        // Check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email');
            e.target.querySelector('button[type="submit"]').disabled = false;
            return;
        }
    
        db.collection('Register')
            .where('email', '==', email)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    setError('Email not registered');
                    e.target.querySelector('button[type="submit"]').disabled = false;
                    return;
                }
    
                const uploadTask = storage.ref(`product-images/${productImg.name}`).put(productImg);
                uploadTask.on(
                    'state_changed',
                    snapshot => {
                        // Track the upload progress if needed
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(progress);
                    },
                    err => {
                        setError(err.message);
                        e.target.querySelector('button[type="submit"]').disabled = false;
                    },
                    () => {
                        storage.ref('product-images')
                            .child(productImg.name)
                            .getDownloadURL()
                            .then(url => {
                                const productData = {
                                    ProductName: productName,
                                    ProductPrice: Number(productPrice),
                                    ProductImg: url,
                                    ProductDes: productDes,
                                    ProductType: productType,
                                    TransactionType: transactionType,
                                    Email: email,
                                    Bathrooms: Number(bathrooms),
                                    Bedrooms: Number(bedrooms),
                                    Furnished: furnished
                                };
    
                                if (productType === 'housing') {
                                    db.collection('House')
                                    .add({
                                        ProductName: productName,
                                        ProductPrice: Number(productPrice),
                                        ProductImg: url,
                                        ProductDes: productDes,
                                        ProductType: productType,
                                        TransactionType: transactionType,
                                        Email: email,
                                        Bathrooms: Number(bathrooms),
                                        Bedrooms: Number(bedrooms),
                                        Furnished: furnished

                                    })
                                        .then(() => {
                                            toast.success("Product added successfully",{autoClose : 1200});
                                            setProductName('');
                                            setProductPrice('');
                                            setProductImg(null);
                                            setProductDes('');
                                            setProductType('');
                                            setTransactionType('both');
                                            setBathrooms('');
                                            setBedrooms('');
                                            setFurnished(false);
                                            setEmail('');
                                            setError('');
                                            document.getElementById('file').value = '';
                                            e.target.querySelector('button[type="submit"]').disabled = false;
                                        })
                                        .catch(err => {
                                            setError(err.message);
                                            e.target.querySelector('button[type="submit"]').disabled = false;
                                        });
                                } else {
                                    db.collection('Product')
                                    .add({
                                        ProductName: productName,
                                        ProductPrice: Number(productPrice),
                                        ProductImg: url,
                                        ProductDes: productDes,
                                        ProductType: productType,
                                        TransactionType: transactionType,
                                        Email: email

                                    })
                                        .then(() => {
                                            toast.success("Product added successfully",{autoClose:1000});
                                            setProductName('');
                                            setProductPrice('');
                                            setProductImg(null);
                                            setProductDes('');
                                            setProductType('');
                                            setTransactionType('both');
                                            setEmail('');
                                            setError('');
                                            document.getElementById('file').value = '';
                                            e.target.querySelector('button[type="submit"]').disabled = false;
                                        })
                                        .catch(err => {
                                            setError(err.message);
                                            e.target.querySelector('button[type="submit"]').disabled = false;
                                        });
                                }
                            })
                            .catch(err => {
                                setError(err.message);
                                e.target.querySelector('button[type="submit"]').disabled = false;
                            });
                    }
                );
            })
            .catch((error) => {
                setError(error.message);
                e.target.querySelector('button[type="submit"]').disabled = false;
            });
    };
    
    
    return (
        <div>
            <div className="px-32 py-5 h-screen overflow-y-hidden bg-slate-200">
                <div className="navbar pt-3 flex items-center justify-between px-5">
                    <div className="text-black text-3xl font-bold cursor-pointer">
                        <span className="text-blue-400 font-extrabold text-4xl">Rent-</span>
                        a-Life
                    </div>
                    <div>
                        <Link to={"/"}>
                            <p className="font-bold text-xl">
                                GO
                                <span
                                    id="signupButton"
                                    className="pl-1 text-blue-400 cursor-pointer"
                                >
                                    BACK
                                </span>
                            </p>
                        </Link>
                    </div>
                </div>
                <form onSubmit={addProduct}>
                    <div className="hero-section flex items-center justify-evenly h-full">
                        <div className="hero-left flex-1 flex justify-center items-center">
                            <div
                                style={{ borderColor: "#B7D3DF" }}
                                className="border-4 border-slate-400 p-14 rounded-md shadow-slate-700 shadow-2xl"
                            >
                                <div className="mb-10">
                                    <h2 style={{ color: "#393E46" }} className="text-3xl font-bold">
                                        ADD PRODUCT
                                    </h2>
                                </div>
                                <div
                                    style={{ borderColor: "#B4D4FF" }}
                                    className="flex items-center mb-4 bg-white p-3 border-1 rounded-md"
                                >
                                    <input
                                        className="outline-none w-full px-5"
                                        type="text"
                                        placeholder="Enter Registered Email"
                                        onChange={(e) => setEmail(e.target.value)} value={email}
                                        required
                                    />
                                </div>
                                <div
                                    style={{ borderColor: "#B4D4FF" }}
                                    className="flex items-center mb-4 bg-white p-3 border-1 rounded-md"
                                >
                                    <input
                                        className="outline-none w-full px-5"
                                        type="text"
                                        placeholder="Enter Product Name"
                                        onChange={(e) => setProductName(e.target.value)} value={productName}
                                        required
                                    />
                                </div>
                                <div
                                    style={{ borderColor: "#B4D4FF" }}
                                    className="flex items-center mb-4 bg-white p-3 border-1 rounded-md"
                                >
                                    <input
                                        className="outline-none w-full px-5"
                                        type="number"
                                        placeholder="Enter Poduct Price"
                                        onChange={(e) => setProductPrice(e.target.value)} value={productPrice}
                                        required
                                    />
                                </div>
                                <div
                                    style={{ borderColor: "#B4D4FF" }}
                                    className="flex items-center mb-4 bg-white p-3 border-1 rounded-md"
                                >
                                    <textarea
                                        onChange={(e) => setProductDes(e.target.value)} value={productDes}
                                        className="outline-none w-full px-5"
                                        type="text"
                                        placeholder="Enter Product Description"
                                        required
                                    />
                                </div>
                                <div
                                    style={{ borderColor: "#B4D4FF" }}
                                    className="flex items-center mb-4 bg-white p-3 border-1 rounded-md"
                                >
                                    <select className='form-control' onChange={(e) => setProductType(e.target.value)} value={productType} placeholder="Select Product Type">
                                        <option>Select Product Type</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="housing">Housing</option>
                                        <option value="vehicle">Vehicle</option>
                                        <option value="musical instrument">Musical Instrument</option>
                                        <option value="furniture">Furniture</option>
                                    </select>
                                </div>
                                {productType === 'housing' && (
                                    <>
                                        <div
                                            style={{ borderColor: "#B4D4FF" }}
                                            className="flex items-center mb-4 bg-white p-3 border-1 rounded-md"
                                        >
                                            <input
                                                className="outline-none w-full px-5"
                                                type="number"
                                                placeholder="Enter Number of Bathrooms"
                                                onChange={(e) => setBathrooms(e.target.value)}
                                                value={bathrooms}
                                                required
                                            />
                                        </div>
                                        <div
                                            style={{ borderColor: "#B4D4FF" }}
                                            className="flex items-center mb-4 bg-white p-3 border-1 rounded-md"
                                        >
                                            <input
                                                className="outline-none w-full px-5"
                                                type="number"
                                                placeholder="Enter Number of Bedrooms"
                                                onChange={(e) => setBedrooms(e.target.value)}
                                                value={bedrooms}
                                                required
                                            />
                                        </div>
                                        <div
                                            style={{ borderColor: "#B4D4FF" }}
                                            className="flex items-center mb-4 bg-white p-3 border-1 rounded-md"
                                        >
                                            <div>Furnished: </div>
                                            <div style={{ marginLeft: '10px' }}>
                                                <input
                                                    type="radio"
                                                    id="furnished"
                                                    name="furnished"
                                                    value="true"
                                                    checked={furnished === true}
                                                    onChange={() => setFurnished(true)}
                                                />
                                                <label htmlFor="furnished">Yes</label>
                                            </div>
                                            <div style={{ marginLeft: '10px' }}>
                                                <input
                                                    type="radio"
                                                    id="notFurnished"
                                                    name="furnished"
                                                    value="false"
                                                    checked={furnished === false}
                                                    onChange={() => setFurnished(false)}
                                                />
                                                <label htmlFor="notFurnished">No</label>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div
                                    style={{ borderColor: "#B4D4FF" }}
                                    className="flex items-center mb-4 bg-white p-3 border-1 rounded-md"
                                >
                                    <div>Transaction Type: </div>
                                    <div style={{ marginLeft: '10px' }}>
                                        <input
                                            type="radio"
                                            id="sell"
                                            name="transactionType"
                                            value="sell"
                                            checked={transactionType === 'sell'}
                                            onChange={() => setTransactionType('sell')}
                                        />
                                        <label htmlFor="sell">Sell</label>
                                    </div>
                                    <div style={{ marginLeft: '10px' }}>
                                        <input
                                            type="radio"
                                            id="rent"
                                            name="transactionType"
                                            value="rent"
                                            checked={transactionType === 'rent'}
                                            onChange={() => setTransactionType('rent')}
                                        />
                                        <label htmlFor="rent">Rent</label>
                                    </div>
                                    <div style={{ marginLeft: '10px' }}>
                                        <input
                                            type="radio"
                                            id="both"
                                            name="transactionType"
                                            value="both"
                                            checked={transactionType === 'both'}
                                            onChange={() => setTransactionType('both')}
                                        />
                                        <label htmlFor="both">Both</label>
                                    </div>
                                </div>
                                <div
                                    style={{ borderColor: "#B4D4FF" }}
                                    className="flex items-center mb-8 bg-white p-3 border-1 rounded-md"
                                >
                                    <input 
                                        type="file" 
                                        id="file" 
                                        required 
                                        onChange={productImgHandler} 
                                    />
                                </div>
                                <div className=" flex items-center gap-10 ">
                                    <button
                                        type="submit"
                                        className=" bg-slate-200 px-8 py-3 rounded-lg font-bold hover:bg-slate-400 hover:text-white text-slate-500 duration-300 border-2 border-slate-400  "
                                    >
                                        ADD PRODUCT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
