import { createSlice } from "@reduxjs/toolkit";
import { sendMessage, getGroupMessages } from "../actions/messageActions";
import { errorToast } from "../../utils/toast";
import { Message } from "../../types/Message";
import { IMembers } from "../../types/authFormData";


interface InitialState {
    messages: Message[],
    isSending: boolean,
    isLoadingMessages: boolean,
    tempStorage: Message | null,
    onlineUsers: IMembers | null
}

const initialState: InitialState = {
    messages: [],
    tempStorage: null,
    isSending: false,
    isLoadingMessages: false,
    onlineUsers: null
};

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers:{
        addMessageToTempStorage: (state, action) => {
            state.tempStorage = action.payload
            state.messages.push(action.payload)
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload)
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
        },
        resetMessages: (state) => {
            state.messages = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.isSending = true
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isSending = false
                state.messages = state.messages.map(message => message.id === state.tempStorage!.id ? action.payload : message)
                state.tempStorage = null
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isSending = false
                state.messages = state.messages.filter(message => message.id !== state.tempStorage!.id)
                state.tempStorage = null
                errorToast(action.payload as string)
            })

            .addCase(getGroupMessages.pending, (state) => {
                state.isLoadingMessages = true
            })
            .addCase(getGroupMessages.fulfilled, (state, action) => {
                state.isLoadingMessages = false
                state.messages = action.payload;
            })
            .addCase(getGroupMessages.rejected, (state, action) => {
                state.isLoadingMessages = false
                errorToast(action.payload as string);
            });
    },
});


export const {addMessageToTempStorage, addMessage, setOnlineUsers, resetMessages} = messageSlice.actions
export default messageSlice.reducer;