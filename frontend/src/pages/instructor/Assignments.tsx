import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import { HiOutlineDocumentReport, HiOutlineDotsVertical } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createAssignment, deleteAssignment, getInstructorAssignments, getOwnAssignments, updateAssignment } from "../../redux/actions/assignmentActions";
import { createAssignmentSchema, updateAssignmentSchema } from "../../validationSchema/assignmentSchema";
import ClipLoader from "react-spinners/ClipLoader";
import { resetStatus } from "../../redux/slices/assignmentSlice";
import { Assignment, ICreateAssignmentFormData } from "../../types/Assignment";
import moment from 'moment-timezone'
import AssignmentSkeleton from "../../components/skeletons/AssignmentSkeleton";
import { useNavigate } from "react-router-dom";
import { getAllClasses } from "../../redux/actions/classActions";


const Assignments = () => {
    const [toggleCreateAssignment, setToggleCreateAssignment] = useState(false)
    const {loading, status, assignments, fetching} = useAppSelector(state => state.assignment)
    const [toggleMenu, setToggleMenu] = useState({state:false, id:''})
    const [toggleDeleteOverlay, setToggleDeleteOverlay] = useState({state:false, name:'', id:''})
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
    const [viewAssignment, setViewAssignment] = useState<Assignment | null>(null)
    const [toggleEditOverlay, setToggleEditOverlay] = useState(false)
    const [toggleViewOverlay, setToggleViewOverlay] = useState(false)
    const {user} = useAppSelector(state => state.user)
    const {classes} = useAppSelector(state => state.studentClass)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
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

    const formik = useFormik({
        initialValues:{
            name:'',
            description:'',
            dueDate: '',
            classId:'',
            technical: ''
        },
        onSubmit: (formData) => {
            dispatch(createAssignment({
                ...formData,
                dueDate: moment.tz(formData.dueDate, "YYYY-MM-DDTHH:mm", "Africa/Kigali").utc().toISOString(),
                technical: formData.technical === 'enable' ? true : false
            }))
        },
        validationSchema: createAssignmentSchema
    })

    const updateFormik = useFormik({
        initialValues:{
            name:selectedAssignment?.name,
            description:selectedAssignment?.description,
            classId: selectedAssignment?.studentClass.id,
            dueDate: selectedAssignment?.dueDate ? moment(selectedAssignment.dueDate).format('YYYY-MM-DDTHH:mm') : null
        },
        onSubmit: (theFormData) => {
            const formData = {
                ...theFormData,
                dueDate: moment.tz(theFormData.dueDate as string, "YYYY-MM-DDTHH:mm", "Africa/Kigali").utc().toISOString()
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data:{[key:string]: any} = {}
            for(const key in formData){
                if(formData[key as keyof ICreateAssignmentFormData] !== selectedAssignment![key as keyof Assignment]){
                    data[key] = formData[key as keyof ICreateAssignmentFormData]
                }
            }

            if(Object.keys(data).length !== 0){
                dispatch(updateAssignment({id: selectedAssignment!.id, formData: data}))
            }
        },
        enableReinitialize: true,
        validationSchema: updateAssignmentSchema
    })

    useEffect(() => {
        if(status === 'successful'){
            if(toggleCreateAssignment){
                formik.resetForm()
                setToggleCreateAssignment(false)
            }

            if(toggleEditOverlay){
                updateFormik.resetForm()
                setToggleEditOverlay(false)
                setSelectedAssignment(null)
            }

            if(toggleDeleteOverlay.state){
                setToggleDeleteOverlay({state:false, id:'', name:''}) 
            }

            setToggleMenu({state: false, id:''})      
            dispatch(resetStatus())
        }
    },[status])

    useEffect(() => {
        if(user!.role === 'instructor'){
            dispatch(getInstructorAssignments())
        }

        if(user!.role === 'user'){
            dispatch(getOwnAssignments())
        } 
    },[])

    useEffect(() => {
        if(selectedAssignment){
            setToggleEditOverlay(true)
        } 
    },[selectedAssignment])

    useEffect(() => {
        if(viewAssignment){
            setToggleViewOverlay(true)
        } 
    },[viewAssignment])

    useEffect(() => {
        dispatch(getAllClasses())
    },[])

    const handleDashboardNav = (id:string) => {
        if(user!.role === 'instructor'){
            navigate(`/instructor/assignments/${id}`)
        }

        if(user!.role === 'user'){
            navigate(`/student/projects/${id}`)
        }
    }

    return (
        <div className={`flex lg:w-[92%] xs:w-full h-[calc(100vh-4rem)] flex-col items-center overflow-y-auto overflow-x-hidden py-8 bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)] relative`}>
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>
            
            <div className="w-[90%] flex xs:flex-col lg:flex-row xs:items-start xs:gap-4 lg:gap-0 lg:items-center justify-between bg-white rounded-xl shadow-lg p-6 z-10">
                <div className="flex flex-col">
                    <h2 className="text-custom-textBlack text-2xl font-bold">{user!.role === 'instructor' ? 'Assignments' : 'My Assignments'}</h2>
                    <p className="text-gray-500 mt-1">Manage your course assignments in one place</p>
                </div>
                {user!.role === 'instructor' && 
                    <button 
                        className="flex items-center justify-center px-5 py-2.5 rounded-md gap-2 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white shadow-md transition-all duration-200" 
                        onClick={() => setToggleCreateAssignment(true)}
                    >
                        <GoPlus color="white" size={18}/>
                        <h2 className="text-white font-medium">New Assignment</h2>
                    </button>
                }
            </div>

            {toggleCreateAssignment && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[30rem] max-h-screen overflow-y-auto shadow-2xl transform transition-all duration-300 animate-fadeIn">
                        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                            <h2 className="font-semibold text-lg text-custom-blue">Create Assignment</h2>
                            <IoClose onClick={() => setToggleCreateAssignment(false)} size={25} className="cursor-pointer hover:text-custom-blue transition-colors" />
                        </div>
                        <form onSubmit={formik.handleSubmit} className="w-[90%] flex flex-col items-center gap-6 py-6">
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-medium text-gray-700">Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your assignment name here"
                                    className={`border ${formik.touched.name && formik.errors.name ? 'border-red-500': 'border-gray-300'} outline-none rounded-md w-full h-11 px-3 bg-gray-50 focus:ring-2 focus:ring-blue-100 transition-all`}
                                    {...formik.getFieldProps('name')}
                                />
                                {formik.touched.name && formik.errors.name && <div className="text-red-500 text-sm">{formik.errors.name}</div>}
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-medium text-gray-700">Description</label>
                                <textarea 
                                    placeholder="Enter your assignment description here"
                                    className={`w-full h-36 resize-none border ${formik.touched.description && formik.errors.description ? 'border-red-500': 'border-gray-300'} outline-none rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-100 transition-all`}
                                    {...formik.getFieldProps('description')}
                                ></textarea>
                                {formik.touched.description && formik.errors.description && <div className="text-red-500 text-sm">{formik.errors.description}</div>}
                            </div>
                            <div className="flex flex-col w-full gap-2">
                                <label className="font-medium text-gray-700">Assign to</label>
                                <select 
                                    className="border border-gray-300 outline-none rounded-md w-full h-11 px-3 bg-gray-50 focus:ring-2 focus:ring-blue-100 transition-all"
                                    {...formik.getFieldProps('classId')}
                                >
                                    <option value=''>Select Class</option>
                                    {classes.map(studentClass => <option key={studentClass.id} value={studentClass.id}>{studentClass.name}</option>)}
                                </select>
                                {formik.touched.classId && formik.errors.classId && <div className="text-red-500 text-sm">{formik.errors.classId}</div>}
                            </div>
                            <div className="flex flex-col w-full gap-2">
                                <label className="font-medium text-gray-700">GitHub Tracking</label>
                                <select 
                                    className="border border-gray-300 outline-none rounded-md w-full h-11 px-3 bg-gray-50 focus:ring-2 focus:ring-blue-100 transition-all"
                                    {...formik.getFieldProps('technical')}
                                >
                                    <option value=''>Select option</option>
                                    <option value='enable'>Enable</option>
                                    <option value='disable'>Disable</option>
                                </select>
                                {formik.touched.technical && formik.errors.technical && <div className="text-red-500 text-sm">{formik.errors.technical}</div>}
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-medium text-gray-700">Due Date</label>
                                <input 
                                    type="datetime-local" 
                                    className={`border ${formik.touched.dueDate && formik.errors.dueDate ? 'border-red-500': 'border-gray-300'} outline-none rounded-md w-full h-11 px-3 bg-gray-50 focus:ring-2 focus:ring-blue-100 transition-all`}
                                    {...formik.getFieldProps('dueDate')}
                                />
                                {formik.touched.dueDate && formik.errors.dueDate && <div className="text-red-500 text-sm">{formik.errors.dueDate}</div>}
                            </div>
                            <button 
                                type='submit' 
                                className='flex items-center justify-center w-full h-12 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white font-medium rounded-md mt-6 shadow-md transition-all duration-200'
                            >
                                {loading ? <ClipLoader size={24} color='white'/> : 'Create Assignment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {selectedAssignment && toggleEditOverlay && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[30rem] max-h-screen overflow-y-auto shadow-2xl transform transition-all duration-300 animate-fadeIn">
                        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                            <h2 className="font-semibold text-lg text-custom-blue">Edit Assignment</h2>
                            <IoClose onClick={() => {setToggleEditOverlay(false);setSelectedAssignment(null)}} size={25} className="cursor-pointer hover:text-custom-blue transition-colors" />
                        </div>
                        <form onSubmit={updateFormik.handleSubmit} className="w-[90%] flex flex-col items-center gap-6 py-6">
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-medium text-gray-700">Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your assignment name here"
                                    className={`border ${updateFormik.touched.name && updateFormik.errors.name ? 'border-red-500': 'border-gray-300'} outline-none rounded-md w-full h-11 px-3 bg-gray-50 focus:ring-2 focus:ring-blue-100 transition-all`}
                                    {...updateFormik.getFieldProps('name')}
                                />
                                {updateFormik.touched.name && updateFormik.errors.name && <div className="text-red-500 text-sm">{updateFormik.errors.name}</div>}
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-medium text-gray-700">Description</label>
                                <textarea 
                                    placeholder="Enter your assignment description here"
                                    className={`w-full h-36 resize-none border ${updateFormik.touched.description && updateFormik.errors.description ? 'border-red-500': 'border-gray-300'} outline-none rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-100 transition-all`}
                                    {...updateFormik.getFieldProps('description')}
                                ></textarea>
                                {updateFormik.touched.description && updateFormik.errors.description && <div className="text-red-500 text-sm">{updateFormik.errors.description}</div>}
                            </div>
                            <div className="flex flex-col w-full gap-2">
                                <label className="font-medium text-gray-700">Assign to</label>
                                <select 
                                    className="border border-gray-300 outline-none rounded-md w-full h-11 px-3 bg-gray-50 focus:ring-2 focus:ring-blue-100 transition-all"
                                    {...updateFormik.getFieldProps('classId')}
                                >
                                    <option value=''>Select Class</option>
                                    {classes.map(studentClass => <option key={studentClass.id} value={studentClass.id}>{studentClass.name}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-medium text-gray-700">Due Date</label>
                                <input 
                                    type="datetime-local" 
                                    className={`border ${updateFormik.touched.dueDate && updateFormik.errors.dueDate ? 'border-red-500': 'border-gray-300'} outline-none rounded-md w-full h-11 px-3 bg-gray-50 focus:ring-2 focus:ring-blue-100 transition-all`}
                                    {...updateFormik.getFieldProps('dueDate')}
                                />
                                {updateFormik.touched.dueDate && formik.errors.dueDate && <div className="text-red-500 text-sm">{updateFormik.errors.dueDate}</div>}
                            </div>
                            <button 
                                type='submit' 
                                className='flex items-center justify-center w-full h-12 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white font-medium rounded-md mt-6 shadow-md transition-all duration-200'
                            >
                                {loading ? <ClipLoader size={24} color='white'/> : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {viewAssignment && toggleViewOverlay && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[40rem] max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all duration-300 animate-fadeIn">
                        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                            <h2 className="font-semibold text-lg text-custom-blue">Assignment Details</h2>
                            <IoClose onClick={() => {setToggleViewOverlay(false);setViewAssignment(null)}} size={25} className="cursor-pointer hover:text-custom-blue transition-colors" />
                        </div>
                        <div className="w-full flex flex-col gap-8 py-8 px-6">
                            <div className="w-full flex flex-col gap-3 border-b border-gray-200 pb-6">
                                <h2 className="text-gray-800 text-xl font-semibold">{viewAssignment.name}</h2>
                                <h3 className="text-gray-600 font-medium">
                                    <span className="font-semibold">Due:</span> {viewAssignment.dueDateFormatted}
                                </h3>
                                {viewAssignment.studentClass && (
                                    <span className="text-sm bg-blue-50 text-custom-blue px-3 py-1 rounded-full w-fit">
                                        {viewAssignment.studentClass.name}
                                    </span>
                                )}
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
            )}

            {toggleDeleteOverlay.state && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[30rem] shadow-2xl animate-fadeIn">
                        <div className="flex items-center w-full px-6 py-4 border-b border-gray-200">
                            <h2 className="font-semibold text-lg text-red-600">Delete Assignment</h2>
                        </div>
                        <div className="w-full px-6 py-8">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-50">
                                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-center text-gray-700 mb-8">
                                Are you sure you want to delete the assignment <span className="font-semibold">"{toggleDeleteOverlay.name}"</span>?
                                <br />
                                <span className="text-sm text-gray-500">This action cannot be undone.</span>
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <button 
                                    onClick={() => setToggleDeleteOverlay({state:false, id:'', name:''})}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => dispatch(deleteAssignment(toggleDeleteOverlay.id))}
                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-sm"
                                >
                                    {loading ? <ClipLoader size={20} color="white"/> : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-[90%] flex flex-col bg-white rounded-xl shadow-lg mt-8 p-6 z-10">
                <h2 className="text-gray-800 text-xl font-bold mb-6 border-l-4 border-custom-blue pl-3">
                    {user!.role === 'instructor' ? 'All Assignments' : 'Assigned to Me'}
                </h2>
                
                <div className="w-full flex flex-col">
                    {!fetching ? (
                        assignments.length > 0 ? (
                            assignments.map((assignment, index) => (
                                <div 
                                    key={assignment.id}
                                    className={`relative w-full flex items-center justify-between py-5 px-4 ${
                                        index < assignments.length - 1 ? 'border-b border-gray-200' : ''
                                    } hover:bg-gray-50 rounded-md transition-all duration-200`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <HiOutlineDocumentReport color="#4F46E5" size={22}/>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-semibold text-gray-800">{assignment.name}</h2>
                                            <div className="flex xs:flex-col lg:flex-row xs:items-start lg:items-center gap-3">
                                                <h3 className="text-gray-500 text-sm">
                                                    <span className="font-semibold">Due:</span> {assignment.dueDateFormatted}
                                                </h3>
                                                {assignment.studentClass && (
                                                    <span className="text-xs bg-blue-50 text-custom-blue px-2.5 py-1 rounded-full">
                                                        {assignment.studentClass.name}
                                                    </span>
                                                )}
                                            </div>
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
                                                    {user!.role === 'instructor' && (
                                                        <>
                                                            <div 
                                                                className="w-[90%] p-2 text-gray-700 hover:bg-custom-blue hover:text-white rounded-md cursor-pointer text-sm transition-colors"
                                                                onClick={() => setSelectedAssignment(assignment)}
                                                            >
                                                                Edit
                                                            </div>
                                                            <div 
                                                                className="w-[90%] p-2 text-gray-700 hover:bg-custom-blue hover:text-white rounded-md cursor-pointer text-sm transition-colors"
                                                                onClick={() => setToggleDeleteOverlay({state:true, name:assignment.name, id: assignment.id})}
                                                            >
                                                                Delete
                                                            </div>
                                                        </>
                                                    )}
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
                                <p className="text-gray-400 mt-2">
                                    {user!.role === 'instructor' 
                                        ? "Create your first assignment by clicking the 'New Assignment' button" 
                                        : "You don't have any assignments yet"}
                                </p>
                            </div>
                        )
                    ) : (
                        <AssignmentSkeleton number={5} />
                    )}
                </div>
            </div>
        </div>
    );
}
 
export default Assignments;