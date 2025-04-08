import { createSlice } from "@reduxjs/toolkit";
import {
  createAssignment,
  getAllAssignments,
  getInstructorAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getOwnAssignments,
} from "../actions/assignmentActions";
import { Assignment } from "../../types/Assignment";
import { errorToast, successToast } from "../../utils/toast";


type IinitialState = {
  assignments: Assignment[],
  assignment: Assignment | null,
  loading: boolean,
  fetching: boolean,
  status: 'idle'|'successful'|'failed'
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState:{
    assignments: [],
    assignment: null,
    loading: false,
   fetching: false,
   status: 'idle'
  } as IinitialState,
  reducers: {
    resetStatus: (state) => {
        state.status = 'idle'
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(action.payload);
        state.status = 'successful'
        successToast('Assignment created successfully')
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed'
        errorToast(action.payload as string);
      })
      .addCase(getAllAssignments.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getAllAssignments.fulfilled, (state, action) => {
        state.fetching= false;
        state.assignments = action.payload;
      })
      .addCase(getAllAssignments.rejected, (state, action) => {
        state.fetching = false;
        errorToast(action.payload as string);
      })
      .addCase(getOwnAssignments.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getOwnAssignments.fulfilled, (state, action) => {
        state.fetching= false;
        state.assignments = action.payload;
      })
      .addCase(getOwnAssignments.rejected, (state, action) => {
        state.fetching = false;
        errorToast(action.payload as string);
      })
      .addCase(getInstructorAssignments.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getInstructorAssignments.fulfilled, (state, action) => {
        state.fetching = false;
        state.assignments = action.payload;
      })
      .addCase(getInstructorAssignments.rejected, (state, action) => {
        state.fetching = false;
        errorToast(action.payload as string);
      })
      .addCase(getAssignmentById.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getAssignmentById.fulfilled, (state, action) => {
        state.fetching = false;
        state.assignment = action.payload;
      })
      .addCase(getAssignmentById.rejected, (state, action) => {
        state.fetching = false;
        errorToast(action.payload as string);
      })
      .addCase(updateAssignment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.map((assignment) =>
          assignment.id === action.payload.id ? action.payload : assignment
        );
        state.status = 'successful'
        successToast('Assignment updated successfully')
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed'
        errorToast(action.payload as string);
      })
      .addCase(deleteAssignment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.filter(
          (assignment) => assignment.id !== action.payload
        );
        state.status = 'successful'
        successToast('Assignment deleted successfully')
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed'
        errorToast(action.payload as string);
      });
  },
});


export const {resetStatus} = assignmentSlice.actions
export default assignmentSlice.reducer;
