import { createSlice } from '@reduxjs/toolkit';
import { AssessmentData, getAssessmentsByAssignment, getRemainingPeerAssessments, getSelfAssessmentSubmissionStatus, submitPeerAssessment, submitSelfAssessment } from '../actions/assessmentActions';
import { errorToast, successToast } from '../../utils/toast';


interface IinitialState {
  loading: boolean,
  status: 'idle'|'successful'|'failed',
  totalPeerAssessments: number | null,
  unAssessedUsers: {id:string, name:string}[],
  selfAssessmentSubmissionStatus: boolean,
  peerFetching: boolean,
  selfFetching: boolean,
  assessmentData: AssessmentData[]
}

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState: {
    loading:false,
    peerFetching: false,
    selfFetching: false,
    unAssessedUsers:[],
    status:'idle',
    totalPeerAssessments: null,
    selfAssessmentSubmissionStatus: false,
    assessmentData: []
  } as IinitialState,
  reducers: {
    resetStatus: (state) => {
        state.status = 'idle'
    },
    resetAssessment: (state) => {
        state.assessmentData = []
        state.totalPeerAssessments = null
        state.unAssessedUsers = []
        state.selfAssessmentSubmissionStatus = false
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(submitPeerAssessment.pending, (state) => {
        state.loading = true
    })
    .addCase(submitPeerAssessment.fulfilled, (state, action) => {
        state.loading = false
        state.status = 'successful'
        state.totalPeerAssessments = action.payload.totalPeerAssessments
        state.unAssessedUsers = action.payload.unAssessedUsers
        successToast(action.payload.message)
    })
    .addCase(submitPeerAssessment.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed'
        errorToast(action.payload as string);
    })
    .addCase(submitSelfAssessment.pending, (state) => {
        state.loading = true
    })
    .addCase(submitSelfAssessment.fulfilled, (state, action) => {
        state.loading = false
        state.status = 'successful'
        state.selfAssessmentSubmissionStatus = true
        successToast(action.payload.message)
    })
    .addCase(submitSelfAssessment.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed'
        errorToast(action.payload as string);
    })
    .addCase(getRemainingPeerAssessments.pending, (state) => {
        state.peerFetching = true
    })
    .addCase(getRemainingPeerAssessments.fulfilled, (state, action) => {
        state.peerFetching = false
        state.totalPeerAssessments = action.payload.totalPeerAssessments
        state.unAssessedUsers = action.payload.unAssessedUsers
    })
    .addCase(getRemainingPeerAssessments.rejected, (state, action) => {
        state.peerFetching = false
        errorToast(action.payload as string);
    })
    .addCase(getSelfAssessmentSubmissionStatus.pending, (state) => {
        state.selfFetching = true
    })
    .addCase(getSelfAssessmentSubmissionStatus.fulfilled, (state, action) => {
        state.selfFetching = false
        state.selfAssessmentSubmissionStatus = action.payload.status
    })
    .addCase(getSelfAssessmentSubmissionStatus.rejected, (state, action) => {
        state.selfFetching = false
        errorToast(action.payload as string);
    })
    .addCase(getAssessmentsByAssignment.pending, (state) => {
        state.peerFetching = true
    })
    .addCase(getAssessmentsByAssignment.fulfilled, (state, action) => {
        state.peerFetching = false
        state.assessmentData = action.payload
    })
    .addCase(getAssessmentsByAssignment.rejected, (state, action) => {
        state.peerFetching = false
        errorToast(action.payload as string);
    })
  }
});

export default assessmentSlice.reducer;
export const {resetStatus, resetAssessment} = assessmentSlice.actions