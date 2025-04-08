import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { GoPlus } from "react-icons/go";
import { MdOutlineDateRange } from "react-icons/md";
import { createTask, deleteTask, getTasksByGroup, updateTask } from "../../redux/actions/taskActions";
import moment from 'moment-timezone'
import { useFormik } from "formik";
import { taskSchema, updateTaskSchema } from "../../validationSchema/taskSchema";
import { IoClose } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { CreateTaskFormData, Task } from "../../types/Task";
import TaskCard from "../../components/TaskCard";
import { formatDate, getStatusClass, getPriorityClass } from "../../utils/taskUtils";
import { addToTempStorage, resetStatus } from "../../redux/slices/taskSlice";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";


const Tasks = () => {
    const dispatch = useAppDispatch()
    const {isSideMenuExpanded} = useAppSelector(state => state.appSetting)
    const {tasks, loading, status} = useAppSelector(state => state.task)
    const {group} = useAppSelector(state => state.group)
    const {user} = useAppSelector(state => state.user)
    const [toggleCreateTask, setToggleCreateTask] = useState(false)
    const [toggleEditTask, setToggleEditTask] = useState(false)
    const [toggleViewTask, setToggleViewTask] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [viewTask, setViewTask] = useState<Task | null>(null)
    const [toggleMenu, setToggleMenu] = useState({state:false, id:''})
    const [toggleDeleteOverlay, setToggleDeleteOverlay] = useState({state:false, name:'', id:''})


    const formik = useFormik({
        initialValues:{
            description:'',
            status: 'to_do',
            priorityLevel: "low",
            userId: user!.id,
            dueDate: '',
            groupId: group?.id
        } as CreateTaskFormData,
        onSubmit: (formData) => {
            dispatch(createTask({
                ...formData,
                dueDate:  moment.tz(formData.dueDate, "YYYY-MM-DDTHH:mm", "Africa/Kigali").utc().toISOString()
            }))
        },
        validationSchema: taskSchema,
        enableReinitialize: true
    })

    const updateFormik = useFormik({
        initialValues:{
            description: selectedTask?.description,
            status: selectedTask?.status,
            priorityLevel: selectedTask?.priorityLevel,
            userId: selectedTask?.user.id,
            dueDate: selectedTask?.dueDate ? moment(selectedTask.dueDate).format('YYYY-MM-DDTHH:mm') : '',
            groupId: group?.id
        },
        onSubmit: (formData) => {
            dispatch(updateTask({id: selectedTask!.id, formData:{
                ...formData,
                dueDate:  moment.tz(formData.dueDate, "YYYY-MM-DDTHH:mm", "Africa/Kigali").utc().toISOString()
            }}))
        },
        validationSchema: updateTaskSchema,
        enableReinitialize: true
    })

    useEffect(() => {
        if(group){
            dispatch(getTasksByGroup(group.id))
        }
    },[group])

    useEffect(() => {
        if(selectedTask){
            setToggleEditTask(true)
        }
    },[selectedTask])

    useEffect(() => {
        if(viewTask){
            setToggleViewTask(true)
        }
    },[viewTask])

    useEffect(() => {
        if(status === 'successful'){
            if(toggleEditTask){
                setToggleEditTask(false)
                setSelectedTask(null)
                updateFormik.resetForm()
            }
            
            if(toggleCreateTask){
                setToggleCreateTask(false)
                formik.resetForm()
            }

            if(toggleDeleteOverlay.state){
                setToggleDeleteOverlay({state:false, id:'', name:''})
            }

            dispatch(resetStatus())
            setToggleMenu({state:false, id:''})
        }
    },[status])

    const handleDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;

        const sourceList = source.droppableId
        const destinationList = destination.droppableId as 'to_do'|'in_progress'|'completed'|'stuck'
        const task = tasks.find(theTask => theTask.id === draggableId)

        if(task!.user.id !== user!.id) return

        if(sourceList !== destinationList){
            dispatch(addToTempStorage({
                old: task,
                new: {...task, status: destinationList}
            }))
            dispatch(updateTask({
                id: task!.id,
                formData: {
                    description: task!.description,
                    status: destinationList,
                    priorityLevel: task!.priorityLevel,
                    userId: task!.user.id,
                    dueDate: task!.dueDate
                }    
            }))
        }
    };
    

    return (
        <div className={`flex ${isSideMenuExpanded?'lg:w-[72%]':'lg:w-[87%]'} xs:w-full h-[calc(100vh-4rem)] flex-col items-center bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)] relative overflow-x-hidden`}>
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>
            
            <div className="w-[94%] flex xs:flex-col lg:flex-row xs:items-start lg:items-center xs:gap-4 lg:gap-0 justify-between bg-white rounded-xl shadow-md p-6 mt-8 z-10">
                <h2 className="text-custom-textBlack text-lg font-semibold">{group?.name} Board</h2>
                <button className="flex items-center justify-center px-4 py-2 rounded-md gap-2 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700" onClick={() => setToggleCreateTask(true)}>
                    <GoPlus color="white" size={20}/>
                    <h2 className="text-white">New Task</h2>
                </button>
            </div>

            {toggleCreateTask && <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                <div className="flex flex-col items-center rounded-lg bg-white xs:w-[90%] lg:w-[30rem] max-h-full overflow-y-auto noscroll">
                    <div className="flex items-center justify-between w-full border-b border-[lightgray] py-2 px-4">
                        <h2 className="font-semibold text-lg">Create Task</h2>
                        <IoClose onClick={() => {setToggleCreateTask(false);formik.resetForm()}} size={25} color="black" className="cursor-pointer"/>
                    </div>
                    <form onSubmit={formik.handleSubmit} className="w-[90%] flex flex-col items-center gap-6 py-6">
                        <div className="flex flex-col gap-1 w-full">
                            <label className="m-0 text-sm">Description</label>
                            <textarea 
                                placeholder="Enter your task description here"
                                className={`w-full h-32 resize-none border ${formik.touched.description && formik.errors.description ? 'border-red-500': 'border-borderGrey'} outline-none rounded-md p-2 bg-[#f2f2f2] font-normal`}
                                {...formik.getFieldProps('description')}
                            ></textarea>
                            {formik.touched.description && formik.errors.description && <div className="text-red-500 text-sm">{formik.errors.description}</div>}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="m-0 text-sm">Status</label>
                            <select 
                                className={`border ${formik.touched.status && formik.errors.status ? 'border-red-500': 'border-custom-borderGrey'} outline-none rounded-md w-full h-10 bg-[#f2f2f2]`}
                                {...formik.getFieldProps('status')}
                                >
                                <option value=''>Select task status</option>
                                <option value='to_do'>To do</option>
                                <option value='in_progress'>In Progress</option>
                                <option value='completed'>Completed</option>
                                <option value='stuck'>Stuck</option>
                            </select>
                            {formik.touched.status && formik.errors.status && <div className="text-red-500 text-sm">{formik.errors.status}</div>}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="m-0 text-sm">Priority Level</label>
                            <select 
                                className={`border ${formik.touched.status && formik.errors.status ? 'border-red-500': 'border-custom-borderGrey'} outline-none rounded-md w-full h-10 bg-[#f2f2f2]`}
                                {...formik.getFieldProps('priorityLevel')}
                                >
                                <option value=''>Select task priority level</option>
                                <option value='low'>Low</option>
                                <option value='medium'>Medium</option>
                                <option value='high'>High</option>
                            </select>
                            {formik.touched.priorityLevel && formik.errors.priorityLevel && <div className="text-red-500 text-sm">{formik.errors.priorityLevel}</div>}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="m-0 text-sm">Assign to</label>
                            <select 
                                className={`border ${formik.touched.status && formik.errors.status ? 'border-red-500': 'border-custom-borderGrey'} outline-none rounded-md w-full h-10 bg-[#f2f2f2]`}
                                {...formik.getFieldProps('userId')}
                                >
                                <option value=''>Select user</option>
                                <option value={user!.id}>{user!.fullName}</option>
                                {/* {group?.users?.map(user => (
                                    <option value={user.id}>{user.fullName}</option>
                                ))} */}
                            </select>
                            {formik.touched.userId && formik.errors.userId && <div className="text-red-500 text-sm">{formik.errors.userId}</div>}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="m-0 text-sm">Due Date</label>
                            <input 
                                type="datetime-local" 
                                className={`border ${formik.touched.dueDate && formik.errors.dueDate ? 'border-red-500': 'border-borderGrey'} outline-none rounded-md w-full h-10 px-2 bg-[#f2f2f2]`}
                                {...formik.getFieldProps('dueDate')}
                            />
                            {formik.touched.dueDate && formik.errors.dueDate && <div className="text-red-500 text-sm">{formik.errors.dueDate}</div>}
                        </div>
                        <button type='submit' className='flex items-center justify-center w-[50%] h-10 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white rounded-md mt-8'>{loading ? <ClipLoader size={24} color='white'/>: 'Submit'}</button>
                    </form>
                </div>
            </div>}

            {viewTask && toggleViewTask && <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                <div className="flex flex-col items-center rounded-lg bg-white xs:w-[90%] lg:w-[30rem] max-h-full overflow-y-auto noscroll">
                    <div className="flex items-center justify-between w-full border-b border-[lightgray] py-2 px-4">
                        <h2 className="font-semibold text-lg">Task Details</h2>
                        <IoClose onClick={() => {setToggleViewTask(false);setViewTask(null)}} size={25} color="black" className="cursor-pointer"/>
                    </div>
                    <div className="w-[90%] flex flex-col gap-8 py-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 w-full">
                                <h2 className="font-semibold">Description</h2>
                                <p>{viewTask.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <MdOutlineDateRange color="#64748b" size={20}/>
                                <h2 className="text-custom-textGrey text-sm">{formatDate(viewTask.dueDate, "MMM D, [at] h:mm A")}</h2>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <h2 className="font-semibold">Status:</h2>
                                <button className={`rounded-full ${getStatusClass(viewTask.status)} text-xs px-3 h-6 self-start`}>
                                    {viewTask.status === 'to_do' ? 'To do':viewTask.status === 'in_progress'?'In progress':'completed'}
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <h2 className="font-semibold">Priority Level:</h2>
                                <button className={`rounded-full ${getPriorityClass(viewTask.priorityLevel)} text-xs px-3 h-6 self-start`}>
                                    {viewTask.priorityLevel} priority
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <h2 className="font-semibold">Assigned to:</h2>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                        <img src={viewTask.user.profileImg} className="w-full h-full object-cover"/>
                                    </div>
                                    <h2 className="text-sm">{viewTask.user.fullName}</h2>  
                                </div>
                            </div>
                        </div>   
                    </div>
                </div>
            </div>}

            {selectedTask && toggleEditTask && <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-20 bg-black bg-opacity-50">
                <div className="flex flex-col items-center rounded-lg bg-white xs:w-[90%] lg:w-[30rem] max-h-full overflow-y-auto noscroll">
                    <div className="flex items-center justify-between w-full border-b border-[lightgray] py-2 px-4">
                        <h2 className="font-semibold text-lg">Edit Task</h2>
                        <IoClose onClick={() => {setToggleEditTask(false);setSelectedTask(null)}} size={25} color="black" className="cursor-pointer"/>
                    </div>
                    <form onSubmit={updateFormik.handleSubmit} className="w-[90%] flex flex-col items-center gap-6 py-6">
                        <div className="flex flex-col gap-1 w-full">
                            <label className="m-0 text-sm">Description</label>
                            <textarea 
                                placeholder="Enter your task description here"
                                className={`w-full h-32 resize-none border ${updateFormik.touched.description && updateFormik.errors.description ? 'border-red-500': 'border-borderGrey'} outline-none rounded-md p-2 bg-[#f2f2f2] font-normal`}
                                {...updateFormik.getFieldProps('description')}
                            ></textarea>
                            {updateFormik.touched.description && updateFormik.errors.description && <div className="text-red-500 text-sm">{updateFormik.errors.description}</div>}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="m-0 text-sm">Status</label>
                            <select 
                                className={`border ${updateFormik.touched.status && updateFormik.errors.status ? 'border-red-500': 'border-custom-borderGrey'} outline-none rounded-md w-full h-10 bg-[#f2f2f2]`}
                                {...updateFormik.getFieldProps('status')}
                                >
                                <option defaultChecked value=''>Select task status</option>
                                <option value='to_do'>To do</option>
                                <option value='in_progress'>In Progress</option>
                                <option value='completed'>Completed</option>
                                <option value='stuck'>Stuck</option>
                            </select>
                            {updateFormik.touched.status && updateFormik.errors.status && <div className="text-red-500 text-sm">{updateFormik.errors.status}</div>}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="m-0 text-sm">Priority Level</label>
                            <select 
                                className={`border ${updateFormik.touched.status && updateFormik.errors.status ? 'border-red-500': 'border-custom-borderGrey'} outline-none rounded-md w-full h-10 bg-[#f2f2f2]`}
                                {...updateFormik.getFieldProps('priorityLevel')}
                                >
                                <option defaultChecked value=''>Select task priority level</option>
                                <option value='low'>Low</option>
                                <option value='medium'>Medium</option>
                                <option value='high'>High</option>
                            </select>
                            {formik.touched.priorityLevel && formik.errors.priorityLevel && <div className="text-red-500 text-sm">{updateFormik.errors.priorityLevel}</div>}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="m-0 text-sm">Assign to</label>
                            <select 
                                className={`border ${updateFormik.touched.status && updateFormik.errors.status ? 'border-red-500': 'border-custom-borderGrey'} outline-none rounded-md w-full h-10 bg-[#f2f2f2]`}
                                {...updateFormik.getFieldProps('userId')}
                                >
                                <option defaultChecked value=''>Select user</option>
                                <option value={user!.id}>{user!.fullName}</option>
                                {/* {group?.users?.map(user => (
                                    <option value={user.id}>{user.fullName}</option>
                                ))} */}
                            </select>
                            {updateFormik.touched.userId && updateFormik.errors.userId && <div className="text-red-500 text-sm">{updateFormik.errors.userId}</div>}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="m-0 text-sm">Due Date</label>
                            <input 
                                type="datetime-local" 
                                className={`border ${updateFormik.touched.dueDate && updateFormik.errors.dueDate ? 'border-red-500': 'border-borderGrey'} outline-none rounded-md w-full h-10 px-2 bg-[#f2f2f2]`}
                                {...updateFormik.getFieldProps('dueDate')}
                            />
                            {updateFormik.touched.dueDate && updateFormik.errors.dueDate && <div className="text-red-500 text-sm">{updateFormik.errors.dueDate}</div>}
                        </div>
                        <button type='submit' className='flex items-center justify-center w-[50%] h-10 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white rounded-md mt-8'>{loading ? <ClipLoader size={24} color='white'/>: 'Submit'}</button>
                    </form>
                </div>
            </div>}

            { toggleDeleteOverlay.state && <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-30 bg-black bg-opacity-50">
                <div className="flex flex-col items-center justify-between rounded-lg bg-white xs:w-[90%] lg:w-[30rem] h-48">
                    <div className="flex items-center w-full pl-4 py-3 border-b border-gray-400 text-custom-textBlue font-semibold text-lg">
                        Delete Task?
                    </div>
                    <div className="flex-1 flex flex-col w-full items-start justify-between py-6 px-4">
                        <h2 className="text-left m-0">This will delete the task titled <span className="font-semibold">"{toggleDeleteOverlay.name}"</span></h2>
                        <div className="w-full flex items-center justify-end gap-6">
                            <button className="w-20 h-10 flex items-center justify-center bg-transparent border border-black rounded-md" onClick={() => setToggleDeleteOverlay({state:false, id:'', name:''})}>Cancel</button>
                            <button className="w-20 h-10 flex items-center justify-center text-white bg-red-500 rounded-md" onClick={() => dispatch(deleteTask(toggleDeleteOverlay.id))}>{loading ? <ClipLoader size={20} color="white"/> : 'Delete'}</button>
                        </div>
                    </div>
                </div>
            </div>}

            <div className="w-full h-[calc(100vh-9rem)] p-8 flex gap-12 overflow-x-scroll">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="to_do">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps} 
                                ref={provided.innerRef} 
                                className="flex flex-col items-center w-[25rem] min-h-20 max-h-full bg-[#f2f2f2] rounded-lg px-4 pt-3 pb-6 border border-custom-borderGrey flex-none"
                                >
                                <h2 className="text-custom-textGrey font-semibold self-start">TODO</h2>
                                <div className="flex flex-col xs:max-h-[40rem] lg:max-h-[30rem] gap-4 mt-4 overflow-y-auto noscroll w-full">
                                    {tasks.map((task, i) => {
                                        if(task.status === 'to_do'){
                                            return (
                                                <TaskCard index={i} task={task} toggleMenu={toggleMenu} setToggleMenu={setToggleMenu} setViewTask={setViewTask} setSelectedTask={setSelectedTask} setToggleDeleteOverlay={setToggleDeleteOverlay}/> 
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        )}
                    </Droppable>

                    <Droppable droppableId="in_progress">
                        {(provided) => (
                            <div 
                                className="flex flex-col items-center w-[25rem] min-h-20 max-h-full bg-[#f2f2f2] rounded-lg px-4 pt-3 pb-6 border border-custom-borderGrey flex-none"
                                {...provided.droppableProps} 
                                ref={provided.innerRef} 
                                >
                                <h2 className="text-custom-textGrey font-semibold self-start">IN PROGRESS</h2>
                                <div className="flex flex-col xs:max-h-[40rem] lg:max-h-[30rem] gap-4 mt-4 overflow-y-auto noscroll w-full">
                                    {tasks.map((task, i) => {
                                        if(task.status === 'in_progress'){
                                            return (
                                                <TaskCard index={i} task={task} toggleMenu={toggleMenu} setToggleMenu={setToggleMenu} setViewTask={setViewTask} setSelectedTask={setSelectedTask} setToggleDeleteOverlay={setToggleDeleteOverlay}/>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        )}
                    </Droppable>

                    <Droppable droppableId="completed">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps} 
                                ref={provided.innerRef} 
                                className="flex flex-col items-center w-[25rem] min-h-20 max-h-full bg-[#f2f2f2] rounded-lg px-4 pt-3 pb-6 border border-custom-borderGrey flex-none"
                            >
                                <h2 className="text-custom-textGrey font-semibold self-start">COMPLETED</h2>
                                <div className="flex flex-col xs:max-h-[40rem] lg:max-h-[30rem] gap-4 mt-4 overflow-y-auto noscroll w-full">
                                    {tasks.map((task, i) => {
                                        if(task.status === 'completed'){
                                            return (
                                                <TaskCard index={i} task={task} toggleMenu={toggleMenu} setToggleMenu={setToggleMenu} setViewTask={setViewTask} setSelectedTask={setSelectedTask} setToggleDeleteOverlay={setToggleDeleteOverlay}/>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        )}
                    </Droppable>

                    <Droppable droppableId="stuck">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps} 
                                ref={provided.innerRef} 
                                className="flex flex-col items-center w-[25rem] min-h-20 max-h-full bg-[#f2f2f2] rounded-lg px-4 pt-3 pb-6 border border-custom-borderGrey flex-none"
                            >
                                <h2 className="text-custom-textGrey font-semibold self-start">STUCK</h2>
                                <div className="flex flex-col xs:max-h-[40rem] lg:max-h-[30rem] gap-4 mt-4 overflow-y-auto noscroll w-full">
                                    {tasks.map((task, i) => {
                                        if(task.status === 'stuck'){
                                            return (
                                                <TaskCard index={i} task={task} toggleMenu={toggleMenu} setToggleMenu={setToggleMenu} setViewTask={setViewTask} setSelectedTask={setSelectedTask} setToggleDeleteOverlay={setToggleDeleteOverlay}/>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>   
    );
}
 
export default Tasks;