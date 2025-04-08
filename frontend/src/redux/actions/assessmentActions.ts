import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/api";
import { ApiResponse } from "../../types/ApiResponse";
import { PeerAssessmentFormData, SelfAssessmentFormData } from "../../types/Assessment";
import { User } from "../../types/authFormData";
import { Group } from "../../types/Group";


interface IData {
    totalPeerAssessments: number,
    unAssessedUsers: {id:string, name:string}[]
}

interface Data {
    status: boolean
}

interface IIData extends IData {
    message:string
}

export interface AssessmentData {
    id:string,
    user: User,
    peerScore: number,
    selfScore: number,
    peerFeedback: string[],
    selfFeedback: string,
    group: Group
}

export const submitPeerAssessment = createAsyncThunk<IIData, PeerAssessmentFormData>("peerAssessments/submit", async (formData, thunkAPI) => {
    try {
        const response = await axios.post(`peerAssessments`, formData);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const getRemainingPeerAssessments = createAsyncThunk<IData, string>("peerAssessments/getRemaining", async (groupId, thunkAPI) => {
    try {
        const response = await axios.get(`peerAssessments/${groupId}/remaining`);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const submitSelfAssessment = createAsyncThunk<ApiResponse, SelfAssessmentFormData>("selfAssessments/submit", async (formData, thunkAPI) => {
    try {
        const response = await axios.post(`selfAssessments`, formData);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const getSelfAssessmentSubmissionStatus = createAsyncThunk<Data, string>("selfAssessments/getSubmissionStatus", async (groupId, thunkAPI) => {
    try {
        const response = await axios.get(`selfAssessments/${groupId}/status`);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
});

export const getAssessmentsByAssignment = createAsyncThunk<AssessmentData[], string>("assessments/getByAssignment", async (assignmentId, thunkAPI) => {
    try {
        console.log("accessed...")
        const response = await axios.get(`peerAssessments/${assignmentId}`);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err);
    }
});