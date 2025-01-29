import React, { createContext } from 'react';
import { db } from '../../../firebase';

export const ProductsContext = createContext();

export class ProductsContextProvider extends React.Component {
    state = {
        products: [],
        electronicsProducts: [],
        musicalInstrumentProducts: [],
        vehicleProducts: [],
        housingProducts: [],
        furnitureProducts: [],
        orders: [],
    };

    componentDidMount() {
        // Listen for changes in the Product collection
        const productUnsubscribe = db.collection('Product').onSnapshot(snapshot => {
            let products = [];
            let electronicsProducts = [];
            let musicalInstrumentProducts = [];
            let vehicleProducts = [];
            let furnitureProducts = [];
            let housingProducts = [];
        
            snapshot.forEach(doc => {
                const product = {
                    ProductID: doc.id,
                    ProductName: doc.data().ProductName,
                    ProductPrice: doc.data().ProductPrice,
                    ProductImg: doc.data().ProductImg,
                    ProductType: doc.data().ProductType,
                    ProductDes: doc.data().ProductDes,
                    TransactionType: doc.data().TransactionType,
                    Email: doc.data().Email
                };
        
                products.push(product);
        
                if (product.ProductType === 'electronics') {
                    electronicsProducts.push(product);
                } else if (product.ProductType === 'musical instrument') {
                    musicalInstrumentProducts.push(product);
                } else if (product.ProductType === 'vehicle') {
                    vehicleProducts.push(product);
                } else if (product.ProductType === 'housing') {
                    housingProducts.push(product);
                    
                    db.collection('House').doc(doc.id).set({
                        ProductID: product.ProductID,
                        ProductName: product.ProductName,
                        ProductPrice: product.ProductPrice,
                        ProductDes: product.ProductDes,
                        Email: product.Email,
                        ProductImg: product.ProductImg,
                        TransactionType: product.TransactionType,
                        Bathrooms: product.Bathrooms,
                        Bedrooms: product.Bedrooms,
                        Furnished: product.Furnished
                    });
                } else if (product.ProductType === 'furniture') {
                    furnitureProducts.push(product);
                }
            });

            this.setState({
                products: products,
                electronicsProducts: electronicsProducts,
                musicalInstrumentProducts: musicalInstrumentProducts,
                vehicleProducts: vehicleProducts,
                housingProducts: housingProducts,
                furnitureProducts: furnitureProducts,
            });
        });

        // Listen for changes in the Orders collection
        const ordersUnsubscribe = db.collection('Orders').onSnapshot(snapshot => {
            let orders = [];
            snapshot.forEach(doc => {
                const order = {
                    OrderID: doc.id,
                    ProductName: doc.data().ProductName,
                    ProductPrice: doc.data().ProductPrice,
                    ProductImg: doc.data().ProductImg,
                    ProductDes: doc.data().ProductDes,
                    TransactionType: doc.data().TransactionType,
                    OrderDate: doc.data().OrderDate,
                    Email: doc.data().Email
                };
                orders.push(order);
            });
            this.setState({ orders: orders });
        });

        // Store the unsubscribe functions in state to clean up listeners on unmount
        this.setState({ productUnsubscribe: productUnsubscribe, ordersUnsubscribe: ordersUnsubscribe });
    }

    componentWillUnmount() {
        // Clean up listeners on unmount
        if (this.state.productUnsubscribe) {
            this.state.productUnsubscribe();
        }
        if (this.state.ordersUnsubscribe) {
            this.state.ordersUnsubscribe();
        }
    }

    render() {
        return (
            <ProductsContext.Provider
                value={{
                    products: [...this.state.products],
                    electronicsProducts: [...this.state.electronicsProducts],
                    musicalInstrumentProducts: [...this.state.musicalInstrumentProducts],
                    vehicleProducts: [...this.state.vehicleProducts],
                    housingProducts: [...this.state.housingProducts],
                    furnitureProducts: [...this.state.furnitureProducts],
                    orders: [...this.state.orders],
                }}
            >
                {this.props.children}
            </ProductsContext.Provider>
        );
    }
}
