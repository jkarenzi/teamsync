import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import { ReportData } from "../../types/Report";


export const getContributionReport = createAsyncThunk<ReportData[], string>("reports/getContributionReport", async (groupId, thunkAPI) => {
    try {
        const response = await axios.get(`reports/${groupId}`);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
});