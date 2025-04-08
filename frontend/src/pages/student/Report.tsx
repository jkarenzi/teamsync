import { GoTasklist } from "react-icons/go";
import BarChart from "../../components/charts/BarChart";
import PieChart from "../../components/charts/PieChart";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { getContributionReport } from "../../redux/actions/reportActions";
import { getStatusClass } from "../../utils/taskUtils";
import moment from "moment-timezone";
import { usePDF } from "react-to-pdf";



const Report = () => {
    const {isSideMenuExpanded} = useAppSelector(state => state.appSetting)
    const {reportData} = useAppSelector(state => state.report)
    const {group} = useAppSelector(state => state.group)
    const dispatch = useAppDispatch()
    const { toPDF, targetRef } = usePDF({
        filename: `${group?.name} Contribution Report.pdf`,
        page: { 
            margin: 10
        }
    })

    useEffect(() => {
        if(group){
            dispatch(getContributionReport(group.id))
        }
    },[group])

    return (
        <div className={`flex ${isSideMenuExpanded?'lg:w-[72%]':'lg:w-[87%]'} xs:w-full h-[calc(100vh-4rem)] flex-col items-center overflow-y-auto overflow-x-hidden bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)] relative`}>
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>
            
            
            <div className="w-[90%] flex flex-col z-10">
                <div className="flex xs:flex-col lg:flex-row justify-between xs:items-start lg:items-center w-full mt-8 xs:gap-6 lg:gap-0 bg-white p-6 rounded-xl shadow-md">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-bold text-lg">{group?.name} Contribution Report</h1>
                        <h2 className="text-sm text-custom-textGrey">View how each group member contributed to the project</h2>
                    </div>
                    <button type='submit' onClick={() => toPDF()} className='flex items-center justify-center w-32 h-8 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white rounded-md text-sm cursor-pointer'>{'Export as PDF'}</button>
                </div>  
                <div className="w-full shadow-md bg-white rounded-xl flex justify-center my-12 border border-gray-100" ref={targetRef}>
                    <div className="w-[90%] flex flex-col pt-4">
                        <div className="flex xs:flex-col lg:flex-row xs:items-start lg:items-center lg:justify-between xs:gap-4 lg:gap-0">
                            <h1 className="font-bold text-xl">{group?.name} Contribution Report</h1>
                        </div>
                        <div className="w-full flex xs:flex-col lg:flex-row items-center justify-between mt-12 xs:gap-12 lg:gap-0">
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
                                <p className="text-sm text-custom-textGrey text-center mt-4 mb-6">This chart illustrates the total login time in hours of group members within the assignment period. The login duration is calculated from recorded session timestamps, measuring the time each member spent logged into the platform between the assignment creation and its due date.</p>
                                <PieChart displayLegend={true} width={270} height={270} mode="loginTimes"/> 
                            </div>
                            <div className="flex flex-col items-center xs:w-[90%] lg:w-[40%]">
                                <h2 className="font-bold text-lg">Participation in discussion forums</h2>
                                <p className="text-sm text-custom-textGrey text-center mt-4 mb-10">This chart illustrates students' participation in discussion forums, measured by the number of messages each student has sent. Please note that this metric reflects message quantity and may not fully represent the relevance or quality of contributions.</p>
                                <PieChart displayLegend={true} width={270} height={270} mode="messages"/>
                            </div>
                        </div>
                        {group?.githubRepoLink && <div className="w-full flex flex-col items-center mt-20">
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
                </div>
            </div>
        </div>  
    );
}
 
export default Report;