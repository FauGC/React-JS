import React from "react";
import './style.css';

const CartWidget = ({ cantidad, toggleCarrito }) => {
    return (
        <div className="cart-widget" onClick={toggleCarrito}>
            <i className="bi bi-cart cart-icon"></i>
            {cantidad > 0 && (
                <span className="cart-count">
                    {cantidad}
                </span>
            )}
        </div>
    );
};

export default CartWidget;
