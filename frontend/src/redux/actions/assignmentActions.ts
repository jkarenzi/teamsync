import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import { Assignment, createAssignmentFormData, IUpdateAssignmentFormData } from "../../types/Assignment";


export const createAssignment = createAsyncThunk<Assignment, createAssignmentFormData>(
  "assignments/create",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post('assignments', formData);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getAllAssignments = createAsyncThunk<Assignment[]>(
  "assignments/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('assignments');
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getOwnAssignments = createAsyncThunk<Assignment[]>(
  "assignments/getOwn",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('assignments/own');
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getInstructorAssignments = createAsyncThunk<Assignment[]>(
  "assignments/getByInstructor",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`assignments/instructor`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
)

export const getAssignmentById = createAsyncThunk<Assignment, string>(
  "assignments/getById",
  async (assignmentId, thunkAPI) => {
    try {
      const response = await axios.get(`assignments/${assignmentId}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
)

export const updateAssignment = createAsyncThunk<Assignment, IUpdateAssignmentFormData>(
  "assignments/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axios.patch(`assignments/${id}`, formData);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
)

export const deleteAssignment = createAsyncThunk<string, string>(
  "assignments/delete",
  async (assignmentId, thunkAPI) => {
    try {
      await axios.delete(`assignments/${assignmentId}`);
      return assignmentId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
)
