import { Link, useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { MdOutlineMenuOpen } from "react-icons/md";
import { RiMenuFold4Line } from "react-icons/ri";
import { toggleSideMenu } from "../../redux/slices/appSettingSlice";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineDocumentReport, HiOutlineUsers } from "react-icons/hi";
import { MdOutlineQuiz } from "react-icons/md";


const Drawer = () => {
    const location = useLocation()
    const dispatch = useAppDispatch()
    const {isSideMenuExpanded} = useAppSelector(state => state.appSetting)
    const {assignmentId} = useParams()
    console.log(assignmentId)
    
    return (
        <div className={`xs:hidden lg:flex flex-col ${isSideMenuExpanded ? 'w-[20%]' : 'w-[5%]'} transition-width duration-300 bg-white border-r-[1.5px] border-custom-borderGrey items-center`}>        
            <div className="flex items-center justify-center my-4 hover:bg-[#f2f2f2] rounded-md p-1 self-end mr-2 cursor-pointer">
                {isSideMenuExpanded ? <MdOutlineMenuOpen color="black" size={20} onClick={() => dispatch(toggleSideMenu(false))}/> : <RiMenuFold4Line color="black" size={18} onClick={() => dispatch(toggleSideMenu(true))}/>}
            </div>
            <div className={`flex flex-col items-center w-full ${!isSideMenuExpanded && 'gap-4'}`}>
                <Link 
                    to={`/instructor/assignments/${assignmentId}`} 
                    className={`${location.pathname === `/instructor/assignments/${assignmentId}` ? 'bg-custom-blue text-white': 'hover:bg-[#f2f2f2]'} flex items-center ${isSideMenuExpanded ? 'w-[92%] justify-start pl-4':'w-[75%] justify-center'} py-2 gap-4 rounded-lg`}>
                    <LuLayoutDashboard size={20} color={location.pathname === `/instructor/assignments/${assignmentId}` ? 'white': 'black'}/>
                    <h2 className={`${isSideMenuExpanded ? 'flex' : 'hidden'}`}>Dashboard</h2>
                </Link>
                <Link 
                    to={`/instructor/assignments/${assignmentId}/groups`}
                    className={`${location.pathname === `/instructor/assignments/${assignmentId}/groups` ? 'bg-custom-blue text-white': 'hover:bg-[#f2f2f2]'} flex items-center ${isSideMenuExpanded ? 'w-[92%] justify-start pl-4':'w-[75%] justify-center'} py-2 gap-4 rounded-lg`}>
                    <HiOutlineUsers size={20} color={location.pathname === `/instructor/assignments/${assignmentId}/groups` ? 'white': 'black'}/>
                    <h2 className={`${isSideMenuExpanded ? 'flex' : 'hidden'}`}>Groups</h2>
                </Link>
                <Link 
                    to={`/instructor/assignments/${assignmentId}/assessments`}
                    className={`${location.pathname === `/instructor/assignments/${assignmentId}/assessments` ? 'bg-custom-blue text-white': 'hover:bg-[#f2f2f2]'} flex items-center ${isSideMenuExpanded ? 'w-[92%] justify-start pl-4':'w-[75%] justify-center'} py-2 gap-4 rounded-lg`}>
                    <MdOutlineQuiz size={20} color={location.pathname === `/instructor/assignments/${assignmentId}/assessments` ? 'white': 'black'}/>
                    <h2 className={`${isSideMenuExpanded ? 'flex' : 'hidden'}`}>Assessments</h2>
                </Link>
                <Link 
                    to={`/instructor/assignments/${assignmentId}/reports`}
                    className={`${location.pathname === `/instructor/assignments/${assignmentId}/reports` ? 'bg-custom-blue text-white': 'hover:bg-[#f2f2f2]'} flex items-center ${isSideMenuExpanded ? 'w-[92%] justify-start pl-4':'w-[75%] justify-center'} py-2 gap-4 rounded-lg`}>
                    <HiOutlineDocumentReport size={20} color={location.pathname === `/instructor/assignments/${assignmentId}/reports` ? 'white': 'black'}/>
                    <h2 className={`${isSideMenuExpanded ? 'flex' : 'hidden'}`}>Reports</h2>
                </Link>
            </div>
        </div>
    );
}
 
export default Drawer;