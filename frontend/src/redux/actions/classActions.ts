import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import { createClassFormData, StudentClass, updateClassFormData } from "../../types/StudentClass";


export const createClass = createAsyncThunk<StudentClass, createClassFormData>(
  "classes/create",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post("classes", formData);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getAllClasses = createAsyncThunk<StudentClass[]>(
  "classes/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("classes");
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
)

export const updateClass = createAsyncThunk<StudentClass, updateClassFormData>(
  "classes/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axios.patch(`classes/${id}`, formData);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
)

export const deleteClass = createAsyncThunk<string, string>(
  "classes/delete",
  async (classId, thunkAPI) => {
    try {
      await axios.delete(`classes/${classId}`)
      return classId
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)