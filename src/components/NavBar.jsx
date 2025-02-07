// NavBar.jsx

import React, { useState, useEffect } from 'react';
import CartWidget from './CartWidget';
import ItemListContainer from './ItemListContainer';
import Search from './Search';  
import getAsyncData from './database';  // Importar la función de base de datos

const NavBar = () => {
    const [category, setCategory] = useState(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Cargar los productos de Firebase usando getAsyncData
        getAsyncData()
            .then(data => {
                setItems(data);  // Guardar los productos obtenidos
            })
            .catch(error => console.error("Error al cargar los datos:", error));

        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart); // Cargar el carrito desde localStorage
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart)); // Guardar carrito en localStorage
    }, [cart]);

    const toggleCategory = (cat) => {
        if (category === cat) {
            setIsCategoryOpen(!isCategoryOpen);
        } else {
            setCategory(cat);
            setIsCategoryOpen(true);
        }
    };

    const handleAddToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, cantidad: cartItem.cantidad + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, cantidad: 1 }];
            }
        });
    };

    return (
        <div className="nav-container">
            <div className="header">
                <div className="header-index">
                    <img src="/imagenes/logo.png" alt="Logo" />
                </div>
                <div className="eslogan">
                    <h1>Somos una empresa apasionada por crear los mejores recuerdos de cada aventura.</h1>
                </div>
                <div className="categories">
                    <div className="contenedor-lista">
                    
                    <button className="categoria-button" onClick={() => toggleCategory('departamentos')}>
                        Departamentos
                    </button>

                    <button className="categoria-button" onClick={() => toggleCategory('excursiones')}>
                        Excursiones
                    </button>
                    
                </div>

                    {isCategoryOpen && category && (
                        <div className="catalogo-tarjeta">
                            <div className="catalogo-header">
                                <h3>{category === 'departamentos' ? 'Catálogo de Departamentos' : 'Catálogo de Excursiones'}</h3>
                            </div>
                            <div className="catalogo-body">
                                <ItemListContainer 
                                    category={category} 
                                    onAddToCart={handleAddToCart} 
                                    items={items.filter(item => item.categoria === category)} 
                                />
                                <button className="cerrar-button" onClick={() => setIsCategoryOpen(false)}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <Search items={items} onAddToCart={handleAddToCart} /> 
            </div>

            <div className="carrito-footer">
                <CartWidget cantidad={cart.length} cart={cart} setCart={setCart} />
            </div>
        </div>
    );
};

export default NavBar; // Asegúrate de exportarlo como default
