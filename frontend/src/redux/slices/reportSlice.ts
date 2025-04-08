import { createSlice } from "@reduxjs/toolkit";
import { getContributionReport } from "../actions/reportActions";
import { errorToast } from "../../utils/toast";
import { ReportData } from "../../types/Report";

interface IinitState {
    fetching: boolean,
    reportData: ReportData[]
}

const reportSlice = createSlice({
    name: "report",
    initialState: {
        fetching: false,
        reportData: []
    } as IinitState,
    reducers:{
        clearReportData: (state) => {
            state.reportData = []
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getContributionReport.pending, (state) => {
            state.fetching = true
        })
        .addCase(getContributionReport.fulfilled, (state, action) => {
            state.fetching = false
            state.reportData = action.payload
        })
        .addCase(getContributionReport.rejected, (state, action) => {
            state.fetching = false
            errorToast(action.payload as string)
        })
    },
})

export const {clearReportData} = reportSlice.actions
export default reportSlice.reducer; 