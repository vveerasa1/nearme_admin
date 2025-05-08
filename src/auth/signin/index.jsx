import { useState } from 'react'
import "./style.css"
import { Input } from '@mui/material'
import Logo from '../../assets/images/near-me-logo.png'
import { Email, Lock } from '@mui/icons-material'
import { Toaster,toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
const Signin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@nearme.com');
    const [password, setPassword] = useState('12345');

    const handleLogin = async() =>{
        if(email === 'admin@nearme.com' && password === "12345"){
            const user = {email};
            localStorage.setItem('authUser',JSON.stringify(user))
            navigate('/dashboard')
            toast.success( `Welcome ${email}`)
        }else{
            toast.error("Invalid Credential")
        }
        
    }
    return (
        <div className="auth-container">
            <Toaster/>
            <div className="auth-wrapper">
                <div className='auth-logo-box'>
                    <img className='img-fluid' src={Logo} alt='Logo' />
                </div>
                <div className="auth-heading">
                    <h2>Admin Login</h2>
                </div>
                <form className='authform'>
                    <div className='auth-form-group'>
                        <Input value={email} onChange={(e)=> setEmail(e.target.value)} className='auth-input' type='email' placeholder='Email' />
                        <span className='authInputIcon'><Email style={{ fontSize: '16px' }} /></span>
                    </div>
                    <div className='auth-form-group'>
                        <Input value={password} onChange={(e)=> setPassword(e.target.value)} className='auth-input' type='password' placeholder='Password' />
                        <span className='authInputIcon'><Lock style={{ fontSize: '16px' }} /></span>
                    </div>
                    <div className='auth-form-group authSubmitbtn mb-0'>
                        <button onClick={handleLogin} className='theme-btn btn-main' type='button'>Sign In</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signin;