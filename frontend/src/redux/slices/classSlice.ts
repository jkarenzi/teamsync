import { createSlice } from "@reduxjs/toolkit";
import {
  createClass,
  getAllClasses,
  updateClass,
  deleteClass,
} from "../actions/classActions";
import { StudentClass } from "../../types/StudentClass";
import { errorToast, successToast } from "../../utils/toast";

type IinitialState = {
  classes: StudentClass[];
  loading: boolean;
  fetching: boolean;
  status: 'idle' | 'successful' | 'failed';
};

const studentClassSlice = createSlice({
  name: "studentClass",
  initialState: {
    classes: [],
    loading: false,
    fetching: false,
    status: 'idle',
  } as IinitialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'successful';
        state.classes = [...state.classes, action.payload]
        successToast('Class created successfully');
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        errorToast(action.payload as string);
      })
      .addCase(getAllClasses.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getAllClasses.fulfilled, (state, action) => {
        state.fetching = false;
        state.classes = action.payload;
      })
      .addCase(getAllClasses.rejected, (state, action) => {
        state.fetching = false;
        errorToast(action.payload as string);
      })
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.map((studentClass) =>
          studentClass.id === action.payload.id ? action.payload : studentClass
        );
        state.status = 'successful';
        successToast('Class updated successfully');
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        errorToast(action.payload as string);
      })
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.filter(
          (studentClass) => studentClass.id !== action.payload
        );
        state.status = 'successful';
        successToast('Class deleted successfully');
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        errorToast(action.payload as string);
      });
  },
});

export const { resetStatus } = studentClassSlice.actions;
export default studentClassSlice.reducer;