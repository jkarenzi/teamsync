import {useFormik} from 'formik'
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../redux/actions/authActions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { signupSchema } from '../validationSchema/authSchema';
import ClipLoader from 'react-spinners/ClipLoader';
import { useEffect } from 'react';
import { resetSignUpState } from '../redux/slices/userSlice';

const Signup = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {isSigningUp, signUpState} = useAppSelector(state => state.user)

    const formik = useFormik({
        initialValues:{
            fullName:'',
            email: '',
            password: '',
            userType: '',
            startYear:'',
            intake:'',
            program:'',
            githubUsername:''
        },
        onSubmit: (formData) => {
            dispatch(signUp(formData))
        },
        validationSchema: signupSchema
    })

    useEffect(() => {
        if(signUpState === 'successful'){
            navigate('/login')
            dispatch(resetSignUpState())
        }
    },[signUpState])
    
    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-custom-blue to-purple-600 relative overflow-hidden py-12">
            <div className="absolute w-72 h-72 rounded-full bg-white opacity-10 -top-20 -left-20"></div>
            <div className="absolute w-96 h-96 rounded-full bg-white opacity-10 -bottom-32 -right-32"></div>
            <div className="absolute w-60 h-60 rounded-full bg-white opacity-5 bottom-20 left-20"></div> 
            <div className="absolute top-8 left-8 cursor-pointer" onClick={() => navigate('/')}>
                <h1 className="text-2xl font-bold text-white">TeamSync</h1>
            </div>
            <form 
                onSubmit={formik.handleSubmit} 
                className="flex flex-col rounded-xl xs:w-[90%] md:w-[30rem] py-10 xs:px-6 md:px-8 items-center bg-white shadow-2xl z-10 relative"
            >
                <h1 className="text-3xl font-bold text-custom-blue mb-2">Create Account</h1>
                <p className="text-gray-500 mb-8 text-center">Join TeamSync and start collaborating</p>
                <div className="flex flex-col gap-2 w-full mt-2">
                    <label className="font-medium text-gray-700">Full Name</label>
                    <input 
                        type="text" 
                        placeholder="Enter your full name here" 
                        className={`border ${formik.touched.fullName && formik.errors.fullName 
                            ? 'border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:ring-blue-200'} 
                            outline-none rounded-md w-full py-3 px-4 bg-gray-50 focus:bg-white
                            transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                        {...formik.getFieldProps('fullName')}
                    />
                    {formik.touched.fullName && formik.errors.fullName && 
                        <div className="text-red-500 text-sm">{formik.errors.fullName}</div>
                    }
                </div>
                <div className="flex flex-col gap-2 w-full mt-5">
                    <label className="font-medium text-gray-700">Email</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email here" 
                        className={`border ${formik.touched.email && formik.errors.email 
                            ? 'border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:ring-blue-200'} 
                            outline-none rounded-md w-full py-3 px-4 bg-gray-50 focus:bg-white
                            transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && 
                        <div className="text-red-500 text-sm">{formik.errors.email}</div>
                    }
                </div>
                <div className="flex flex-col gap-2 w-full mt-5">
                    <label className="font-medium text-gray-700">Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter your password here"
                        className={`border ${formik.touched.password && formik.errors.password 
                            ? 'border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:ring-blue-200'} 
                            outline-none rounded-md w-full py-3 px-4 bg-gray-50 focus:bg-white
                            transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password && 
                        <div className="text-red-500 text-sm">{formik.errors.password}</div>
                    }
                </div>
                <div className="flex flex-col gap-2 w-full mt-5">
                    <label className="font-medium text-gray-700">User Type</label>
                    <select 
                        className={`border ${formik.touched.userType && formik.errors.userType 
                            ? 'border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:ring-blue-200'} 
                            outline-none rounded-md w-full py-3 px-4 bg-gray-50 focus:bg-white
                            transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                        {...formik.getFieldProps('userType')}
                    >
                        <option value=''>Select user type</option>
                        <option value='user'>Student</option>
                        <option value='instructor'>Instructor</option>
                    </select>
                    {formik.touched.userType && formik.errors.userType && 
                        <div className="text-red-500 text-sm">{formik.errors.userType}</div>
                    }
                </div>  
                {formik.values.userType === 'user' && (
                    <div className="w-full mt-6 pt-5 border-t border-gray-200">
                        <h2 className="font-semibold text-lg text-gray-700 mb-4">Student Information</h2>
                        <div className="flex flex-col gap-2 w-full mt-3">
                            <label className="font-medium text-gray-700">Program</label>
                            <select 
                                className={`border ${formik.touched.program && formik.errors.program 
                                    ? 'border-red-500 focus:ring-red-200' 
                                    : 'border-gray-300 focus:ring-blue-200'} 
                                    outline-none rounded-md w-full py-3 px-4 bg-gray-50 focus:bg-white
                                    transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                {...formik.getFieldProps('program')}
                            >
                                <option value=''>Select Program</option>
                                <option value='BSE'>Software Engineering</option>
                                <option value='BEL'>Entrepreneurial Leadership</option>
                            </select>
                            {formik.touched.program && formik.errors.program && 
                                <div className="text-red-500 text-sm">{formik.errors.program}</div>
                            }
                        </div>   
                        <div className="flex flex-col gap-2 w-full mt-5">
                            <label className="font-medium text-gray-700">Github Username <span className='text-sm text-custom-textGrey'>(optional)</span></label>
                            <input 
                                type="text" 
                                placeholder="Enter your github username here"
                                className={`border ${formik.touched.githubUsername && formik.errors.githubUsername 
                                    ? 'border-red-500 focus:ring-red-200' 
                                    : 'border-gray-300 focus:ring-blue-200'} 
                                    outline-none rounded-md w-full py-3 px-4 bg-gray-50 focus:bg-white
                                    transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                {...formik.getFieldProps('githubUsername')}
                            />
                            {formik.touched.githubUsername && formik.errors.githubUsername && 
                                <div className="text-red-500 text-sm">{formik.errors.githubUsername}</div>
                            }
                        </div> 
                        <div className="grid grid-cols-2 gap-4 mt-5">
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-gray-700">Start Year</label>
                                <select 
                                    className={`border ${formik.touched.startYear && formik.errors.startYear 
                                        ? 'border-red-500 focus:ring-red-200' 
                                        : 'border-gray-300 focus:ring-blue-200'} 
                                        outline-none rounded-md w-full py-3 px-4 bg-gray-50 focus:bg-white
                                        transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                    {...formik.getFieldProps('startYear')}
                                >
                                    <option value=''>Select Year</option>
                                    <option value='2022'>2022</option>
                                    <option value='2023'>2023</option>
                                    <option value='2024'>2024</option>
                                    <option value='2025'>2025</option>
                                </select>
                                {formik.touched.startYear && formik.errors.startYear && 
                                    <div className="text-red-500 text-sm">{formik.errors.startYear}</div>
                                }
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-gray-700">Intake</label>
                                <select 
                                    className={`border ${formik.touched.intake && formik.errors.intake 
                                        ? 'border-red-500 focus:ring-red-200' 
                                        : 'border-gray-300 focus:ring-blue-200'} 
                                        outline-none rounded-md w-full py-3 px-4 bg-gray-50 focus:bg-white
                                        transition-all duration-200 focus:ring-4 focus:border-custom-blue`}
                                    {...formik.getFieldProps('intake')}
                                >
                                    <option value=''>Select Intake</option>
                                    <option value='January'>January</option>
                                    <option value='May'>May</option>
                                    <option value='September'>September</option>
                                </select>
                                {formik.touched.intake && formik.errors.intake && 
                                    <div className="text-red-500 text-sm">{formik.errors.intake}</div>
                                }
                            </div>
                        </div>
                    </div>
                )}
                <button 
                    type="submit" 
                    className="flex items-center justify-center w-full h-12 bg-gradient-to-r from-custom-blue to-indigo-600 hover:from-custom-blue hover:to-indigo-700 text-white rounded-md mt-8 font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                    {isSigningUp ? <ClipLoader size={24} color="white"/> : "Create Account"}
                </button>
                <p className="text-gray-600 mt-8">
                    Already have an account? {" "}
                    <Link to="/login" className="text-custom-blue hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    );
}
 
export default Signup;