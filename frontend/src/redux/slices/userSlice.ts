import { createSlice } from "@reduxjs/toolkit";
import { errorToast, successToast } from "../../utils/toast";
import { changePassword, editProfile, getOwnProfile, getUsers, initiateAuth, login, logout, signUp } from "../actions/authActions";
import { User } from "../../types/authFormData";
import { getUsersWithoutGroups } from "../actions/groupActions";


interface InitialState {
    token: string | null,
    user: User | null,
    signUpState: 'successful' | 'failed' | 'idle',
    isLoggingIn: boolean,
    isSigningUp: boolean,
    isInitializing: boolean,
    initializeStatus: 'idle'|'complete',
    isChangingPass: boolean,
    changePassState: 'successful' | 'failed' | 'idle',
    loading: boolean,
    loggingOut: boolean,
    fetching: boolean,
    users: User[],
    fetchStatus: 'successful' | 'failed' | 'idle'
}

const initialState: InitialState = {
    token: null,
    user: null,
    signUpState: 'idle',
    isLoggingIn: false,
    isSigningUp: false,
    isInitializing: false,
    isChangingPass: false,
    changePassState: 'idle',
    initializeStatus: 'idle',
    loading: false,
    loggingOut: false,
    fetching: false,
    users: [],
    fetchStatus: 'idle'
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        resetSignUpState: (state) => {
            state.signUpState = 'idle'
        },
        resetChangePassState: (state) => {
            state.changePassState = 'idle'
        },
        resetInitializeStatus: (state) => {
            state.initializeStatus = 'idle'
        },
        resetFetchStatus: (state) => {
            state.fetchStatus = 'idle'
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(initiateAuth.pending, (state) => {
            state.isInitializing = true
        })
        .addCase(initiateAuth.fulfilled, (state, action) => {
            state.token = action.payload.token
            state.user = action.payload.user
            state.isInitializing = false
            state.initializeStatus = 'complete'
        })
        .addCase(initiateAuth.rejected, (state) => {
            state.token = ''
            state.user = null
            state.isInitializing = false
            state.initializeStatus = 'complete'
        })
        .addCase(logout.pending, (state) => {
            state.loggingOut = true
        })
        .addCase(logout.fulfilled, (state) => {
            localStorage.removeItem('token')
            state.token = ""
            state.user = null
            state.loggingOut = false
            state.initializeStatus = 'complete'
        })
        .addCase(logout.rejected, (state, action) => {
            state.loggingOut = false
            errorToast(action.payload as string)
        })
        .addCase(signUp.pending, (state) => {
            state.isSigningUp = true
        })
        .addCase(signUp.fulfilled, (state, action) => {
            state.isSigningUp = false
            state.signUpState = 'successful'
            successToast(action.payload.message!)
        })
        .addCase(signUp.rejected, (state, action) => {
            state.isSigningUp = false
            state.signUpState = 'failed'
            errorToast(action.payload as string)
        })
        .addCase(login.pending, (state) => {
            state.isLoggingIn = true
        })
        .addCase(login.fulfilled, (state, action) => {
            state.token = action.payload.token!
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoggingIn = false
            errorToast(action.payload as string)
        })
        .addCase(getOwnProfile.fulfilled, (state, action) => {
            state.isLoggingIn = false
            state.user = action.payload
            successToast('Login successful')
        })
        .addCase(getOwnProfile.rejected, (state, action) => {
            state.isLoggingIn = false
            errorToast(action.payload as string)
        })
        .addCase(changePassword.pending, (state) => {
            state.isChangingPass = true
        })
        .addCase(changePassword.fulfilled, (state) => {
            state.isChangingPass = false
            state.changePassState = 'successful'
            successToast('Password changed successfully')
        })
        .addCase(changePassword.rejected, (state, action) => {
            state.isChangingPass = false
            state.changePassState = 'failed'
            errorToast(action.payload as string)
        })
        .addCase(editProfile.pending, (state) => {
            state.loading = true
        })
        .addCase(editProfile.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
            successToast('Profile updated successfully')
        })
        .addCase(editProfile.rejected, (state, action) => {
            state.loading = false
            errorToast(action.payload as string)
        })
        .addCase(getUsers.pending, (state) => {
            state.fetching = true
        })
        .addCase(getUsers.fulfilled, (state, action) => {
            state.fetching = false
            state.users = action.payload
            state.fetchStatus = 'successful'
        })
        .addCase(getUsers.rejected, (state, action) => {
            state.fetching = false
            state.fetchStatus = 'failed'
            errorToast(action.payload as string)
        })
        .addCase(getUsersWithoutGroups.pending, (state) => {
            state.fetching = true
        })
        .addCase(getUsersWithoutGroups.fulfilled, (state, action) => {
            state.fetching = false
            state.users = action.payload
            state.fetchStatus = 'successful'
        })
        .addCase(getUsersWithoutGroups.rejected, (state, action) => {
            state.fetching = false
            state.fetchStatus = 'failed'
            errorToast(action.payload as string)
        })
    }
})

export const {resetSignUpState, resetChangePassState, resetInitializeStatus, resetFetchStatus} = userSlice.actions
export default userSlice.reducer