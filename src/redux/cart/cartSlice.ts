import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

export interface ICartItem {
  id: number;
  image?: string;
  name?: string;
  price: number;
  slug?: string;
  startDate?: string | undefined;
  endDate?: string | undefined;
  shop_id?: number;
}

export interface ICart {
  id: string;
  shop_id: number | undefined;
  date: {
    startDate: string | undefined;
    endDate: string | undefined;
  };
  data: ICartItem[];
  checked: boolean;
}

export interface CartState {
  cartItems: ICart[];
}

const storedCartItems = localStorage.getItem('cartItems');
const initialState: CartState = {
  cartItems: storedCartItems ? JSON.parse(storedCartItems) : [],
};

const saveToLocalStorage = (state: CartState) => {
  localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCartItem: (state, action: PayloadAction<ICartItem>) => {
      const { payload } = action;
      if (state.cartItems.length === 0) {
        state.cartItems.push({
          id: uuid(),
          date: {
            startDate: payload.startDate,
            endDate: payload.endDate,
          },
          shop_id: payload.shop_id,
          data: [
            {
              id: payload.id,
              image: payload.image,
              name: payload.name,
              price: payload.price,
              slug: payload.slug,
              shop_id: payload.shop_id,
            },
          ],
          checked: true,
        });
        saveToLocalStorage(state);
      } else {
        const existingCartItemIndex = state.cartItems.findIndex(
          (item) =>
            item.date.startDate === payload.startDate &&
            item.date.endDate === payload.endDate &&
            item.shop_id === payload.shop_id
        );
        if (existingCartItemIndex === -1) {
          state.cartItems.push({
            id: uuid(),
            date: { startDate: payload.startDate, endDate: payload.endDate },
            shop_id: payload.shop_id,
            data: [payload],
            checked: true,
          });
          saveToLocalStorage(state);
        } else {
          const existingMotorbikeIndex = state.cartItems[existingCartItemIndex].data.findIndex(
            (bike) => bike.id === payload.id
          );
          if (existingMotorbikeIndex === -1) {
            state.cartItems[existingCartItemIndex].data.push(payload);
            saveToLocalStorage(state);
          }
        }
      }
    },
    removeItemOfCartItem: (
      state,
      action: PayloadAction<{ cartItemId: string; itemId: number }>
    ) => {
      const { cartItemId, itemId } = action.payload;
      const cartItem = state.cartItems.find((item) => item.id === cartItemId);

      if (cartItem) {
        cartItem.data = cartItem.data.filter((motor) => motor.id !== itemId);
        if (cartItem.data.length === 0) {
          state.cartItems = state.cartItems.filter((item) => item.id !== cartItemId);
        }
      }
      saveToLocalStorage(state);
    },
    removeCartItem: (state, action: PayloadAction<{ cartItemId: string }>) => {
      const { cartItemId } = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== cartItemId);
      saveToLocalStorage(state);
    },

    toggleCartItemChecked: (state, action: PayloadAction<ICart[]>) => {
      state.cartItems = action.payload;
      saveToLocalStorage(state);
    },
  },
});

export const { addCartItem, removeItemOfCartItem, removeCartItem, toggleCartItemChecked } =
  cartSlice.actions;

export default cartSlice.reducer;
