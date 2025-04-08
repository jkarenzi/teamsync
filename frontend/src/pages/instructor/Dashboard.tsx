import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { getAssignmentById } from "../../redux/actions/assignmentActions";
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton";
import { FaCode } from "react-icons/fa";
import { RiBookMarkedLine } from "react-icons/ri";

const Dashboard = () => {
    const { isSideMenuExpanded } = useAppSelector(state => state.appSetting);
    const { assignment, fetching } = useAppSelector(state => state.assignment);
    const { assignmentId } = useParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (assignmentId) {
            dispatch(getAssignmentById(assignmentId));
        }
    }, [assignmentId, dispatch]);

    return (
        <div className={`flex ${isSideMenuExpanded ? 'lg:w-[72%]' : 'lg:w-[87%]'} xs:w-full h-[calc(100vh-4rem)] flex-col items-center bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)] relative overflow-x-hidden`}>
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>
            
            {fetching ? (
                <DashboardSkeleton />
            ) : !assignment ? (
                <div className="flex flex-col items-center justify-center h-full w-full">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-50 mb-4">
                        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700">Assignment Not Found</h2>
                    <p className="text-gray-500 mt-2">The requested assignment could not be found.</p>
                </div>
            ) : (
                <>
                    <div className="w-[90%] flex flex-col gap-2 border-b border-custom-borderGrey py-4 mt-8 z-10">
                        <div className="flex xs:flex-col lg:flex-row xs:items-start lg:items-center justify-between">
                            <h2 className="text-custom-textBlack text-xl font-semibold">{assignment.name}</h2>
                            
                            {assignment.studentClass && (
                                <div className="flex items-center gap-2 bg-blue-50 text-custom-blue px-3 py-1 rounded-full xs:mt-2 lg:mt-0">
                                    <RiBookMarkedLine size={16} />
                                    <span className="text-sm font-medium">{assignment.studentClass.name}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-2">
                            <h3 className="text-custom-textGrey font-medium text-sm">
                                <span className="font-semibold">Due:</span> {assignment.dueDateFormatted}
                            </h3>
                            
                            {assignment.technical && (
                                <div className="flex items-center gap-1 text-sm">
                                    <FaCode className="text-custom-blue" />
                                    <span className="text-custom-textGrey">GitHub Tracking Enabled</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col w-[90%] mt-8 gap-6 z-10">
                        <h2 className="font-semibold flex items-center gap-2">
                            Description
                        </h2>
                        <p className="xs:w-full lg:w-[90%] whitespace-pre-line">
                            {assignment.description || "No description provided"}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;