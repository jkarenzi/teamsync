import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import { createGroupFormData, Group, IUpdateGroupFormData } from "../../types/Group";
import { User } from "../../types/authFormData";


export const createGroup = createAsyncThunk<Group, createGroupFormData>(
  "groups/create",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post("groups", formData);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getAllGroups = createAsyncThunk<Group[], string>(
  "groups/getAll",
  async (assignmentId, thunkAPI) => {
    try {
      const response = await axios.get(`groups/${assignmentId}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getUsersWithoutGroups = createAsyncThunk<User[], string>(
  "groups/getUsersWithoutGroups",
  async (assignmentId, thunkAPI) => {
    try {
      const response = await axios.get(`groups/${assignmentId}/nogrps`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getOwnGroup = createAsyncThunk<Group, string>(
  "groups/getOwn",
  async (assignmentId, thunkAPI) => {
    try {
      const response = await axios.get(`groups/${assignmentId}/own`);
      console.log(response.data)
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const updateGroup = createAsyncThunk<Group, IUpdateGroupFormData>(
  "groups/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axios.patch(`groups/${id}`, formData);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const deleteGroup = createAsyncThunk<string, string>(
  "groups/delete",
  async (groupId, thunkAPI) => {
    try {
      await axios.delete(`groups/${groupId}`);
      return groupId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const autoAssignGroups = createAsyncThunk(
  "groups/autoAssign",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post("groups/auto-assign", formData);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
)