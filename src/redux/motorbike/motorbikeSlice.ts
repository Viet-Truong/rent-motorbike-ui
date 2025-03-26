import { FormMotorbikeData } from '@/type/motorbike';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as motorbikeServices from '@/services/motorbikeServices';

export interface IMotorbike {
  motorbike_id: number;
  motorbike_name: string;
  brand: string;
  status: string;
  motorbike_license_plates: string;
  motorbike_type: string;
  rent_cost: number;
  description: string;
  condition: string;
  slug: string;
  shop_id: number;
  images: string[];
  calendar: { start_date: string; end_date: string }[];
}

const initialState: {
  motorbikes: IMotorbike[];
  isCreateSuccess: null | boolean;
  isUpdateSuccess: null | boolean;
  isDeleteSuccess: null | boolean;
} = {
  motorbikes: [],
  isCreateSuccess: null,
  isUpdateSuccess: null,
  isDeleteSuccess: null,
};

export const fetchMotorbikes = createAsyncThunk(
  'motorbikes/fetchMotorbike',
  async (shop_id: number) => {
    const res = await await motorbikeServices.getAllMotorbikeAdmin(shop_id);
    if (res?.data.type === 'success') {
      return res.data.data;
    }
  }
);

export const addNewMotorbike = createAsyncThunk(
  'motorbikes/addNewMotorbike',
  async (payload: FormMotorbikeData, { dispatch }) => {
    const res = await motorbikeServices.addMotorbike({ ...payload });
    if (res.type) {
      dispatch(fetchMotorbikes(payload.shop_id));
    }
  }
);

export const updateMotorbike = createAsyncThunk(
  'motorbikes/updateMotorbike',
  async (payload: FormMotorbikeData, { dispatch }) => {
    const res = await motorbikeServices.updateMotorbike({ ...payload });
    if (res.type) {
      dispatch(fetchMotorbikes(payload.shop_id));
    }
  }
);

export const motorbikeSlice = createSlice({
  name: 'motorbike',
  initialState,
  reducers: {
    resetCreate: (state) => {
      state.isCreateSuccess = null;
    },
    resetUpdate: (state) => {
      state.isUpdateSuccess = null;
    },
    resetDelete: (state) => {
      state.isDeleteSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMotorbikes.fulfilled, (state, action) => {
        state.motorbikes = action.payload;
      })
      .addCase(addNewMotorbike.fulfilled, (state) => {
        state.isCreateSuccess = true;
      })
      .addCase(updateMotorbike.fulfilled, (state) => {
        state.isUpdateSuccess = true;
      });
  },
});

export const { resetCreate, resetUpdate, resetDelete } = motorbikeSlice.actions;

export default motorbikeSlice.reducer;
