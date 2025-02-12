import React, { useState, useEffect } from 'react';
import { createBuyOrder } from './database';

const CartWidget = ({ cantidad, cart, setCart }) => {
    const [isCarritoVisible, setIsCarritoVisible] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [userData, setUserData] = useState({
        username: "",
        surname: "",
        age: "",
        email: "",
        phone: ""
    });
    const [purchaseCompleted, setPurchaseCompleted] = useState(false); 

    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, [setCart]);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cart));
    }, [cart]);

    const toggleCarrito = () => {
        setIsCarritoVisible(!isCarritoVisible);
    };

    const incrementarCantidad = (id) => {
        const storedStock = JSON.parse(localStorage.getItem('stock')) || {};
        if (storedStock[id] > 0) {
            const updatedCart = cart.map(producto =>
                producto.id === id ? { ...producto, cantidad: producto.cantidad + 1 } : producto
            );
            setCart(updatedCart);
            storedStock[id] = storedStock[id] - 1;
            localStorage.setItem('stock', JSON.stringify(storedStock));
            window.dispatchEvent(new CustomEvent('stockUpdated'));
        }
    };

    const decrementarCantidad = (id) => {
        const updatedCart = cart.map(producto => {
            if (producto.id === id && producto.cantidad > 1) {
                return { ...producto, cantidad: producto.cantidad - 1 };
            }
            return producto;
        });
        const producto = cart.find(p => p.id === id);
        if (producto && producto.cantidad > 1) {
            const storedStock = JSON.parse(localStorage.getItem('stock')) || {};
            storedStock[id] = (storedStock[id] || 0) + 1;
            localStorage.setItem('stock', JSON.stringify(storedStock));
            window.dispatchEvent(new CustomEvent('stockUpdated'));
        }
        setCart(updatedCart);
    };

    const eliminarProducto = (id) => {
        const producto = cart.find(p => p.id === id);
        if (producto) {
            const quantityToRestore = producto.cantidad;
            const storedStock = JSON.parse(localStorage.getItem('stock')) || {};
            storedStock[id] = (storedStock[id] || 0) + quantityToRestore;
            localStorage.setItem('stock', JSON.stringify(storedStock));
            window.dispatchEvent(new CustomEvent('stockUpdated'));
        }
        const updatedCart = cart.filter(producto => producto.id !== id);
        setCart(updatedCart);
    };

    const vaciarCarrito = () => {
        const storedStock = JSON.parse(localStorage.getItem('stock')) || {};
        cart.forEach(producto => {
            storedStock[producto.id] = (storedStock[producto.id] || 0) + producto.cantidad;
        });
        localStorage.setItem('stock', JSON.stringify(storedStock));
        window.dispatchEvent(new CustomEvent('stockUpdated'));
        setCart([]);
    };

    const calcularTotal = () => {
        return cart.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    };

    const onInputChange = (evt) => {
        const inputName = evt.target.name;
        const newUserData = { ...userData };
        newUserData[inputName] = evt.target.value;
        setUserData(newUserData);
    };

    const onSubmit = () => {
        const orderData = {
            userData,
            items: cart,
            total: calcularTotal()
        };
        createBuyOrder(orderData)
            .then(newOrderId => {
                console.log('Compra realizada con éxito, orden ID:', newOrderId, orderData);
                setOrderId(newOrderId); 
            })
            .catch(error => {
                console.error("Error al crear la orden:", error);
            });
    };

    const realizarCompra = () => {
        onSubmit();
        vaciarCarrito();
        localStorage.clear();
        setUserData({ username: "", surname: "", age: "", email: "", phone: "" }); 
        setPurchaseCompleted(true); 
        setIsCarritoVisible(false);
    };

    const isFormComplete = userData.username && userData.surname && userData.age && userData.email && userData.phone;

    return (
        <div>
            <div className="cart-widget" onClick={toggleCarrito}>
                <button className="boton-micarrito">Mi carrito ({cantidad})</button>
            </div>

            {isCarritoVisible && (
                <div className="carrito-tarjeta">
                    <div className="carrito-header"></div>
                    <div className="carrito-body">
                        {cart.length > 0 ? (
                            cart.map(producto => {
                                const imageUrl = producto.imagenes && producto.imagenes[0]
                                    ? producto.imagenes[0]
                                    : 'default.jpg';
                                return (
                                    <div key={producto.id} className="producto-en-carrito">
                                        <div className="producto-imagen">
                                            <img src={imageUrl} alt={producto.nombre} />
                                        </div>
                                        <div className="producto-detalles">
                                            <h4>{producto.nombre}</h4>
                                            <p>Precio: USD${producto.precio}</p>
                                            <p>Cantidad: {producto.cantidad}</p>
                                        </div>
                                        <div className="producto-botones">
                                            <button 
                                                className="boton-cantidadcarrito" 
                                                onClick={() => incrementarCantidad(producto.id)}
                                                disabled={(() => {
                                                    const storedStock = JSON.parse(localStorage.getItem('stock')) || {};
                                                    return storedStock[producto.id] <= 0;
                                                })()}
                                            >
                                                +
                                            </button>
                                            <button 
                                                className="boton-cantidadcarrito" 
                                                onClick={() => decrementarCantidad(producto.id)}
                                            >
                                                -
                                            </button>
                                            <button 
                                                className="boton-eliminarcarrito" 
                                                onClick={() => eliminarProducto(producto.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No hay productos en el carrito.</p>
                        )}
                    </div>
                    <div className="carrito-total">
                        <p><strong>Total: </strong>USD${calcularTotal()}</p>
                    </div>
                    <button 
                        className="boton-vaciarcarrito" 
                        onClick={vaciarCarrito}>
                        Vaciar Carrito
                    </button>
                </div>
            )}

            {cart.length > 0 && (
                <form className="form-container">
                    <h2>Completa tus datos para completar la compra🛍</h2>

                    <div className="input-group">
                        <label className="label">Nombre</label>
                        <input className="input" name="username" type="text" onChange={onInputChange} value={userData.username} />
                    </div>

                    <div className="input-group">
                        <label className="label">Apellido</label>
                        <input className="input" name="surname" type="text" onChange={onInputChange} value={userData.surname} />
                    </div>

                    <div className="input-group">
                        <label className="label">Edad</label>
                        <input className="input" name="age" type="text" onChange={onInputChange} value={userData.age} />
                    </div>

                    <div className="input-group">
                        <label className="label">E-mail</label>
                        <input className="input" name="email" type="text" onChange={onInputChange} value={userData.email} />
                    </div>

                    <div className="input-group">
                        <label className="label">Teléfono:</label>
                        <input className="input" name="phone" type="text" onChange={onInputChange} value={userData.phone} />
                    </div>
                </form>
            )}

            {cart.length > 0 && (
                <div className="realizar-compra-container">
                    <button 
                        className="boton-realizar-compra" 
                        onClick={realizarCompra}
                        disabled={!isFormComplete}
                    >
                        Realizar compra
                    </button>
                    {!isFormComplete && (
                        <p style={{ color: 'red' }}>Completa tus datos personales antes de realizar la compra.</p>
                    )}
                    {purchaseCompleted && (
                        <p style={{ color: 'green' }}>¡Compra realizada con éxito! Puedes seguir comprando.</p>
                    )}
                </div>
            )}

            {purchaseCompleted && orderId && (
                <div className="order-id-message" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f1f1f1', textAlign: 'center' }}>
                    <p><strong>Tu número de ID es: {orderId}</strong></p>
                    <p>Es muy importante que lo recuerdes ya que es el comprobante de tu compra.</p>
                </div>
            )}
        </div>
    );
};

export default CartWidget;
