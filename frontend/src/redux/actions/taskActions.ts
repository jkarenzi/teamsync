import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import { CreateTaskFormData, IUpdateTaskFormData, Task } from "../../types/Task";


export const createTask = createAsyncThunk<Task, CreateTaskFormData>("tasks/createTask", async (formData, thunkAPI) => {
    try {
        const response = await axios.post("tasks", formData);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const getTasksByGroup = createAsyncThunk<Task[], string>("tasks/getTasksByGroup", async (groupId, thunkAPI) => {
    try {
        const response = await axios.get(`tasks/group/${groupId}`);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const getTasksByUser = createAsyncThunk<Task[]>("tasks/getTasksByUser", async (_, thunkAPI) => {
    try {
        const response = await axios.get("tasks/user");
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const updateTask = createAsyncThunk<Task, IUpdateTaskFormData>("tasks/updateTask", async ({ id, formData }, thunkAPI) => {
    try {
        const response = await axios.patch(`tasks/${id}`, formData);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const deleteTask = createAsyncThunk<string, string>("tasks/deleteTask", async (id, thunkAPI) => {
    try {
        await axios.delete(`tasks/${id}`);
        return id
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
});
