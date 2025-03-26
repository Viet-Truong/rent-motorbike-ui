import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as employeeService from '@/services/employeeServices';
import { FormUser, User } from '@/type/user';

const initialState: {
  employees: User[];
  isCreateSuccess: boolean;
  isUpdateSuccess: boolean;
  isDeleteSuccess: boolean;
} = {
  employees: [],
  isCreateSuccess: false,
  isUpdateSuccess: false,
  isDeleteSuccess: false,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (shop_id: number) => {
    const res = await employeeService.getAllEmployee(shop_id);
    if (res?.data.type === 'success') {
      return res.data.data;
    }
  }
);

export const addNewEmployees = createAsyncThunk(
  'employees/addNewEmployee',
  async (payload: FormUser, { dispatch }) => {
    const res = await employeeService.addEmployee({ ...payload });
    if (res.type) {
      dispatch(fetchEmployees(payload.shop_id));
    }
  }
);

export const updateEmployees = createAsyncThunk(
  'employees/updateEmployee',
  async (payload: User, { dispatch }) => {
    const res = await employeeService.updateProfile({ ...payload });
    if (res.type) {
      dispatch(fetchEmployees(payload.shop_id));
    }
  }
);

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    resetCreate: (state) => {
      state.isCreateSuccess = false;
    },
    resetUpdate: (state) => {
      state.isUpdateSuccess = false;
    },
    resetDelete: (state) => {
      state.isDeleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
      })
      .addCase(addNewEmployees.fulfilled, (state) => {
        state.isCreateSuccess = true;
      })
      .addCase(updateEmployees.fulfilled, (state) => {
        state.isUpdateSuccess = true;
      });
  },
});

export const { resetCreate, resetUpdate, resetDelete } = employeeSlice.actions;

export default employeeSlice.reducer;
