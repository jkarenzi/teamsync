import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { HiOutlineDocumentReport, HiOutlineDotsVertical } from "react-icons/hi";
import AssignmentSkeleton from "../../components/skeletons/AssignmentSkeleton";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Assignment } from "../../types/Assignment";
import { IoClose } from "react-icons/io5";
import { getInstructorAssignments, getOwnAssignments } from "../../redux/actions/assignmentActions";

const Home = () => {
    const {user} = useAppSelector(state => state.user)
    const navigate = useNavigate()
    const [viewAssignment, setViewAssignment] = useState<Assignment | null>(null)
    const [toggleViewOverlay, setToggleViewOverlay] = useState(false)
    const {assignments, fetching} = useAppSelector(state => state.assignment)
    const [toggleMenu, setToggleMenu] = useState({state:false, id:''})
    const dispatch = useAppDispatch()
    const menuRef = useRef<HTMLDivElement>(null);
            
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
        if(user!.role === 'instructor'){
            dispatch(getInstructorAssignments())
        }

        if(user!.role === 'user'){
            dispatch(getOwnAssignments())
        }
    },[])

    useEffect(() => {
        if(viewAssignment){
            setToggleViewOverlay(true)
        }
    },[viewAssignment])

    const handleDashboardNav = (id:string) => {
        if(user!.role === 'instructor'){
            navigate(`/instructor/assignments/${id}`)
        }

        if(user!.role === 'user'){
            navigate(`/student/projects/${id}`)
        }
    }

    function getGreeting() {
        const hour = moment().hour();
      
        if (hour < 12) {
          return "Good morning";
        } else if (hour >= 12 && hour < 18) {
          return "Good afternoon";
        } else {
          return "Good evening";
        }
    }

    const getPendingTasks = () => {
        return user?.tasks.filter(task => task.status !== "completed").length
    }

    const getCompletedTasks = () => {
        return user?.tasks.filter(task => task.status === "completed").length
    }

    return (
        <div className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)] relative">
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>

            {viewAssignment && toggleViewOverlay && 
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[40rem] max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all duration-300 animate-fadeIn">
                        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                            <h2 className="font-semibold text-lg text-custom-blue">Assignment Details</h2>
                            <IoClose onClick={() => {setToggleViewOverlay(false);setViewAssignment(null)}} size={25} color="#4B5563" className="cursor-pointer hover:text-custom-blue transition-colors" />
                        </div>
                        <div className="w-full flex flex-col gap-8 py-8 px-6">
                            <div className="w-full flex flex-col gap-3 border-b border-gray-200 pb-6">
                                <h2 className="text-gray-800 text-xl font-semibold">{viewAssignment.name}</h2>
                                <h3 className="text-gray-600 font-medium">
                                    <span className="font-semibold">Due:</span> {viewAssignment.dueDateFormatted}
                                </h3>
                            </div>
                            <div className="flex flex-col w-full gap-6">
                                <h2 className="font-semibold text-lg text-gray-800">Description</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {viewAssignment.description}
                                </p>
                            </div>
                            <div className="flex justify-end w-full pt-4 border-t border-gray-200 mt-4">
                                <button 
                                    onClick={() => handleDashboardNav(viewAssignment.id)}
                                    className="px-6 py-3 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white rounded-md shadow-md transition-all duration-200 font-medium"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className="flex flex-col items-center w-full py-12">
                <div className="w-[90%] max-w-[1200px] flex flex-col">
                    <div className="flex flex-col bg-white rounded-xl shadow-lg p-8 mb-10 relative overflow-hidden">
                        <div className="absolute w-40 h-40 rounded-full bg-custom-blue opacity-5 -top-20 -right-20"></div>
                        
                        <span className="text-custom-blue text-sm font-medium">{moment().format('dddd, Do MMMM')}</span>
                        <h1 className="text-gray-800 text-3xl font-bold mt-2 mb-6">{getGreeting()}, {user!.fullName.split(' ')[0]}</h1>
                        
                        {user!.role === 'user' && 
                            <div className="w-full flex xs:flex-col lg:flex-row items-stretch gap-6 mt-4">
                                <div className="flex flex-col items-center justify-center gap-4 xs:w-full lg:flex-1 p-6 rounded-xl bg-gradient-to-br from-white to-blue-50 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100">
                                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100">
                                        <img src="/folder.png" width={32} height={32} className="opacity-80" />
                                    </div>
                                    <h2 className="text-gray-700 text-lg">
                                        <span className="font-bold text-custom-blue">{assignments.length}</span> projects
                                    </h2>
                                </div>
                                
                                <div className="flex flex-col items-center justify-center gap-4 xs:w-full lg:flex-1 p-6 rounded-xl bg-gradient-to-br from-white to-amber-50 shadow-md hover:shadow-lg transition-all duration-300 border border-amber-100">
                                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-100">
                                        <img src="/pending.png" width={28} height={28} className="opacity-80" />
                                    </div>
                                    <h2 className="text-gray-700 text-lg">
                                        <span className="font-bold text-amber-500">{getPendingTasks()}</span> pending tasks
                                    </h2>
                                </div>
                                
                                <div className="flex flex-col items-center justify-center gap-4 xs:w-full lg:flex-1 p-6 rounded-xl bg-gradient-to-br from-white to-green-50 shadow-md hover:shadow-lg transition-all duration-300 border border-green-100">
                                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
                                        <img src="/completed.png" width={28} height={28} className="opacity-80" />
                                    </div>
                                    <h2 className="text-gray-700 text-lg">
                                        <span className="font-bold text-green-600">{getCompletedTasks()}</span> tasks completed
                                    </h2>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 mt-4 w-full z-10">
                        <h2 className="text-gray-800 text-xl font-bold mb-6 border-l-4 border-custom-blue pl-3">
                            {user!.role === 'user' ? 'Recent Group Assignments' : 'Recent Assignments'}
                        </h2>
                        
                        <div className="w-full flex flex-col">
                            {!fetching ? (
                                assignments.length > 0 ? (
                                    assignments.slice(0,4).map((assignment, index) => (
                                        <div 
                                            key={assignment.id}
                                            className={`relative w-full flex items-center justify-between py-5 px-4 ${
                                                index < assignments.slice(0,4).length - 1 ? 'border-b border-gray-200' : ''
                                            } hover:bg-gray-50 rounded-md transition-all duration-200`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-50 rounded-lg">
                                                    <HiOutlineDocumentReport color="#4F46E5" size={22}/>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <h2 className="font-semibold text-gray-800">{assignment.name}</h2>
                                                    <h3 className="text-gray-500 text-sm">
                                                        <span className="font-semibold">Due:</span> {assignment.dueDateFormatted}
                                                    </h3>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center">
                                                <button 
                                                    className="xs:hidden lg:flex px-4 py-2 bg-blue-50 text-custom-blue rounded-md mr-3 text-sm font-medium hover:bg-blue-100 transition-colors"
                                                    onClick={() => handleDashboardNav(assignment.id)}
                                                >
                                                    Dashboard
                                                </button>
                                                
                                                <div className="relative">
                                                    <HiOutlineDotsVertical 
                                                        className="cursor-pointer p-1 hover:bg-gray-100 rounded-full" 
                                                        color='#4B5563' 
                                                        size={24} 
                                                        onClick={() => setToggleMenu((prev) => ({
                                                            state: prev.id === assignment.id ? !prev.state : true, 
                                                            id: assignment.id
                                                        }))}
                                                    />
                                                    
                                                    {toggleMenu.id === assignment.id && toggleMenu.state && (
                                                        <div 
                                                            ref={menuRef} 
                                                            className="absolute top-full right-0 flex flex-col items-center bg-white rounded-lg w-40 gap-1 z-10 py-2 shadow-lg border border-gray-200 mt-1 animate-fadeIn"
                                                        >
                                                            <div 
                                                                className="w-[90%] p-2 text-gray-700 hover:bg-custom-blue hover:text-white rounded-md cursor-pointer text-sm transition-colors"
                                                                onClick={() => handleDashboardNav(assignment.id)}
                                                            >
                                                                Go to dashboard
                                                            </div>
                                                            <div 
                                                                className="w-[90%] p-2 text-gray-700 hover:bg-custom-blue hover:text-white rounded-md cursor-pointer text-sm transition-colors"
                                                                onClick={() => setViewAssignment(assignment)}
                                                            >
                                                                View details
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                                            <HiOutlineDocumentReport color="#4F46E5" size={32}/>
                                        </div>
                                        <h2 className="text-gray-500 text-lg">No assignments found</h2>
                                        <p className="text-gray-400 mt-2">Assignments will appear here when available</p>
                                    </div>
                                )
                            ) : (
                                <AssignmentSkeleton number={4} />
                            )}
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    );
}
 
export default Home;