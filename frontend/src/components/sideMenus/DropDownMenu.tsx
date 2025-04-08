import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../redux/actions/authActions";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import ClipLoader from "react-spinners/ClipLoader";
import { IoIosLogOut } from "react-icons/io";


interface IProps {
    setToggleDropDown: React.Dispatch<React.SetStateAction<boolean>>
}

const Menu = ({setToggleDropDown}: IProps) => {
    const {projectId} = useParams()
    const {assignmentId} = useParams()
    const navigate = useNavigate()
    const {user, loggingOut} = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()

    return (
        <div className="absolute top-16 left-0 right-0 flex flex-col items-center w-full py-4 bg-white z-50 border-b-[1.5px] border-custom-borderGrey">
            <div className="flex flex-col gap-4 w-[90%] items-center border-b-[1.5px] border-custom-borderGrey pb-2">
                <h2 onClick={() => {setToggleDropDown(false);navigate(user!.role === 'user'?"/student":"/instructor")}}>Home</h2>
                {user!.role === 'instructor' && <h2 onClick={() => {setToggleDropDown(false);navigate("/instructor/classes")}}>Classes</h2>}
                <h2 onClick={() => {setToggleDropDown(false);navigate(user!.role === 'user'?"/student/projects":"/instructor/assignments")}}>Assignments</h2>
                <h2 onClick={() => {setToggleDropDown(false);navigate(user!.role === 'user'?"/student/settings":"/instructor/settings")}}>Settings</h2>
            </div>
            {projectId && user!.role === 'user' && <div className="flex flex-col gap-4 w-[90%] items-center border-b-[1.5px] border-custom-borderGrey pb-4 mt-4">
                <h2 onClick={() => {setToggleDropDown(false);navigate(`/student/projects/${projectId}`)}}>Dashboard</h2>
                <h2 onClick={() => {setToggleDropDown(false);navigate(`/student/projects/${projectId}/tasks`)}}>Tasks</h2>
                <h2 onClick={() => {setToggleDropDown(false);navigate(`/student/projects/${projectId}/chat`)}}>Chat</h2>
                <h2 onClick={() => {setToggleDropDown(false);navigate(`/student/projects/${projectId}/peerAssessment`)}}>Peer Assessment</h2>
                <h2 onClick={() => {setToggleDropDown(false);navigate(`/student/projects/${projectId}/selfAssessment`)}}>Self Assessment</h2>
                <h2 onClick={() => {setToggleDropDown(false);navigate(`/student/projects/${projectId}/report`)}}>Report</h2>
            </div>}
            {assignmentId && user!.role === 'instructor' && <div className="flex flex-col gap-4 w-[90%] items-center border-b-[1.5px] border-custom-borderGrey pb-4 mt-4">
                <h2 onClick={() => {setToggleDropDown(false);navigate(`/instructor/assignments/${assignmentId}`)}}>Dashboard</h2>
                <h2 onClick={() => {setToggleDropDown(false);navigate(`/instructor/assignments/${assignmentId}/groups`)}}>Groups</h2>
                <h2 onClick={() => {setToggleDropDown(false);navigate(`/instructor/assignments/${assignmentId}/assessments`)}}>Assessments</h2>
                <h2 onClick={() => {setToggleDropDown(false);navigate(`/instructor/assignments/${assignmentId}/reports`)}}>Reports</h2>
            </div>}
            <div className="flex items-center gap-3 cursor-pointer mt-4">
                <img src={user!.profileImg} className="w-8 h-8 rounded-md"/>
                <h2 className="text-sm">{user!.fullName}</h2>    
            </div>
            <div className="flex items-center w-full justify-center gap-2 mt-8" onClick={() => dispatch(logout())}>
                {loggingOut && <ClipLoader size={20} color="#586AEA"/>}
                {!loggingOut && <IoIosLogOut size={20} color="black"/>}
                {!loggingOut && <h2>Logout</h2>}
            </div>
        </div>
    );
}
 
export default Menu;