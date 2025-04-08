import { Link, useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { MdOutlineMenuOpen } from "react-icons/md";
import { RiMenuFold4Line } from "react-icons/ri";
import { toggleSideMenu } from "../../redux/slices/appSettingSlice";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { GoTasklist } from "react-icons/go";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineQuiz } from "react-icons/md";


const Drawer = () => {
    const location = useLocation()
    const dispatch = useAppDispatch()
    const {isSideMenuExpanded} = useAppSelector(state => state.appSetting)
    const {projectId} = useParams()
    
    return (
        <div className={`xs:hidden lg:flex flex-col ${isSideMenuExpanded ? 'w-[20%]' : 'w-[5%]'} transition-width duration-300 bg-white border-r-[1.5px] border-custom-borderGrey items-center`}>        
            <div className="flex items-center justify-center my-4 hover:bg-[#f2f2f2] rounded-md p-1 self-end mr-2 cursor-pointer">
                {isSideMenuExpanded ? <MdOutlineMenuOpen color="black" size={20} onClick={() => dispatch(toggleSideMenu(false))}/> : <RiMenuFold4Line color="black" size={18} onClick={() => dispatch(toggleSideMenu(true))}/>}
            </div>
            <div className={`flex flex-col items-center w-full ${!isSideMenuExpanded && 'gap-4'}`}>
                <Link 
                    to={`/student/projects/${projectId}`} 
                    className={`${location.pathname === `/student/projects/${projectId}` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white': 'hover:bg-[#f2f2f2]'} flex items-center ${isSideMenuExpanded ? 'w-[92%] justify-start pl-4':'w-[75%] justify-center'} py-2 gap-4 rounded-lg`}>
                    <LuLayoutDashboard size={20} color={location.pathname === `/student/projects/${projectId}` ? 'white': 'black'}/>
                    <h2 className={`${isSideMenuExpanded ? 'flex' : 'hidden'}`}>Dashboard</h2>
                </Link>
                <Link 
                    to={`/student/projects/${projectId}/tasks`}
                    className={`${location.pathname === `/student/projects/${projectId}/tasks` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white': 'hover:bg-[#f2f2f2]'} flex items-center ${isSideMenuExpanded ? 'w-[92%] justify-start pl-4':'w-[75%] justify-center'} py-2 gap-4 rounded-lg`}>
                    <GoTasklist size={20} color={location.pathname === `/student/projects/${projectId}/tasks` ? 'white': 'black'}/>
                    <h2 className={`${isSideMenuExpanded ? 'flex' : 'hidden'}`}>Tasks</h2>
                </Link>
                <Link 
                    to={`/student/projects/${projectId}/chat`}
                    className={`${location.pathname === `/student/projects/${projectId}/chat` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white': 'hover:bg-[#f2f2f2]'} flex items-center ${isSideMenuExpanded ? 'w-[92%] justify-start pl-4':'w-[75%] justify-center'} py-2 gap-4 rounded-lg`}>
                    <IoChatbubbleEllipsesOutline size={20} color={location.pathname === `/student/projects/${projectId}/chat` ? 'white': 'black'}/>
                    <h2 className={`${isSideMenuExpanded ? 'flex' : 'hidden'}`}>Chat</h2>
                </Link>
                <Link 
                    to={`/student/projects/${projectId}/peerAssessment`}
                    className={`${location.pathname === `/student/projects/${projectId}/peerAssessment` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white': 'hover:bg-[#f2f2f2]'} flex items-center ${isSideMenuExpanded ? 'w-[92%] justify-start pl-4':'w-[75%] justify-center'} py-2 gap-4 rounded-lg`}>
                    <MdOutlineQuiz size={20} color={location.pathname === `/student/projects/${projectId}/peerAssessment` ? 'white': 'black'}/>
                    <h2 className={`${isSideMenuExpanded ? 'flex' : 'hidden'}`}>Peer assessment</h2>
                </Link>
                <Link 
                    to={`/student/projects/${projectId}/selfAssessment`}
                    className={`${location.pathname === `/student/projects/${projectId}/selfAssessment` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white': 'hover:bg-[#f2f2f2]'} flex items-center ${isSideMenuExpanded ? 'w-[92%] justify-start pl-4':'w-[75%] justify-center'} py-2 gap-4 rounded-lg`}>
                    <MdOutlineQuiz size={20} color={location.pathname === `/student/projects/${projectId}/selfAssessment` ? 'white': 'black'}/>
                    <h2 className={`${isSideMenuExpanded ? 'flex' : 'hidden'}`}>Self assessment</h2>
                </Link>
                <Link 
                    to={`/student/projects/${projectId}/report`}
                    className={`${location.pathname === `/student/projects/${projectId}/report` ? 'bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white': 'hover:bg-[#f2f2f2]'} flex items-center ${isSideMenuExpanded ? 'w-[92%] justify-start pl-4':'w-[75%] justify-center'} py-2 gap-4 rounded-lg`}>
                    <HiOutlineDocumentReport size={20} color={location.pathname === `/student/projects/${projectId}/report` ? 'white': 'black'}/>
                    <h2 className={`${isSideMenuExpanded ? 'flex' : 'hidden'}`}>Report</h2>
                </Link>
            </div>
        </div>
    );
}
 
export default Drawer;