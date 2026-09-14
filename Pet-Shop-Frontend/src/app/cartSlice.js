import { createSlice } from '@reduxjs/toolkit';

// Получаем данные из localStorage при инициализации
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) {
            return [];
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("Error loading cart from localStorage:", err);
        return [];
    }
};

// Сохраняем данные в localStorage
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('cart', serializedState);
    } catch (err) {
        console.error("Error saving cart to localStorage:", err);
    }
};

const initialState = {
    items: loadState(), // Инициализируем состояние из localStorage
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.items.push({ ...newItem });
            }

            // Сохраняем состояние в localStorage
            saveState(state.items);
        },
        removeItem: (state, action) => {
            const itemId = action.payload;
            state.items = state.items.filter((item) => item.id !== itemId);

            // Сохраняем состояние в localStorage
            saveState(state.items);
        },
        clearCart: (state) => {
            state.items = [];

            // Очищаем localStorage
            saveState([]);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find((item) => item.id === id);

            if (item) {
                item.quantity += quantity;

                // Удаляем товар, если количество становится меньше или равно 0
                if (item.quantity <= 0) {
                    state.items = state.items.filter((item) => item.id !== id);
                }
            }

            // Сохраняем состояние в localStorage
            saveState(state.items);
        },
    },
});

export const { addItem, removeItem, clearCart, updateQuantity } = cartSlice.actions;

// Селектор для подсчета общего количества товаров в корзине
export const selectCartCount = (state) => {
    return state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
};

export default cartSlice.reducer;