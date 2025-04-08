import { createSlice } from "@reduxjs/toolkit";
import {
  createGroup,
  getAllGroups,
  updateGroup,
  deleteGroup,
  autoAssignGroups,
  getOwnGroup,
} from "../actions/groupActions";
import { Group } from "../../types/Group";
import { errorToast, successToast } from "../../utils/toast";


type IinitialState = {
  groups: Group[];
  group: Group | null;
  loading: boolean;
  fetching: boolean;
  status: 'idle'|'successful'|'failed',
  fetchGroupStatus: 'idle'|'complete'
};

const groupSlice = createSlice({
  name: "group",
  initialState: {
    groups: [],
    group: null,
    loading: false,
    fetching: false,
    status: 'idle',
    fetchGroupStatus: 'idle'
  } as IinitialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle'
    },
    resetFetchGroupStatus: (state) => {
      state.fetchGroupStatus = 'idle'
    },
    resetGroup: (state) => {
      state.group = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'successful'
        state.groups.push(action.payload);
        successToast('Group created successfully')
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed'
        errorToast(action.payload as string);
      })
      .addCase(getAllGroups.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getAllGroups.fulfilled, (state, action) => {
        state.fetching = false;
        state.groups = action.payload;
      })
      .addCase(getAllGroups.rejected, (state, action) => {
        state.fetching = false;
        errorToast(action.payload as string);
      })
      .addCase(getOwnGroup.pending, (state) => {
        state.fetching = true;
      })
      .addCase(getOwnGroup.fulfilled, (state, action) => {
        state.fetching = false;
        state.group = action.payload;
        state.fetchGroupStatus = 'complete'
      })
      .addCase(getOwnGroup.rejected, (state, action) => {
        state.fetching = false;
        state.fetchGroupStatus = 'complete'
        errorToast(action.payload as string);
      })
      .addCase(updateGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = state.groups.map((group) =>
          group.id === action.payload.id ? action.payload : group
        );
        state.status = 'successful'
        successToast('Group updated successfully')
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed'
        errorToast(action.payload as string);
      })
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = state.groups.filter(
          (group) => group.id !== action.payload
        );
        state.status = 'successful'
        successToast('Group deleted successfully')
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed'
        errorToast(action.payload as string);
      })
      .addCase(autoAssignGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(autoAssignGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload
        state.status = 'successful'
        successToast('Groups auto created')
      })
      .addCase(autoAssignGroups.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed'
        errorToast(action.payload as string);
      });
  },
});

export const {resetGroup, resetFetchGroupStatus, resetStatus} = groupSlice.actions
export default groupSlice.reducer;