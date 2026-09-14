import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'; // Для работы с Redux
import { NavLink } from 'react-router-dom';
import { addItem } from '../app/cartSlice'; // Импортируем действие добавления в корзину
import { getProducts, imageUrl } from '../services/api';

export default function DiscountProducts({ limit, shortPath }) {
    const dispatch = useDispatch(); // Получаем доступ к dispatch
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOption, setSortOption] = useState('default');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                const discountedProducts = data.filter(product => product.discont_price);
                setProducts(discountedProducts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const limitedProducts = limit ? products?.slice(0, limit) : products;

    const filteredProducts = limitedProducts?.filter((product) => {
        const priceInRange = !minPrice || product.price >= parseFloat(minPrice);
        const maxPriceInRange = !maxPrice || product.price <= parseFloat(maxPrice);
        return priceInRange && maxPriceInRange;
    });

    const sortedProducts = filteredProducts?.slice().sort((a, b) => {
        switch (sortOption) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'price: high-low':
                return b.price - a.price;
            case 'price: low-high':
                return a.price - b.price;
            default:
                return 0;
        }
    });

    if (loading) {
        return null;
    }

    if (!products || !Array.isArray(products)) {
        return <div>No discounted products available.</div>;
    }

    // Обработчик добавления товара в корзину
    const handleAddToCart = (product) => {
        dispatch(addItem({ ...product, quantity: 1 })); // Добавляем товар с количеством 1
    };

    return (
        <div className="ProductListPage">
            {shortPath ? (
                <div className="homeCategories">
                    <h2>Sale</h2>
                    <span className="sale_home_under_nav-line"></span>
                    <NavLink className="under_nav-item" to="/discounts">All Sales</NavLink>
                </div>
            ) : (
                <nav className="under_nav">
                    <div className="under_nav-container">
                        <NavLink className="under_nav-item" to="/">Main page</NavLink>
                        <span className="under_nav-line"></span>
                        <span className="under_nav-item">Sales</span>
                    </div>
                </nav>
            )}

            {!shortPath && <h2>Discounted Products</h2>}

            {!shortPath &&
            <div className="filters">
                <div className="price-filter">
                    <label htmlFor="min-price">Price from:</label>
                    <input
                        type="number"
                        id="min-price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className='price-filter-input'
                    />
                    <label htmlFor="max-price">to:</label>
                    <input
                        type="number"
                        id="max-price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className='price-filter-input'
                    />
                </div>

                <div className="sort-filter">
                    <label htmlFor="sort-option">Sorted:</label>
                    <select
                        id="sort-option"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="default">by default</option>
                        <option value="newest">newest</option>
                        <option value="price: high-low">price: high-low</option>
                        <option value="price: low-high">price: low-high</option>
                    </select>
                </div>
            </div> }

            <div className="product-grid">
                {sortedProducts?.map((product) => (
                    <NavLink
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="product-card"
                    >
                        <div className="productCard_imgBox">
                            <img
                                src={imageUrl(product.image)}
                                alt={product.title}
                                className="productCard_img"
                            />
                            {product.discont_price && (
                                <div className="discount-badge">
                                    {Math.round(((product.price - product.discont_price) / product.price) * 100)}%
                                </div>
                            )}
                            <div className="add-to-cart-box">
                                <button
                                    className="add-to-cart-button"
                                    onClick={(e) => {
                                        e.preventDefault(); // Предотвращаем переход по ссылке
                                        handleAddToCart(product); // Добавляем товар в корзину
                                    }}
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                        <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>
                            <div className="product-price">
                                <span className="current-price">${product.discont_price}</span>
                                <span className="original-price">${product.price}</span>
                            </div>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}