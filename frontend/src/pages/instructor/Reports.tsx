import { HiOutlineDocumentReport } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getAllGroups } from "../../redux/actions/groupActions";
import { getContributionReport } from "../../redux/actions/reportActions";
import { IoClose } from "react-icons/io5";
import { GoTasklist } from "react-icons/go";
import { getStatusClass } from "../../utils/taskUtils";
import moment from "moment-timezone";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import ClipLoader from "react-spinners/ClipLoader";
import { clearReportData } from "../../redux/slices/reportSlice";
import { usePDF } from 'react-to-pdf';
import AssignmentSkeleton from "../../components/skeletons/AssignmentSkeleton";
import { getAssignmentById } from "../../redux/actions/assignmentActions";


const Reports = () => {
    const {isSideMenuExpanded} = useAppSelector(state => state.appSetting)
    const {groups} = useAppSelector(state => state.group)
    const groupFetching = useAppSelector(state => state.group.fetching)
    const {reportData, fetching} = useAppSelector(state => state.report)
    const {assignment} = useAppSelector(state => state.assignment)
    const dispatch = useAppDispatch()
    const {assignmentId} = useParams()
    const [toggleMenu, setToggleMenu] = useState({state:false, id:''})
    const [toggleViewDetails, setToggleViewDetails] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState("")
    const menuRef = useRef<HTMLDivElement>(null);
    const { toPDF, targetRef } = usePDF({
        filename: `Contribution Report.pdf`,
        page: { 
            margin: 10
        }
    })
                
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setToggleMenu({state:false, id:''})
            }
        };

        if (toggleMenu.state) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [toggleMenu])

    useEffect(() => {
        if(assignmentId){
            dispatch(getAssignmentById(assignmentId))
            dispatch(getAllGroups(assignmentId))
        }
    },[assignmentId])

    useEffect(() => {
        if(selectedGroupId){
            dispatch(getContributionReport(selectedGroupId))
        }
    },[selectedGroupId])

    useEffect(() => {
        if(!toggleViewDetails){
            dispatch(clearReportData())
        }
    },[toggleViewDetails])

    return (
        <div className={`flex ${isSideMenuExpanded?'lg:w-[72%]':'lg:w-[87%]'} xs:w-full h-[calc(100vh-4rem)] flex-col items-center overflow-x-hidden py-8 bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)] relative`}>
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>

            {toggleViewDetails && <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                <div className="flex flex-col items-center rounded-lg bg-white xs:w-[90%] lg:w-[60%] max-h-screen overflow-y-auto">
                    <div className="flex items-center justify-between w-full border-b border-[lightgray] py-2 px-4">
                        <h2 className="font-semibold text-lg">Contribution Report</h2>
                        <IoClose onClick={() => {setToggleViewDetails(false)}} size={25} color="black" className="cursor-pointer"/>
                    </div>
                    <div className="flex w-[90%] justify-end mt-4 mb-12">
                        <button type='submit' onClick={() => toPDF()} className='flex self-end items-center justify-center w-32 h-8 bg-custom-blue text-white rounded-md text-sm cursor-pointer'>{'Export as PDF'}</button>
                    </div>
                    {fetching && <div className="w-full h-[30rem] flex items-center justify-center">
                        <ClipLoader color="#586AEA" size={50}/>
                    </div>}
                    {!fetching && <div className="w-full flex justify-center" ref={targetRef}>
                        <div ref={targetRef} className="w-[90%] flex flex-col pt-4">
                            <div className="w-full flex xs:flex-col lg:flex-row items-center justify-between xs:gap-12 lg:gap-0">
                                <div className="flex flex-col items-center xs:w-[90%] lg:w-[40%]">
                                    <h2 className="font-bold text-lg">Workload distribution</h2>
                                    <p className="text-sm text-custom-textGrey text-center mt-4 mb-6">This chart illustrates the workload distribution among group members. Please note that the distribution is calculated based on how tasks are created and assigned by students using the Kanban board. It reflects the division of responsibilities as organized by the group.</p>
                                    <PieChart displayLegend={true} width={270} height={270} mode="tasks"/> 
                                </div>
                                <div className="flex flex-col items-center xs:w-[90%] lg:w-[40%]">
                                    <h2 className="font-bold text-lg">Contribution Scores</h2>
                                    <p className="text-sm text-custom-textGrey text-center mt-4 mb-10">This chart shows the group contribution scores. The first column on each student shows the student’s peer assessment score and the second shows the self assessment score</p>
                                    <BarChart/>
                                </div>
                            </div>
                            <div className="w-full flex xs:flex-col lg:flex-row items-center justify-between xs:mt-12 lg:mt-20 xs:gap-12 lg:gap-0">
                                <div className="flex flex-col items-center xs:w-[90%] lg:w-[40%]">
                                    <h2 className="font-bold text-lg">Session durations</h2>
                                    <p className="text-sm text-custom-textGrey text-center mt-4 mb-6">This chart illustrates the total login time of group members within the assignment period. The login duration is calculated from recorded session timestamps, measuring the time each member spent logged into the platform between the assignment creation and its due date.</p>
                                    <PieChart displayLegend={true} width={270} height={270} mode="loginTimes"/> 
                                </div>
                                <div className="flex flex-col items-center xs:w-[90%] lg:w-[40%]">
                                    <h2 className="font-bold text-lg">Participation in discussion forums</h2>
                                    <p className="text-sm text-custom-textGrey text-center mt-4 mb-10">This chart illustrates students' participation in discussion forums, measured by the number of messages each student has sent. Please note that this metric reflects message quantity and may not fully represent the relevance or quality of contributions.</p>
                                    <PieChart displayLegend={true} width={270} height={270} mode="messages"/>
                                </div>
                            </div>
                            {assignment?.technical && <div className="w-full flex flex-col items-center mt-20">
                                <div className="flex flex-col xs:w-[90%] lg:w-[45%] items-center">
                                    <h2 className="font-bold text-lg">Github Commits</h2>
                                    <p className="text-sm text-custom-textGrey text-center mt-4 mb-6">This chart displays students' GitHub contribution statistics, measured by the number of commits each student has made. However, please note that the number of commits alone may not fully capture the significance or quality of their contributions.</p>
                                </div>
                                <PieChart displayLegend={true} width={270} height={270} mode="commits"/>
                            </div>}
                            <div className="w-full flex flex-col items-center mt-20">
                                <h2 className="font-bold text-lg">Task Details</h2>
                                <div className="w-full flex flex-col mt-8">
                                    {reportData.map((userReport) => (
                                        <div className="flex flex-col py-4 border-b border-custom-borderGrey xs:gap-6 lg:gap-4">
                                            <h2 className="font-semibold xs:mb-0 lg:mb-4">{userReport.fullName}</h2>                                   
                                            {userReport.tasks.map((task) => (
                                                <div className="flex xs:flex-col lg:flex-row xs:items-start lg:items-center xs:gap-2 lg:gap-6">
                                                    <div className="flex items-center gap-2">
                                                        <GoTasklist size={20} color={'black'}/>
                                                        <h2 className="text-sm">{task.description}</h2>
                                                    </div>
                                                    <button className={`rounded-full ${getStatusClass(task.status)} text-xs w-24 h-6`}>
                                                    {task.status === 'to_do' ? 'To do':task.status === 'in_progress'?'In progress':task.status === 'completed'?'completed':'stuck'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full mt-12 flex justify-center py-2 text-sm text-center">
                                This report was generated by TeamSync at {moment().tz('Africa/Kigali').toISOString()}
                            </div>
                        </div>
                    </div>}
                </div>
            </div>}

            <div className="w-[90%] flex xs:flex-col xs:gap-3 lg:flex-row lg:gap-0 xs:items-start lg:items-center justify-between bg-white rounded-xl shadow-md p-6 z-10">
                <div className="flex flex-col">
                    <h2 className="text-gray-800 text-xl font-bold">Group Reports</h2>
                    <p className="text-gray-500 mt-1">Analytics and contribution reports for student groups</p>
                </div>
                <div className="flex items-center xs:mt-2 lg:mt-0">
                    {groupFetching ? (
                        <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-400">
                            <ClipLoader size={16} color="#586AEA" className="mr-2" />
                            <span>Loading reports...</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-custom-blue">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">{groups.length} {groups.length === 1 ? 'group' : 'groups'} with reports</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-[90%] flex flex-col mt-8 z-10 bg-white rounded-xl shadow-lg">
                {!groupFetching && groups.length !== 0 && groups.map((group, index) => (
                    <div 
                        key={group.id}
                        className={`relative w-full flex items-center justify-between py-5 px-4 ${
                            index < groups.length - 1 ? 'border-b border-gray-200' : ''
                        } hover:bg-gray-50 rounded-md transition-all duration-200`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <HiOutlineDocumentReport color="#4F46E5" size={22}/>
                            </div>
                            <h2 className="font-semibold text-gray-800">{group.name}</h2>
                        </div>
                        <button 
                            className="px-4 py-2 bg-blue-50 text-custom-blue rounded-md mr-3 text-sm font-medium hover:bg-blue-100 transition-colors"
                            onClick={() => {setSelectedGroupId(group.id);setToggleViewDetails(true)}}
                        >
                            View
                        </button>
                    </div>
                ))}
                {groupFetching && <AssignmentSkeleton number={5} />}
                {!groupFetching && groups.length === 0 && <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                        <HiOutlineDocumentReport color="#4F46E5" size={32}/>
                    </div>
                    <h2 className="text-gray-500 text-lg">No group reports found</h2>
                    <p className="text-gray-400 mt-2"> 
                        Create groups for this assignment inorder to view report data
                    </p>
                </div>}
            </div>
        </div>    
    );
}
 
export default Reports;