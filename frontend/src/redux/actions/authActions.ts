import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../services/api"
import { ApiResponse } from "../../types/ApiResponse"
import { signupFormData, loginFormData, User, changePasswordFormData, editProfileFormData } from "../../types/authFormData"

interface IAuth {
    token: string,
    user: User | null
}

interface IParams {
    name?:string,
    startYear?:string,
    program?:string,
    intake?:string,
    role?:string
}

export const signUp = createAsyncThunk<ApiResponse, signupFormData>('auth/signUp', async(formData, thunkAPI) => {
    try{
        const response = await axios.post('auth/signUp', formData)
        return response.data
    }catch(err){
        return thunkAPI.rejectWithValue(err)
    }
})

export const login = createAsyncThunk<ApiResponse, loginFormData>('auth/login', async(formData, thunkAPI) => {
    try{
        const response = await axios.post('auth/login', formData)
        localStorage.setItem("token", response.data.token);
        return response.data
    }catch(err){
        return thunkAPI.rejectWithValue(err)
    }
})

export const logout = createAsyncThunk('auth/logout', async(_, thunkAPI) => {
    try{
        await axios.post('auth/logout')
    }catch(err){
        return thunkAPI.rejectWithValue(err)
    }
})

export const getOwnProfile = createAsyncThunk<User>('auth/getOwnProfile', async(_, thunkAPI) => {
    try{
        const response = await axios.get('user/own')
        return response.data
    }catch(err){
        return thunkAPI.rejectWithValue(err)
    }
})

export const initiateAuth = createAsyncThunk<IAuth>('auth/initiate', async(_, thunkAPI) => {
    try{
        const token = localStorage.getItem('token')
        if(!token){
            return { token: '', user: null };
        }

        const response = await axios.get('user/own')
        return {token, user: response.data}
    }catch(err){
        console.log(err)
        return thunkAPI.rejectWithValue({ token: '', user: null })
    }
})

export const changePassword = createAsyncThunk<ApiResponse, changePasswordFormData>('auth/changePassword', async(formData, thunkAPI) => {
    try{
        const response = await axios.post('user/change_password', formData)
        return response.data
    }catch(err){
        return thunkAPI.rejectWithValue(err)
    }
})

export const editProfile = createAsyncThunk<User, editProfileFormData>("user/editProfile", async (formData, thunkAPI) => {
    try {
      const response = await axios.patch('user/', formData)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
});

export const getUsers = createAsyncThunk<User[], IParams>("user/getAll", async (params, thunkAPI) => {
    try {
      const response = await axios.get('user/', {
        params:params
      })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
});