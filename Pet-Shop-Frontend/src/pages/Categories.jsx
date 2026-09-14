import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getCategories, imageUrl } from '../services/api';

export default function Categories({ limit, shortPath }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const limitedCategories = limit ? categories.slice(0, limit) : categories;

    if (limitedCategories.length === 0) {
        return null;
    }

    return (
        <div className="categories">
            {shortPath ? (
                <div className="homeCategories">
                    <h2>Categories</h2>
                    <span className="home_under_nav-line"></span>
                    <NavLink className="under_nav-item" to="/categories">All Categories</NavLink>
                </div>
            ) : (
                <div>
                    <nav className="under_nav">
                        <div className="under_nav-container">
                            <NavLink className="under_nav-item" to="/">Main page</NavLink>
                            <span className="under_nav-line"></span>
                            <span className="under_nav-item">Categories</span>
                        </div>
                    </nav>
                    <h2>Categories Page</h2>
                </div>
            )}

            <div className='categories_box'>
                {limitedCategories.map((cat) => (
                    <NavLink key={cat.id} to={`/categories/${cat.id}`} className="categories_item">
                        <img src={imageUrl(cat.image)} alt={cat.title} />
                        <h3>{cat.title}</h3>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}