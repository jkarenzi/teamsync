import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import { Message, sendMessageFormData } from "../../types/Message";

export const sendMessage = createAsyncThunk<Message, sendMessageFormData>(
    "messages/send",
    async (formData, thunkAPI) => {
      try {
        const response = await axios.post('messages', formData);
        return response.data
      } catch (err) {
        return thunkAPI.rejectWithValue(err);
      }
    }
)

export const getGroupMessages = createAsyncThunk<Message[], string>(
    "messages/getAll",
    async (id, thunkAPI) => {
      try {
        const response = await axios.get(`messages/${id}`);
        return response.data
      } catch (err) {
        return thunkAPI.rejectWithValue(err);
      }
    }
)