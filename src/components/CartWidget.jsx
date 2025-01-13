import React, { useState } from 'react';

const CartWidget = ({ cantidad, cart, setCart }) => {
    const [isCarritoVisible, setIsCarritoVisible] = useState(false);

    const toggleCarrito = () => {
        setIsCarritoVisible(!isCarritoVisible);
    };

    const incrementarCantidad = (id) => {
        const updatedCart = cart.map((producto) =>
            producto.id === id
                ? { ...producto, cantidad: producto.cantidad + 1 }
                : producto
        );
        setCart(updatedCart);
    };

    const decrementarCantidad = (id) => {
        const updatedCart = cart.map((producto) =>
            producto.id === id && producto.cantidad > 1
                ? { ...producto, cantidad: producto.cantidad - 1 }
                : producto
        );
        setCart(updatedCart);
    };

    const eliminarProducto = (id) => {
        const updatedCart = cart.filter((producto) => producto.id !== id);
        setCart(updatedCart);
    };

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
                            cart.map((producto) => {
                                const imageUrl = producto.imagenes && producto.imagenes[0]
                                    ? `./imagenes/${producto.imagenes[0]}`
                                    : './imagenes/default.jpg';

                                return (
                                    <div key={producto.id} className="producto-en-carrito">
                                        <div className="producto-imagen">
                                            <img src={imageUrl} alt={producto.nombre} />
                                        </div>
                                        <div className="producto-detalles">
                                            <h4>{producto.nombre}</h4>
                                            <p>Precio: ${producto.precio}</p>
                                            <p>Cantidad: {producto.cantidad}</p>
                                        </div>
                                        <div className="producto-botones">
                                            <button className="boton-cantidadcarrito" onClick={() => incrementarCantidad(producto.id)}>+</button>
                                            <button className="boton-cantidadcarrito" onClick={() => decrementarCantidad(producto.id)}>-</button>
                                            <button className="boton-eliminarcarrito" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No hay productos en el carrito.</p>
                        )}
                    </div>
                    <button className="boton-vaciarcarrito" onClick={() => setCart([])}>Vaciar Carrito</button>
                </div>
            )}
        </div>
    );
};

export default CartWidget;
