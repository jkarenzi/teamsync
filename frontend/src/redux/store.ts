import { configureStore } from "@reduxjs/toolkit";
import appSettingReducer from './slices/appSettingSlice'
import userReducer from './slices/userSlice'
import assignmentReducer from './slices/assignmentSlice'
import groupReducer from './slices/groupSlice'
import taskReducer from './slices/taskSlice'
import messageReducer from './slices/messageSlice'
import assessmentReducer from './slices/assessmentSlice'
import reportReducer from './slices/reportSlice'
import classReducer from './slices/classSlice'
import notificationReducer from './slices/notificationSlice'


const store = configureStore({
    reducer:{
        appSetting: appSettingReducer,
        user: userReducer,
        assignment: assignmentReducer,
        group: groupReducer,
        task: taskReducer,
        message: messageReducer,
        assessment: assessmentReducer,
        report: reportReducer,
        studentClass: classReducer,
        notification: notificationReducer
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store