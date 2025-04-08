import { createSlice } from "@reduxjs/toolkit";
import {
  createTask,
  getTasksByGroup,
  getTasksByUser,
  updateTask,
  deleteTask,
} from "../actions/taskActions";
import { Task } from "../../types/Task";
import { errorToast, successToast } from "../../utils/toast";


type IInitialState = {
  tasks: Task[],
  ownTasks: Task[],
  loading: boolean,
  fetching: boolean,
  status: "idle" | "successful" | "failed",
  tempStorage: Task | null
};

const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    ownTasks: [],
    loading: false,
    fetching: false,
    status: "idle",
    tempStorage: null
  } as IInitialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
    },
    addToTempStorage: (state, action) => {
      state.tempStorage = action.payload.old
      state.tasks = state.tasks.map(task => task.id === action.payload.old.id ? action.payload.new : task)
    },
    resetTasks: (state) => {
      state.tasks = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false
        state.status = "successful"
        state.tasks.push(action.payload)
        successToast("Task created successfully")
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false
        state.status = "failed"
        errorToast(action.payload as string)
      })
      .addCase(getTasksByGroup.pending, (state) => {
        state.fetching = true
      })
      .addCase(getTasksByGroup.fulfilled, (state, action) => {
        state.fetching = false
        state.tasks = action.payload
      })
      .addCase(getTasksByGroup.rejected, (state, action) => {
        state.fetching = false
        errorToast(action.payload as string)
      })
      .addCase(getTasksByUser.pending, (state) => {
        state.fetching = true
      })
      .addCase(getTasksByUser.fulfilled, (state, action) => {
        state.fetching = false
        state.ownTasks = action.payload
      })
      .addCase(getTasksByUser.rejected, (state, action) => {
        state.fetching = false
        errorToast(action.payload as string)
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false
        if(!state.tempStorage){
          state.tasks = state.tasks.map((task) =>
            task.id === action.payload.id ? action.payload : task
          );
          state.status = "successful";
        }
        successToast("Task updated successfully");
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        if(state.tempStorage){
          state.tasks = state.tasks.map(task => task.id === state.tempStorage!.id ? state.tempStorage! : task)
        }else{
          state.status = "failed";
        }
        errorToast(action.payload as string);
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.status = "successful";
        successToast("Task deleted successfully")
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        errorToast(action.payload as string)
      });
  },
});

export const { resetStatus, addToTempStorage, resetTasks } = taskSlice.actions;
export default taskSlice.reducer;