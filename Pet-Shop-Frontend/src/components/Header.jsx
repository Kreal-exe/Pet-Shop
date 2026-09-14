import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux"; // Импортируем useSelector
import logo from "../assets/logo.svg";
import cart from "../assets/cart.svg";
import { selectCartCount } from "../app/cartSlice"; // Импортируем селектор

const Header = () => {
    // Получаем количество товаров в корзине из Redux
    const cartCount = useSelector(selectCartCount);

    return (
        <header className="header">
            <div className="header_container">
                <NavLink to="/" className="logo-link">
                    <img src={logo} alt="Pet Shop Logo" className="logo" />
                </NavLink>
                <nav className="nav">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Main Page
                    </NavLink>
                    <NavLink
                        to="/categories"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Categories
                    </NavLink>
                    <NavLink
                        to="/products"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        All Products
                    </NavLink>
                    <NavLink
                        to="/discounts"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        All Sales
                    </NavLink>
                </nav>
                <div className="cart-container">
                    <NavLink to="/cart" className="cart-link">
                        <img src={cart} alt="Cart" className="cart" />
                    </NavLink>
                    {/* Отображаем количество товаров в корзине */}
                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </div>
            </div>
        </header>
    );
};

export default Header;