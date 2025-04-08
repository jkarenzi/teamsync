import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaCamera, FaKey, FaUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { changePasswordSchema, editProfileSchema } from "../../validationSchema/authSchema";
import ClipLoader from "react-spinners/ClipLoader";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { changePassword, editProfile } from "../../redux/actions/authActions";
import { resetChangePassState } from "../../redux/slices/userSlice";
import { useUploadImage } from "../../services/upload";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";


const Settings = () => {
    const [togglePasswordOverlay, setTogglePasswordOverlay] = useState(false)
    const {isChangingPass, changePassState, user, loading} = useAppSelector(state => state.user)
    const [toggleImageOverlay, setToggleImageOverlay] = useState(false)
    const [imageProgress, setImageProgress] = useState<number|null>(null)
    const [imageLoading, setImageLoading] = useState(false)
    const dispatch = useAppDispatch()

    const changePasswordForm = useFormik({
        initialValues: {
            oldPassword:'',
            newPassword:'',
            confirmPassword:''
        },
        onSubmit: (formData) => {
            dispatch(changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            }))
        },
        validationSchema: changePasswordSchema
    })

    useEffect(() => {
        if(changePassState === 'successful'){
            setTogglePasswordOverlay(false)
            changePasswordForm.resetForm()
            dispatch(resetChangePassState())
        }
    },[changePassState])

    const formik = useFormik({
        initialValues:{
            fullName: user!.fullName,
            profileImg: user!.profileImg
        },
        onSubmit: (formData) => {
            console.log(formData)
            dispatch(editProfile(formData))
        },
        validationSchema: editProfileSchema
    })

    const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const {url} = await useUploadImage(e.target.files[0], setImageProgress, setImageLoading)
    
            if(url){
                formik.setFieldValue('profileImg', url, true)  
                setToggleImageOverlay(false)          
            }
            setImageProgress(null)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    
    const handleImageDrop = async(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const {url} = await useUploadImage(droppedFile, setImageProgress, setImageLoading)
    
            if(url){
                formik.setFieldValue('profileImg', url, true)
                setToggleImageOverlay(false)
            }
        }
    };

    return (
        <div className="flex xs:w-full lg:w-[92%] h-[calc(100vh-4rem)] flex-col items-center overflow-y-auto overflow-x-hidden bg-gradient-to-br from-white to-[rgba(88,106,234,0.08)] py-16 relative">
            <div className="absolute w-96 h-96 rounded-full bg-custom-blue opacity-5 -top-48 -right-48"></div>
            <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-5 bottom-20 -left-40"></div>

            <div className="xs:w-[90%] lg:w-[80%] bg-white rounded-xl shadow-sm border border-gray-100 z-10">
                <div className="bg-gradient-to-r from-custom-blue to-indigo-600 px-8 py-6 rounded-t-xl">
                    <h1 className="text-2xl font-bold text-white">Account Settings</h1>
                    <p className="text-white text-opacity-80 mt-1">Manage your profile and account preferences</p>
                </div>

                <div className="p-8">
                    <div className="flex xs:flex-col lg:flex-row xs:items-center lg:items-start gap-12">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="w-40 h-40 overflow-hidden rounded-full border-4 border-white shadow-md bg-gray-50">
                                    {formik.values.profileImg ? (
                                        <img src={formik.values.profileImg} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <FaUser size={60} className="text-gray-300" />
                                        </div>
                                    )}
                                </div>
                                <button 
                                    className="absolute right-0 bottom-0 flex items-center justify-center rounded-full bg-custom-blue p-3 shadow-lg hover:bg-blue-700 transition-colors duration-200"
                                    onClick={() => setToggleImageOverlay(true)}
                                    aria-label="Change profile picture"
                                >
                                    <FaCamera color="white" size={16} />
                                </button>
                            </div>
                            <h2 className="mt-4 text-lg font-medium text-gray-800">{user?.fullName}</h2>
                            <p className="text-gray-500">{user?.email}</p>
                            
                            <button 
                                className="mt-6 flex items-center gap-2 px-4 py-2 text-custom-blue border border-custom-blue rounded-md hover:bg-blue-50 transition-colors"
                                onClick={() => setTogglePasswordOverlay(true)}
                            >
                                <FaKey size={14} />
                                Change Password
                            </button>
                        </div>

                        <div className="flex-1 w-full">
                            <h2 className="text-xl font-semibold text-gray-700 mb-6">Personal Information</h2>
                            <form className="w-full flex flex-col gap-6" onSubmit={formik.handleSubmit}>
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium text-gray-700 flex items-center gap-2">
                                        <FaUser size={14} className="text-custom-blue" />
                                        Full Name
                                    </label>
                                    <input 
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className={`border ${formik.touched.fullName && formik.errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100'} 
                                        outline-none rounded-lg w-full py-3 px-4 bg-gray-50 focus:bg-white
                                        transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                        {...formik.getFieldProps('fullName')}
                                    />
                                    {formik.touched.fullName && formik.errors.fullName && 
                                        <div className="text-red-500 text-sm">{formik.errors.fullName}</div>}
                                </div>
                                <button 
                                    type='submit' 
                                    className='mt-4 flex items-center justify-center gap-2 w-40 py-3 bg-gradient-to-r from-custom-blue to-blue-600 hover:from-custom-blue hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-200'
                                >
                                    {loading ? <ClipLoader size={24} color='white'/> : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {togglePasswordOverlay && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-40 bg-black bg-opacity-50 animate-fadeIn">
                    <div className="flex flex-col rounded-lg bg-white xs:w-[90%] lg:w-[30rem] shadow-2xl transform transition-all duration-300 animate-zoomIn">
                        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                            <h2 className="font-semibold text-lg text-custom-blue flex items-center gap-2">
                                <FaKey size={16} />
                                Change Password
                            </h2>
                            <button 
                                onClick={() => setTogglePasswordOverlay(false)} 
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={changePasswordForm.handleSubmit} className="p-6 flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-gray-700">Current Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Enter your current password"
                                    className={`border ${changePasswordForm.touched.oldPassword && changePasswordForm.errors.oldPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100'} 
                                    outline-none rounded-lg w-full py-3 px-4 bg-gray-50 focus:bg-white
                                    transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                    {...changePasswordForm.getFieldProps('oldPassword')}
                                />
                                {changePasswordForm.touched.oldPassword && changePasswordForm.errors.oldPassword && 
                                    <div className="text-red-500 text-sm">{changePasswordForm.errors.oldPassword}</div>}
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-gray-700">New Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Enter your new password"
                                    className={`border ${changePasswordForm.touched.newPassword && changePasswordForm.errors.newPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100'} 
                                    outline-none rounded-lg w-full py-3 px-4 bg-gray-50 focus:bg-white
                                    transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                    {...changePasswordForm.getFieldProps('newPassword')}
                                />
                                {changePasswordForm.touched.newPassword && changePasswordForm.errors.newPassword && 
                                    <div className="text-red-500 text-sm">{changePasswordForm.errors.newPassword}</div>}
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-gray-700">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Confirm your new password"
                                    className={`border ${changePasswordForm.touched.confirmPassword && changePasswordForm.errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100'} 
                                    outline-none rounded-lg w-full py-3 px-4 bg-gray-50 focus:bg-white
                                    transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                    {...changePasswordForm.getFieldProps('confirmPassword')}
                                />
                                {changePasswordForm.touched.confirmPassword && changePasswordForm.errors.confirmPassword && 
                                    <div className="text-red-500 text-sm">{changePasswordForm.errors.confirmPassword}</div>}
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-4">
                                <button 
                                    type="button"
                                    onClick={() => setTogglePasswordOverlay(false)}
                                    className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type='submit' 
                                    className='px-5 py-2 bg-gradient-to-r from-custom-blue to-blue-600 hover:from-custom-blue hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-200'
                                >
                                    {isChangingPass ? <ClipLoader size={20} color='white'/> : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toggleImageOverlay && (
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-40 bg-black bg-opacity-50 animate-fadeIn">
                    <div className="flex flex-col rounded-lg bg-white xs:w-[90%] lg:w-[30rem] shadow-2xl transform transition-all duration-300 animate-zoomIn">
                        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                            <h2 className="font-semibold text-lg text-custom-blue flex items-center gap-2">
                                <FaCamera size={16} />
                                Update Profile Picture
                            </h2>
                            <button 
                                onClick={() => setToggleImageOverlay(false)} 
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {!formik.values.profileImg && (
                                <div className="flex flex-col items-center gap-5">
                                    <div 
                                        className="flex flex-col gap-3 items-center justify-center border-2 border-dashed border-blue-200 rounded-lg w-full h-48 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer" 
                                        onDragOver={handleDragOver} 
                                        onDrop={handleImageDrop}
                                    >
                                        {!imageLoading ? (
                                            <>
                                                <FaCamera size={30} className="text-blue-400" />
                                                <p className="text-blue-600 font-medium text-center">Drag and drop an image here</p>
                                                <p className="text-gray-500 text-sm">or</p>
                                                <div className="relative">
                                                    <button 
                                                        type="button" 
                                                        className="px-5 py-2 bg-custom-blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                                    >
                                                        Browse Files
                                                    </button>
                                                    <input
                                                        type="file" 
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-20 h-20">
                                                <CircularProgressbar
                                                    value={imageProgress || 0}
                                                    text={`${imageProgress || 0}%`}
                                                    styles={buildStyles({
                                                        pathColor: '#586AEA',
                                                        textColor: '#4B5563',
                                                        trailColor: '#E5E7EB',
                                                    })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-sm text-center">Supported formats: JPG, PNG, GIF (Max size: 5MB)</p>
                                </div>
                            )}
                            
                            {formik.values.profileImg && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <div className="w-48 h-48 rounded-full overflow-hidden mx-auto border-4 border-white shadow-md">
                                            <img src={formik.values.profileImg} className="w-full h-full object-cover" alt="Profile preview" />
                                        </div>
                                        <button 
                                            onClick={() => formik.setFieldValue('profileImg', '')}
                                            className="absolute top-2 right-2 rounded-full flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 transition-colors shadow-md"
                                            aria-label="Remove image"
                                        >
                                            <IoClose size={20} color="white" />
                                        </button>
                                    </div>
                                    
                                    <div className="flex gap-3 mt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => formik.setFieldValue('profileImg', '')}
                                            className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Change
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setToggleImageOverlay(false)}
                                            className="px-5 py-2 bg-gradient-to-r from-custom-blue to-blue-600 hover:from-custom-blue hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-200"
                                        >
                                            Use This Photo
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>    
    );
}
 
export default Settings;