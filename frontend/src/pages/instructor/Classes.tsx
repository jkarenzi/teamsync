import { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import { StudentClass } from "../../types/StudentClass";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { HiOutlineDotsVertical } from "react-icons/hi";
import AssignmentSkeleton from "../../components/skeletons/AssignmentSkeleton";
import { createClass, deleteClass, getAllClasses, updateClass } from "../../redux/actions/classActions";
import { RiBookMarkedLine } from "react-icons/ri";
import ClipLoader from "react-spinners/ClipLoader";
import { IoClose } from "react-icons/io5";
import { useFormik } from "formik";
import classSchema from "../../validationSchema/classSchema";
import { getUsers } from "../../redux/actions/authActions";
import { resetFetchStatus } from "../../redux/slices/userSlice";
import { resetStatus } from "../../redux/slices/classSlice";


interface IData {
    userIds: string[],
    name:string,
    description:string
}

const Classes = () => {
    const [toggleCreateClass, setToggleCreateClass] = useState(false)
    const [toggleMenu, setToggleMenu] = useState({state:false, id:''})
    const [toggleDeleteOverlay, setToggleDeleteOverlay] = useState({state:false, name:'', id:''})
    const [selectedClass, setSelectedClass] = useState<StudentClass | null>(null)
    const {users, fetchStatus} = useAppSelector(state => state.user)
    const userFetching = useAppSelector(state => state.user.fetching)
    const {classes, fetching, loading, status} = useAppSelector(state => state.studentClass)
    const [viewClass, setViewClass] = useState<StudentClass | null>(null)
    const [toggleEditOverlay, setToggleEditOverlay] = useState(false)
    const [toggleViewOverlay, setToggleViewOverlay] = useState(false)
    const [params, setParams] = useState({name:'', intake:'', startYear:'', program:'',role:'user'})
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
        dispatch(getAllClasses())
    },[])

    useEffect(() => {
        if(viewClass){
            setToggleViewOverlay(true)
        } 
    },[viewClass])

    
    useEffect(() => {
        if(selectedClass){
            setToggleEditOverlay(true)
        } 
    },[selectedClass])

    useEffect(() => {
        if(fetchStatus === 'successful'){
            if(selectedClass){
                updateFormik.setFieldValue('userIds', users.map(user => user.id))
            }else{
                formik.setFieldValue('userIds', users.map(user => user.id))
            }
            dispatch(resetFetchStatus())
        }
    },[fetchStatus])

    useEffect(() => {
        if(status === 'successful'){
            if(toggleCreateClass){
                formik.resetForm()
                setToggleCreateClass(false)
            }

            if(toggleEditOverlay){
                updateFormik.resetForm()
                setToggleEditOverlay(false)
                setSelectedClass(null)
            }

            if(toggleDeleteOverlay.state){
                setToggleDeleteOverlay({state:false, id:'', name:''}) 
            }

            setToggleMenu({state: false, id:''})      
            dispatch(resetStatus())
        }
    },[status])

    const formik = useFormik({
        initialValues:{
            name:'',
            description:'',
            userIds: []
        } as IData,
        onSubmit: (formData) => {
            dispatch(createClass(formData))
        },
        validationSchema: classSchema
    })

    const updateFormik = useFormik({
        initialValues:{
            name: selectedClass?.name,
            description: selectedClass?.description,
            userIds: selectedClass ? selectedClass.students.map(student => student.id) : []
        } as IData,
        onSubmit: (formData) => {
            if(selectedClass){
                dispatch(updateClass({id: selectedClass.id, formData}))
            }
        },
        enableReinitialize: true,
        validationSchema: classSchema
    })

    useEffect(() => {
        dispatch(getUsers(params))
    },[params])

    const handleCheckBoxChange = (id:string, mode:'create'|'edit') => {
        if(mode === 'create'){
            if(formik.values.userIds.includes(id)){
                formik.setFieldValue('userIds', formik.values.userIds.filter(theId => theId !== id))
            }else{
                formik.setFieldValue('userIds', [...formik.values.userIds, id])
            }
        }else{
            if(updateFormik.values.userIds.includes(id)){
                updateFormik.setFieldValue('userIds', updateFormik.values.userIds.filter(theId => theId !== id))
            }else{
                updateFormik.setFieldValue('userIds', [...updateFormik.values.userIds, id])
            }
        }
    }

    return (
        <div className="relative flex lg:w-[92%] xs:w-full h-[calc(100vh-4rem)] flex-col items-center overflow-y-auto overflow-x-hidden py-8 bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)]">
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>

            <div className="w-[90%] flex xs:flex-col xs:gap-4 lg:flex-row lg:gap-o xs:items-start lg:items-center justify-between bg-white rounded-xl shadow-lg p-6 z-10">
                <div className="flex flex-col">
                    <h2 className="text-custom-textBlack text-2xl font-bold">Classes</h2>
                    <p className="text-gray-500 mt-1">Manage your course classes and student groups</p>
                </div>
                <button 
                    className="flex items-center justify-center px-5 py-2.5 rounded-md gap-2 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white shadow-md transition-all duration-200" 
                    onClick={() => setToggleCreateClass(true)}
                >
                    <GoPlus color="white" size={18}/>
                    <h2 className="text-white font-medium">New Class</h2>
                </button>
            </div>

            <div className="w-[90%] flex flex-col bg-white rounded-xl shadow-lg mt-8 p-6 z-10">
                <h2 className="text-gray-800 text-xl font-bold mb-6 border-l-4 border-custom-blue pl-3">All Classes</h2>
                
                <div className="w-full flex flex-col">
                    {!fetching ? (
                        classes.length > 0 ? (
                            classes.map((studentClass, index) => (
                                <div 
                                    key={studentClass.id}
                                    className={`relative w-full flex items-center justify-between py-5 px-4 ${
                                        index < classes.length - 1 ? 'border-b border-gray-200' : ''
                                    } hover:bg-gray-50 rounded-md transition-all duration-200`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <RiBookMarkedLine color="#4F46E5" size={22}/>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-semibold text-gray-800">{studentClass.name}</h2>
                                            <div className="flex items-center">
                                                <h3 className="text-gray-500 text-sm flex items-center">
                                                    <span className="flex items-center mr-1">
                                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                        </svg>
                                                        {studentClass.students.length} {studentClass.students.length === 1 ? 'student' : 'students'}
                                                    </span>
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <button 
                                            className="xs:hidden lg:flex px-4 py-2 bg-blue-50 text-custom-blue rounded-md mr-3 text-sm font-medium hover:bg-blue-100 transition-colors"
                                            onClick={() => setViewClass(studentClass)}
                                        >
                                            View details
                                        </button>
                                        
                                        <div className="relative">
                                            <HiOutlineDotsVertical 
                                                className="cursor-pointer p-1 hover:bg-gray-100 rounded-full" 
                                                color='#4B5563' 
                                                size={24} 
                                                onClick={() => setToggleMenu((prev) => ({
                                                    state: prev.id === studentClass.id ? !prev.state : true, 
                                                    id: studentClass.id
                                                }))}
                                            />
                                            
                                            {toggleMenu.id === studentClass.id && toggleMenu.state && (
                                                <div 
                                                    ref={menuRef} 
                                                    className="absolute top-full right-0 flex flex-col items-center bg-white rounded-lg w-40 gap-1 z-10 py-2 shadow-lg border border-gray-200 mt-1 animate-fadeIn"
                                                >
                                                    <div 
                                                        className="w-[90%] p-2 text-gray-700 hover:bg-custom-blue hover:text-white rounded-md cursor-pointer text-sm transition-colors"
                                                        onClick={() => setViewClass(studentClass)}
                                                    >
                                                        View details
                                                    </div>
                                                    <div 
                                                        className="w-[90%] p-2 text-gray-700 hover:bg-custom-blue hover:text-white rounded-md cursor-pointer text-sm transition-colors"
                                                        onClick={() => setSelectedClass(studentClass)}
                                                    >
                                                        Edit class
                                                    </div>
                                                    <div 
                                                        className="w-[90%] p-2 text-gray-700 hover:bg-custom-blue hover:text-white rounded-md cursor-pointer text-sm transition-colors"
                                                        onClick={() => setToggleDeleteOverlay({state:true, name:studentClass.name, id: studentClass.id})}
                                                    >
                                                        Delete class
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
                                    <RiBookMarkedLine color="#4F46E5" size={32}/>
                                </div>
                                <h2 className="text-gray-500 text-lg">No classes found</h2>
                                <p className="text-gray-400 mt-2">
                                    Create your first class by clicking the 'New Class' button
                                </p>
                            </div>
                        )
                    ) : (
                        <AssignmentSkeleton number={5} />
                    )}
                </div>
            </div>

            {toggleCreateClass && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[40rem] max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 animate-fadeIn">
                        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                            <h2 className="font-semibold text-lg text-custom-blue">Create Class</h2>
                            <IoClose onClick={() => {setToggleCreateClass(false);formik.resetForm()}} size={25} className="cursor-pointer hover:text-custom-blue transition-colors" />
                        </div>
                        <form onSubmit={formik.handleSubmit} className="w-[90%] flex flex-col items-center gap-6 py-6">
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-medium text-gray-700">Class Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter class name"
                                    className={`border ${formik.touched.name && formik.errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100'} 
                                    outline-none rounded-lg w-full h-11 px-3 bg-gray-50 focus:bg-white
                                    transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                    {...formik.getFieldProps('name')}
                                />
                                {formik.touched.name && formik.errors.name && <div className="text-red-500 text-sm">{formik.errors.name}</div>}
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-medium text-gray-700">Description</label>
                                <textarea 
                                    placeholder="Enter class description"
                                    className={`w-full h-36 resize-none border ${formik.touched.description && formik.errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100'} 
                                    outline-none rounded-lg p-3 bg-gray-50 focus:bg-white
                                    transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                    {...formik.getFieldProps('description')}
                                ></textarea>
                                {formik.touched.description && formik.errors.description && <div className="text-red-500 text-sm">{formik.errors.description}</div>}
                            </div>
                            <div className="flex flex-col w-full gap-4">
                                <label className="font-medium text-gray-700">Members</label>
                                
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Students</h3>
                                    <div className="flex flex-wrap gap-3 mb-5">
                                        <select 
                                            className="border border-gray-300 outline-none rounded-md px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-100 focus:border-custom-blue transition-all"
                                            onChange={(e) => setParams((prev) => ({...prev, startYear: e.target.value}))}
                                            value={params.startYear}
                                        >
                                            <option value=''>Start Year</option>
                                            <option value='2022'>2022</option>
                                            <option value='2023'>2023</option>
                                            <option value='2024'>2024</option>
                                            <option value='2025'>2025</option>
                                        </select>
                                        <select 
                                            className="border border-gray-300 outline-none rounded-md px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-100 focus:border-custom-blue transition-all"
                                            onChange={(e) => setParams((prev) => ({...prev, program: e.target.value}))}
                                            value={params.program}
                                        >
                                            <option value=''>Program</option>
                                            <option value='BSE'>Software Engineering</option>
                                            <option value='BEL'>Entrepreneurial Leadership</option>
                                        </select>
                                        <select 
                                            className="border border-gray-300 outline-none rounded-md px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-100 focus:border-custom-blue transition-all"
                                            onChange={(e) => setParams((prev) => ({...prev, intake: e.target.value}))}
                                            value={params.intake}
                                        >
                                            <option value=''>Intake</option>
                                            <option value='January'>January</option>
                                            <option value='May'>May</option>
                                            <option value='September'>September</option>
                                        </select>
                                    </div>
                                    
                                    <div className="max-h-64 overflow-y-auto pr-2 border-t border-gray-200 pt-3">
                                        {!userFetching ? (
                                            users.length > 0 ? (
                                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {users.map(user => (
                                                        <div key={user.id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100">
                                                            <input 
                                                                type="checkbox" 
                                                                id={`user-${user.id}`}
                                                                value={user.id} 
                                                                checked={formik.values.userIds.includes(user.id)} 
                                                                onChange={() => handleCheckBoxChange(user.id, 'create')}
                                                                className="rounded text-custom-blue focus:ring-custom-blue"
                                                            />
                                                            <label htmlFor={`user-${user.id}`} className="text-sm cursor-pointer">{user.fullName}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center text-gray-500 py-4">No students found with selected filters</p>
                                            )
                                        ) : (
                                            <div className="flex justify-center py-4">
                                                <ClipLoader size={20} color="#586AEA"/>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button 
                                type='submit' 
                                className='flex items-center justify-center w-full h-12 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white font-medium rounded-md mt-6 shadow-md transition-all duration-200'
                            >
                                {loading ? <ClipLoader size={24} color='white'/> : 'Create Class'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {viewClass && toggleViewOverlay && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[40rem] max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all duration-300 animate-fadeIn">
                        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                            <h2 className="font-semibold text-lg text-custom-blue">Class Details</h2>
                            <IoClose onClick={() => {setToggleViewOverlay(false);setViewClass(null)}} size={25} className="cursor-pointer hover:text-custom-blue transition-colors" />
                        </div>
                        <div className="w-full flex flex-col gap-8 py-8 px-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-lg bg-blue-50">
                                    <RiBookMarkedLine color="#4F46E5" size={28}/>
                                </div>
                                <div>
                                    <h2 className="text-gray-800 text-xl font-semibold">{viewClass.name}</h2>
                                    <span className="text-gray-500 flex items-center gap-1 mt-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        {viewClass.students.length} {viewClass.students.length === 1 ? 'student' : 'students'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="w-full border-t border-gray-200 pt-6">
                                <h2 className="font-semibold text-lg text-gray-800 mb-3">Description</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {viewClass.description || "No description provided"}
                                </p>
                            </div>
                            
                            <div className="w-full border-t border-gray-200 pt-6">
                                <h2 className="font-semibold text-lg text-gray-800 mb-3">Students</h2>
                                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 max-h-48 overflow-y-auto">
                                    {viewClass.students.length > 0 ? (
                                        <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-2">
                                            {viewClass.students.map(student => (
                                                <div key={student.id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-600 font-medium">
                                                        {student.fullName.charAt(0)}
                                                    </div>
                                                    <span className="text-sm text-gray-700">{student.fullName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">No students in this class</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-end w-full pt-4 border-t border-gray-200">
                                <button 
                                    onClick={() => {setToggleViewOverlay(false); setSelectedClass(viewClass);}}
                                    className="px-6 py-2.5 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white rounded-md shadow-md transition-all duration-200 font-medium"
                                >
                                    Edit Class
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedClass && toggleEditOverlay && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[40rem] max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 animate-fadeIn">
                        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                            <h2 className="font-semibold text-lg text-custom-blue">Edit Class</h2>
                            <IoClose 
                                onClick={() => {setToggleEditOverlay(false); setSelectedClass(null); updateFormik.resetForm()}} 
                                size={25} 
                                className="cursor-pointer hover:text-custom-blue transition-colors"
                            />
                        </div>
                        <form onSubmit={updateFormik.handleSubmit} className="w-[90%] flex flex-col items-center gap-6 py-6">
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-medium text-gray-700">Class Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter class name"
                                    className={`border ${updateFormik.touched.name && updateFormik.errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100'} 
                                    outline-none rounded-lg w-full h-11 px-3 bg-gray-50 focus:bg-white
                                    transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                    {...updateFormik.getFieldProps('name')}
                                />
                                {updateFormik.touched.name && updateFormik.errors.name && 
                                    <div className="text-red-500 text-sm">{updateFormik.errors.name}</div>}
                            </div>
                            
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-medium text-gray-700">Description</label>
                                <textarea 
                                    placeholder="Enter class description"
                                    className={`w-full h-36 resize-none border ${updateFormik.touched.description && updateFormik.errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100'} 
                                    outline-none rounded-lg p-3 bg-gray-50 focus:bg-white
                                    transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                    {...updateFormik.getFieldProps('description')}
                                ></textarea>
                                {updateFormik.touched.description && updateFormik.errors.description && 
                                    <div className="text-red-500 text-sm">{updateFormik.errors.description}</div>}
                            </div>
                            
                            <div className="flex flex-col w-full gap-4">
                                <label className="font-medium text-gray-700">Members</label>
                                
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Students</h3>
                                    <div className="flex flex-wrap gap-3 mb-5">
                                        <select 
                                            className="border border-gray-300 outline-none rounded-md px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-100 focus:border-custom-blue transition-all"
                                            onChange={(e) => setParams((prev) => ({...prev, startYear: e.target.value}))}
                                            value={params.startYear}
                                        >
                                            <option value=''>Start Year</option>
                                            <option value='2022'>2022</option>
                                            <option value='2023'>2023</option>
                                            <option value='2024'>2024</option>
                                            <option value='2025'>2025</option>
                                        </select>
                                        <select 
                                            className="border border-gray-300 outline-none rounded-md px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-100 focus:border-custom-blue transition-all"
                                            onChange={(e) => setParams((prev) => ({...prev, program: e.target.value}))}
                                            value={params.program}
                                        >
                                            <option value=''>Program</option>
                                            <option value='BSE'>Software Engineering</option>
                                            <option value='BEL'>Entrepreneurial Leadership</option>
                                        </select>
                                        <select 
                                            className="border border-gray-300 outline-none rounded-md px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-100 focus:border-custom-blue transition-all"
                                            onChange={(e) => setParams((prev) => ({...prev, intake: e.target.value}))}
                                            value={params.intake}
                                        >
                                            <option value=''>Intake</option>
                                            <option value='January'>January</option>
                                            <option value='May'>May</option>
                                            <option value='September'>September</option>
                                        </select>
                                    </div>
                                    
                                    <div className="max-h-64 overflow-y-auto pr-2 border-t border-gray-200 pt-3">
                                        {!userFetching ? (
                                            users.length > 0 ? (
                                                <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {users.map(user => (
                                                        <div key={user.id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100">
                                                            <input 
                                                                type="checkbox" 
                                                                id={`edit-user-${user.id}`}
                                                                value={user.id} 
                                                                checked={updateFormik.values.userIds.includes(user.id)} 
                                                                onChange={() => handleCheckBoxChange(user.id, 'edit')}
                                                                className="rounded text-custom-blue focus:ring-custom-blue"
                                                            />
                                                            <label htmlFor={`edit-user-${user.id}`} className="text-sm cursor-pointer">{user.fullName}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center text-gray-500 py-4">No students found with selected filters</p>
                                            )
                                        ) : (
                                            <div className="flex justify-center py-4">
                                                <ClipLoader size={20} color="#586AEA"/>
                                            </div>
                                        )}
                                    </div>
                                </div>
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

            {toggleDeleteOverlay.state && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[30rem] shadow-2xl animate-fadeIn">
                        <div className="flex items-center w-full px-6 py-4 border-b border-gray-200">
                            <h2 className="font-semibold text-lg text-red-600">Delete Class</h2>
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
                                Are you sure you want to delete the class <span className="font-semibold">"{toggleDeleteOverlay.name}"</span>?
                                <br />
                                <span className="text-sm text-gray-500">This action cannot be undone and will remove all associated assignments.</span>
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <button 
                                    onClick={() => setToggleDeleteOverlay({state:false, id:'', name:''})}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => dispatch(deleteClass(toggleDeleteOverlay.id))}
                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-sm"
                                >
                                    {loading ? <ClipLoader size={20} color="white"/> : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default Classes;