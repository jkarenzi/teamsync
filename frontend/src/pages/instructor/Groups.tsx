import { GoPlus } from "react-icons/go";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { createGroup, deleteGroup, getAllGroups, getUsersWithoutGroups, updateGroup } from "../../redux/actions/groupActions";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { resetStatus } from "../../redux/slices/groupSlice";
import { useFormik } from "formik";
import { IoClose } from "react-icons/io5";
import { validationSchema } from "../../validationSchema/groupSchema";
import { Group } from "../../types/Group";
import { resetFetchStatus } from "../../redux/slices/userSlice";
import { getAssignmentById } from "../../redux/actions/assignmentActions";
import GroupSkeleton from "../../components/skeletons/GroupSkeleton";


interface IData {
    userIds: string[],
    name:string,
    assignmentId:string
}

const Groups = () => {
    const {isSideMenuExpanded} = useAppSelector(state => state.appSetting)
    const {groups, loading, status, fetching} = useAppSelector(state => state.group)
    const {assignment} = useAppSelector(state => state.assignment)
    const assFetching = useAppSelector(state => state.assignment.fetching)
    const dispatch = useAppDispatch()
    const {assignmentId} = useParams()
    const [toggleGroupDetails, setToggleGroupDetails] = useState<string[]>([])
    const [toggleDeleteGroup ,setToggleDeleteGroup] = useState({state:false, id:'', name:''})
    const [toggleMenu, setToggleMenu] = useState({state:false, id:''})
    const [toggleCreateGroup, setToggleCreateGroup] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
    const userFetching = useAppSelector(state => state.user.fetching)
    const {users, fetchStatus} = useAppSelector(state => state.user)
    const [toggleEditOverlay, setToggleEditOverlay] = useState(false)
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
        if(assignmentId){
            dispatch(getAssignmentById(assignmentId))
            dispatch(getAllGroups(assignmentId))
        }
    },[assignmentId])

    useEffect(() => {
        if(selectedGroup){
            setToggleEditOverlay(true)
        } 
    },[selectedGroup])
    
    useEffect(() => {
        if(fetchStatus === 'successful'){
            if(selectedGroup){
                updateFormik.setFieldValue('userIds', users.map(user => user.id))
            }else{
                formik.setFieldValue('userIds', users.map(user => user.id))
            }
            dispatch(resetFetchStatus())
        }
    },[fetchStatus])

    const handleToggleGroupDetails = (id:string) => {
        if(toggleGroupDetails.includes(id)){
            setToggleGroupDetails(toggleGroupDetails.filter(x => x !== id))
        }else{
            setToggleGroupDetails(prev => [...prev, id])
        }
    }

    useEffect(() => {
        if(status === 'successful'){
            if(toggleCreateGroup){
                setToggleCreateGroup(false)
                formik.resetForm()
            }

            if(toggleEditOverlay){
                setToggleEditOverlay(false)
                updateFormik.resetForm()
                setSelectedGroup(null)
            }

            if(toggleDeleteGroup.state){
                setToggleDeleteGroup({state:false, id:'', name:''})
            }
            
            setToggleMenu({state: false, id:''})
            dispatch(resetStatus())
        }
    },[status])

    const formik = useFormik({
        initialValues:{
            name:'',
            assignmentId: assignmentId,
            userIds:[]
        } as IData,
        onSubmit: (formData) => {
            dispatch(createGroup(formData))
        },
        validationSchema: validationSchema
    })

    const updateFormik = useFormik({
        initialValues:{
            name:selectedGroup?.name,
            assignmentId: assignmentId,
            userIds:selectedGroup ? selectedGroup.users.map(user => user.id) : []
        } as IData,
        onSubmit: (formData) => {
            if(selectedGroup){
                dispatch(updateGroup({id: selectedGroup.id, formData}))
            }
        },
        enableReinitialize: true,
        validationSchema: validationSchema
    })

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

    useEffect(() => {
        if(assignmentId){
            dispatch(getUsersWithoutGroups(assignmentId))
        }
    },[groups])

    return (
        <div className={`flex ${isSideMenuExpanded?'lg:w-[72%]':'lg:w-[87%]'} xs:w-full h-[calc(100vh-4rem)] flex-col items-center py-8 bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)] overflow-x-hidden relative`}>
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>
            
            {toggleDeleteGroup.state && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-30 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[30rem] shadow-2xl animate-fadeIn">
                        <div className="flex items-center w-full px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center text-red-600">
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <h2 className="font-semibold text-lg">Delete Group</h2>
                            </div>
                        </div>
                        
                        <div className="w-full px-6 py-8">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-50">
                                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                            </div>
                            
                            <p className="text-center text-gray-700 mb-6">
                                This will permanently delete <span className="font-semibold">{toggleDeleteGroup.name}</span> and all associated data:
                            </p>
                            
                            <ul className="list-disc text-gray-600 pl-6 mb-8 space-y-1">
                                <li>All tasks and assignments</li>
                                <li>Chat messages and communication history</li>
                                <li>Assessment data and reports</li>
                            </ul>
                            
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <button 
                                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setToggleDeleteGroup({state:false, id:'', name:''})}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
                                    onClick={() => dispatch(deleteGroup(toggleDeleteGroup.id))}
                                >
                                    {loading ? <ClipLoader size={20} color="white"/> : 'Delete Group'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toggleCreateGroup && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[35rem] max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 animate-fadeIn">
                        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                            <div className="flex items-center text-custom-blue">
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <h2 className="font-semibold text-lg">Create Group</h2>
                            </div>
                            <IoClose 
                                onClick={() => setToggleCreateGroup(false)} 
                                size={25} 
                                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                            />
                        </div>
                        
                        <form onSubmit={formik.handleSubmit} className="w-[90%] flex flex-col items-center gap-6 py-6">
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-medium text-gray-700">Group Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter a name for this group"
                                    className={`border ${formik.touched.name && formik.errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100'} 
                                    outline-none rounded-lg w-full h-11 px-3 bg-gray-50 focus:bg-white
                                    transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                    {...formik.getFieldProps('name')}
                                />
                                {formik.touched.name && formik.errors.name && 
                                    <div className="text-red-500 text-sm">{formik.errors.name}</div>}
                            </div>
                            
                            <div className="flex flex-col w-full gap-4">
                                <label className="font-medium text-gray-700">Members</label>
                                
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                                    {!userFetching ? (
                                        users.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                {users.map(user => (
                                                    <div key={user.id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100">
                                                        <input 
                                                            type="checkbox" 
                                                            id={`create-user-${user.id}`}
                                                            value={user.id} 
                                                            checked={formik.values.userIds.includes(user.id)} 
                                                            onChange={() => handleCheckBoxChange(user.id, 'create')}
                                                            className="rounded text-custom-blue focus:ring-custom-blue"
                                                        />
                                                        <label htmlFor={`create-user-${user.id}`} className="text-sm cursor-pointer">{user.fullName}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center text-gray-500 py-4">No users available</p>
                                        )
                                    ) : (
                                        <div className="flex justify-center py-8">
                                            <ClipLoader size={24} color="#586AEA"/>
                                        </div>
                                    )}
                                </div>
                            </div>    
                            
                            <button 
                                type='submit' 
                                className='flex items-center justify-center w-full h-12 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white font-medium rounded-lg mt-6 shadow-md transition-all duration-200'
                            >
                                {loading ? <ClipLoader size={24} color='white'/> : 'Create Group'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {selectedGroup && toggleEditOverlay && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                    <div className="flex flex-col items-center rounded-xl bg-white xs:w-[90%] lg:w-[35rem] max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 animate-fadeIn">
                        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                            <div className="flex items-center text-custom-blue">
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <h2 className="font-semibold text-lg">Edit Group</h2>
                            </div>
                            <IoClose 
                                onClick={() => {setToggleEditOverlay(false); setSelectedGroup(null); updateFormik.resetForm()}} 
                                size={25} 
                                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                            />
                        </div>
                        
                        <form onSubmit={updateFormik.handleSubmit} className="w-[90%] flex flex-col items-center gap-6 py-6">
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-medium text-gray-700">Group Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter a name for this group"
                                    className={`border ${updateFormik.touched.name && updateFormik.errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100'} 
                                    outline-none rounded-lg w-full h-11 px-3 bg-gray-50 focus:bg-white
                                    transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                    {...updateFormik.getFieldProps('name')}
                                />
                                {updateFormik.touched.name && updateFormik.errors.name && 
                                    <div className="text-red-500 text-sm">{updateFormik.errors.name}</div>}
                            </div>
                            
                            <div className="flex flex-col w-full gap-4">
                                <label className="font-medium text-gray-700">Members</label>
                                
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                                    {!assFetching ? (
                                        assignment?.studentClass.students && assignment.studentClass.students.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                {assignment.studentClass.students.map(user => (
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
                                            <p className="text-center text-gray-500 py-4">No students available in this class</p>
                                        )
                                    ) : (
                                        <div className="flex justify-center py-8">
                                            <ClipLoader size={24} color="#586AEA"/>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <button 
                                type='submit' 
                                className='flex items-center justify-center w-full h-12 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white font-medium rounded-lg mt-6 shadow-md transition-all duration-200'
                            >
                                {loading ? <ClipLoader size={24} color='white'/> : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="w-[90%] flex xs:flex-col xs:gap-4 lg:flex-row lg:gap-0 xs:items-start lg:items-center justify-between bg-white rounded-xl shadow-md p-6 z-10">
                <div className="flex flex-col">
                    <h2 className="text-gray-800 text-xl font-bold">Manage Groups</h2>
                    <p className="text-gray-500 mt-1">Create and organize student groups for collaboration</p>
                </div>
                <button 
                    className="flex items-center justify-center px-5 py-2.5 rounded-lg gap-2 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white shadow-md transition-all duration-200" 
                    onClick={() => setToggleCreateGroup(true)}
                >
                    <GoPlus color="white" size={18}/>
                    <span className="text-white font-medium">New Group</span>
                </button>
            </div>

            <div className="flex flex-col gap-8 w-[90%] mt-8">
                {!fetching && groups.length !== 0 && groups.map(group => (
                    <div key={group.id} className={`w-full flex flex-col rounded-lg shadow-md bg-white border border-gray-100 transition-all duration-200 ${toggleMenu.id === group.id && toggleMenu.state ? 'z-50':'z-10'}`}>
                        <div className="w-full flex items-center justify-between px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-custom-blue font-medium">{group.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <h2 className="font-medium text-gray-800">{group.name}</h2>
                                <div className="xs:hidden md:flex text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1">
                                    {group.users.length} {group.users.length === 1 ? 'member' : 'members'}
                                </div>
                            </div>
                            
                            <div className="relative flex items-center gap-4">
                                <button 
                                    onClick={() => handleToggleGroupDetails(group.id)}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label={toggleGroupDetails.includes(group.id) ? "Collapse details" : "Expand details"}
                                >
                                    {toggleGroupDetails.includes(group.id) ? (
                                        <IoIosArrowUp color="gray" size={20} />
                                    ) : (
                                        <IoIosArrowDown color="gray" size={20} />
                                    )}
                                </button>
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => setToggleMenu((prev) => ({state: !prev.state, id: group.id}))}
                                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label="Group options"
                                    >
                                        <HiOutlineDotsVertical color='#4B5563' size={20} />
                                    </button>
                                    
                                    {toggleMenu.id === group.id && toggleMenu.state && (
                                        <div 
                                            ref={menuRef} 
                                            className="absolute top-full right-0 flex flex-col items-center bg-white rounded-lg w-36 gap-1 z-50 py-2 shadow-lg border border-gray-200 mt-1 animate-fadeIn"
                                        >
                                            <button 
                                                className="w-[90%] p-2 text-gray-700 hover:bg-custom-blue hover:text-white rounded-md cursor-pointer text-sm transition-colors flex items-center gap-2"
                                                onClick={() => setSelectedGroup(group)}
                                            >
                                                Edit Group
                                            </button>
                                            <button 
                                                className="w-[90%] p-2 text-gray-700 hover:bg-custom-blue hover:text-white rounded-md cursor-pointer text-sm transition-colors flex items-center gap-2"
                                                onClick={() => setToggleDeleteGroup({state:true, id:group.id, name:group.name})}
                                            >
                                                Delete Group
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {toggleGroupDetails.includes(group.id) && (
                            <div className="w-full flex flex-col gap-6 py-5 px-5 border-t border-gray-100 bg-gray-50 animate-fadeIn">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-custom-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Group Members
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {group.users.map(user => (
                                            <div key={user.id} className="flex items-center gap-2 bg-white rounded-full px-3 py-1 border border-gray-200">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-custom-blue">
                                                    {user.fullName.charAt(0)}
                                                </div>
                                                <span className="text-sm text-gray-700">{user.fullName}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {group.githubRepoLink && (
                                    <div className="flex flex-col gap-2">
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
                        )}
                    </div>
                ))}
            </div>
            {fetching && <GroupSkeleton />}
            {!fetching && groups.length === 0 && <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-md w-[90%]">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                    <svg className="w-10 h-10 text-custom-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No Groups Yet</h2>
                <p className="text-gray-500 text-center max-w-md">
                    Create your first student group to help students collaborate on assignments and track their progress.
                </p>
                <button 
                    className="mt-8 flex items-center justify-center px-5 py-2.5 rounded-lg gap-2 bg-custom-blue text-white hover:bg-blue-700 transition-colors"
                    onClick={() => setToggleCreateGroup(true)}
                >
                    <GoPlus color="white" size={18}/>
                    <span className="font-medium">Create First Group</span>
                </button>
            </div>}
        </div>    
    );
}
 
export default Groups;