import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { getRemainingPeerAssessments, getSelfAssessmentSubmissionStatus } from "../../redux/actions/assessmentActions";
import { ClipLoader } from "react-spinners";
import { FaUsers, FaClipboardList, FaCheckCircle, FaCalendarAlt, FaCode } from "react-icons/fa";
import { RiBookMarkedLine } from "react-icons/ri";

const Dashboard = () => {
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const { isSideMenuExpanded } = useAppSelector(state => state.appSetting);
    const { assignments, fetching: assignmentFetching } = useAppSelector(state => state.assignment);
    const { group, fetching: groupFetching } = useAppSelector(state => state.group);

    useEffect(() => {
        if (group) {
            dispatch(getRemainingPeerAssessments(group.id));
            dispatch(getSelfAssessmentSubmissionStatus(group.id));
        }
    }, [group, dispatch]);

    const assignment = assignments.find(assignment => assignment.id === projectId);

    const getPendingTasks = () => {
        return group?.tasks.filter(task => task.status !== "completed").length || 0;
    };

    const getCompletedTasks = () => {
        return group?.tasks.filter(task => task.status === "completed").length || 0;
    };

    const calculateProgress = () => {
        const total = getPendingTasks() + getCompletedTasks();
        return total === 0 ? 0 : Math.round((getCompletedTasks() / total) * 100);
    };

    return (
        <div className={`flex ${isSideMenuExpanded ? 'lg:w-[72%]' : 'lg:w-[87%]'} xs:w-full h-[calc(100vh-4rem)] flex-col items-center overflow-y-auto overflow-x-hidden py-8 bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)] relative`}>
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>
            
            {groupFetching || assignmentFetching ? (
                <div className="flex flex-col items-center justify-center h-full w-full">
                    <ClipLoader size={40} color="#586AEA" />
                    <p className="mt-4 text-gray-500">Loading dashboard...</p>
                </div>
            ) : (
                <div className="flex flex-col w-[90%] z-10">
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h1 className="text-gray-800 text-2xl font-bold">{group?.name}</h1>
                        <div className="flex items-center text-gray-500 mt-2">
                            <FaCalendarAlt className="mr-2" />
                            <span>Assignment: {assignment?.name}</span>
                        </div>
                        
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Task Progress</span>
                                <span className="text-sm font-medium text-custom-blue">{calculateProgress()}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-gradient-to-r from-custom-blue to-indigo-600 h-2.5 rounded-full" 
                                    style={{ width: `${calculateProgress()}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex xs:flex-col lg:flex-row gap-6 mb-8">
                        <div className="flex-1 bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
                            <div className="flex items-start">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <FaUsers className="text-custom-blue text-xl" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-500 text-sm">Team Size</h3>
                                    <p className="font-bold text-2xl mt-1 text-gray-800">{group?.users?.length || 0}</p>
                                    <p className="text-sm text-gray-500 mt-1">Group members</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
                            <div className="flex items-start">
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <FaClipboardList className="text-orange-500 text-xl" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-500 text-sm">Pending Tasks</h3>
                                    <p className="font-bold text-2xl mt-1 text-gray-800">{getPendingTasks()}</p>
                                    <p className="text-sm text-gray-500 mt-1">Tasks in progress</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
                            <div className="flex items-start">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <FaCheckCircle className="text-green-500 text-xl" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-500 text-sm">Completed</h3>
                                    <p className="font-bold text-2xl mt-1 text-gray-800">{getCompletedTasks()}</p>
                                    <p className="text-sm text-gray-500 mt-1">Finished tasks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-gray-800 text-lg font-semibold mb-4">Group Members</h2>
                        
                        <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {group?.users?.map(user => (
                                <div key={user.id} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-12 h-12 overflow-hidden rounded-full">
                                        {user.profileImg ? (
                                            <img 
                                                src={user.profileImg} 
                                                alt={user.fullName}
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-custom-blue text-lg font-medium">
                                                    {user.fullName.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="font-medium text-gray-800">{user.fullName}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {group?.githubRepoLink && (
                            <div className="flex flex-col gap-2 mt-8">
                                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-custom-blue" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    GitHub Repository
                                </h3>
                                <a 
                                    href={group.githubRepoLink} 
                                    target="_blank"
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-1 text-sm text-custom-blue hover:underline mt-1"
                                >
                                    {group.githubRepoLink}
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col p-6 gap-4 bg-white rounded-xl shadow-md overflow-hidden my-8">
                        <div className="w-full flex flex-col gap-2 border-b border-custom-borderGrey py-4 z-10">
                            <div className="flex xs:flex-col lg:flex-row xs:items-start lg:items-center justify-between">
                                <h2 className="text-custom-textBlack text-xl font-semibold">{assignment?.name}</h2>
                                
                                {assignment?.studentClass && (
                                    <div className="flex items-center gap-2 bg-blue-50 text-custom-blue px-3 py-1 rounded-full xs:mt-2 lg:mt-0">
                                        <RiBookMarkedLine size={16} />
                                        <span className="text-sm font-medium">{assignment.studentClass.name}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-2">
                                <h3 className="text-custom-textGrey font-medium text-sm">
                                    <span className="font-semibold">Due:</span> {assignment?.dueDateFormatted}
                                </h3>
                                
                                {assignment?.technical && (
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
                                {assignment?.description || "No description provided"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;