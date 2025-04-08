import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AssessmentData, getAssessmentsByAssignment } from "../../redux/actions/assessmentActions";
import { IoClose } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { FaUserCircle } from "react-icons/fa";

const Assessments = () => {
    const { isSideMenuExpanded } = useAppSelector(state => state.appSetting);
    const { assessmentData, peerFetching } = useAppSelector(state => state.assessment);
    const { assignmentId } = useParams();
    const [toggleViewDetails, setToggleViewDetails] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if (assignmentId) {
            dispatch(getAssessmentsByAssignment(assignmentId));
        }
    }, [assignmentId, dispatch]);

    useEffect(() => {
        if (selectedAssessment) {
            setToggleViewDetails(true);
        }
    }, [selectedAssessment]);

    const getScoreColor = (score: number) => {
        if (score >= 20) return "text-green-600";
        if (score >= 15) return "text-blue-600";
        if (score >= 10) return "text-yellow-600";
        return "text-red-600";
    };
    
    return (
        <div className={`flex ${isSideMenuExpanded ? 'lg:w-[72%]' : 'lg:w-[87%]'} xs:w-full h-[calc(100vh-4rem)] flex-col items-center overflow-y-auto overflow-x-hidden py-8 bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)] relative`}>
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>
            
            <div className="w-[90%] flex xs:flex-col xs:gap-3 lg:flex-row lg:gap-0 xs:items-start lg:items-center justify-between bg-white rounded-xl shadow-md p-6 z-10">
                <div className="flex flex-col">
                    <h2 className="text-gray-800 text-xl font-bold">Assessments</h2>
                    <p className="text-gray-500 mt-1">View student peer and self-assessment scores and feedback</p>
                </div>
                <div className="flex items-center xs:mt-2 lg:mt-0">
                    {peerFetching ? (
                        <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-400">
                            <ClipLoader size={16} color="#586AEA" className="mr-2" />
                            <span>Loading assessments...</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-custom-blue">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="text-sm">{assessmentData.length} {assessmentData.length === 1 ? 'assessment' : 'assessments'}</span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="w-[90%] mt-8 hidden lg:block overflow-hidden rounded-lg shadow z-10">
                {!peerFetching ? (
                    assessmentData.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-custom-blue">
                                    <th className="px-6 py-3.5 font-semibold text-left text-white">Student Name</th>
                                    <th className="px-6 py-3.5 font-semibold text-left text-white">Student Email</th>
                                    <th className="px-6 py-3.5 font-semibold text-left text-white">Group</th>
                                    <th className="px-6 py-3.5 font-semibold text-center text-white">Peer Score</th>
                                    <th className="px-6 py-3.5 font-semibold text-center text-white">Self Score</th>
                                    <th className="px-6 py-3.5 font-semibold text-center text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {assessmentData.map((assessment, i) => (
                                    <tr 
                                        className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100 hover:bg-gray-50`} 
                                        key={assessment.id}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {assessment.user.profileImg ? (
                                                    <img 
                                                        src={assessment.user.profileImg} 
                                                        alt={assessment.user.fullName}
                                                        className="w-8 h-8 rounded-full mr-3 object-cover" 
                                                    />
                                                ) : (
                                                    <FaUserCircle className="w-8 h-8 text-gray-400 mr-3" />
                                                )}
                                                <span className="font-medium text-gray-800">{assessment.user.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{assessment.user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                {assessment.group.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-lg font-semibold ${getScoreColor(assessment.peerScore)}`}>
                                                    {assessment.peerScore}
                                                </span>
                                                <span className="text-xs text-gray-400">out of 25</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-lg font-semibold ${getScoreColor(assessment.selfScore)}`}>
                                                    {assessment.selfScore}
                                                </span>
                                                <span className="text-xs text-gray-400">out of 25</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                className="px-3 py-1.5 bg-blue-50 text-custom-blue rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                                onClick={() => setSelectedAssessment(assessment)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-white">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                                <svg className="w-8 h-8 text-custom-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-1">No Assessments Yet</h2>
                            <p className="text-gray-500 text-center max-w-md">
                                Students haven't submitted any assessments for this assignment.
                            </p>
                        </div>
                    )
                ) : (
                    <div className="w-full bg-white py-8">
                        <div className="flex justify-center">
                            <ClipLoader size={40} color="#586AEA"/>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="w-[90%] mt-8 flex flex-col gap-4 lg:hidden z-10">
                {!peerFetching ? (
                    assessmentData.length > 0 ? (
                        assessmentData.map(assessment => (
                            <div key={assessment.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-center">
                                        {assessment.user.profileImg ? (
                                            <img 
                                                src={assessment.user.profileImg} 
                                                alt={assessment.user.fullName}
                                                className="w-10 h-10 rounded-full mr-3 object-cover" 
                                            />
                                        ) : (
                                            <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" />
                                        )}
                                        <div>
                                            <h3 className="font-medium text-gray-800">{assessment.user.fullName}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{assessment.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="px-4 py-3 bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-500 text-sm">Group:</span>
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                            {assessment.group.name}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">Peer Score:</span>
                                            <span className={`text-lg font-semibold ${getScoreColor(assessment.peerScore)}`}>
                                                {assessment.peerScore}/25
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-gray-500 text-sm">Self Score:</span>
                                            <span className={`text-lg font-semibold ${getScoreColor(assessment.selfScore)}`}>
                                                {assessment.selfScore}/25
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="px-4 py-3 border-t border-gray-100 flex justify-end">
                                    <button 
                                        className="px-4 py-2 bg-blue-50 text-custom-blue rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                        onClick={() => setSelectedAssessment(assessment)}
                                    >
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View Details
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                                <svg className="w-8 h-8 text-custom-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-1">No Assessments Yet</h2>
                            <p className="text-gray-500 text-center max-w-md px-4">
                                Students haven't submitted any assessments for this assignment.
                            </p>
                        </div>
                    )
                ) : (
                    Array(3).fill(0).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                                    <div>
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-48"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50">
                                <div className="flex justify-between mb-3">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                            <div className="px-4 py-3 flex justify-end">
                                <div className="h-8 bg-gray-200 rounded w-28"></div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedAssessment && toggleViewDetails && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[30rem] max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
                        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                            <div className="flex items-center text-custom-blue">
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h2 className="font-semibold text-lg">Assessment Details</h2>
                            </div>
                            <IoClose 
                                onClick={() => {setToggleViewDetails(false); setSelectedAssessment(null)}} 
                                size={25} 
                                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                            />
                        </div>
                        
                        <div className="w-full flex flex-col gap-8 py-6 px-6">
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                                    {selectedAssessment.user.profileImg ? (
                                        <img src={selectedAssessment.user.profileImg} className="w-full h-full object-cover" alt={selectedAssessment.user.fullName} />
                                    ) : (
                                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-custom-blue text-2xl font-semibold">
                                                {selectedAssessment.user.fullName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-medium text-lg">{selectedAssessment.user.fullName}</h3>
                                    <h3 className="text-gray-500 text-sm">{selectedAssessment.user.email}</h3>
                                    <div className="mt-1.5">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                            {selectedAssessment.group.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 justify-center">
                                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 w-1/2">
                                    <span className="text-gray-500 text-sm">Peer Score</span>
                                    <span className={`text-2xl font-bold ${getScoreColor(selectedAssessment.peerScore)}`}>
                                        {selectedAssessment.peerScore}
                                    </span>
                                    <span className="text-xs text-gray-400">out of 25</span>
                                </div>
                                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 w-1/2">
                                    <span className="text-gray-500 text-sm">Self Score</span>
                                    <span className={`text-2xl font-bold ${getScoreColor(selectedAssessment.selfScore)}`}>
                                        {selectedAssessment.selfScore}
                                    </span>
                                    <span className="text-xs text-gray-400">out of 25</span>
                                </div>
                            </div>
                            
                            {selectedAssessment.peerFeedback.length !== 0 && (
                                <div className="flex flex-col gap-4">
                                    <h2 className="font-semibold text-gray-700 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        Feedback from peers
                                    </h2>
                                    <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg">
                                        {selectedAssessment.peerFeedback.map((feedback, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-custom-blue mt-2"></div>
                                                <p className="text-sm text-gray-600">{feedback}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {selectedAssessment.selfFeedback && (
                                <div className="flex flex-col gap-4">
                                    <h2 className="font-semibold text-gray-700 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Self Reflection
                                    </h2>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-custom-blue mt-2"></div>
                                            <p className="text-sm text-gray-600">{selectedAssessment.selfFeedback}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default Assessments;