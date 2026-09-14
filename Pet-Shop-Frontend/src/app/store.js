import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice'; // Импортируем редьюсер корзины

const store = configureStore({
    reducer: {
        cart: cartReducer, // Подключаем редьюсер корзины
    },
});

export default store; // Экспортируем store как default