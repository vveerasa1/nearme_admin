import { useState } from 'react'
import "./style.css"
import { TextField, InputAdornment } from '@mui/material'
import Logo from '../../assets/images/near-me-logo.png'
import { Email, Lock } from '@mui/icons-material'

const Signin = () => {
    const [email, setEmail] = useState('');
    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className='auth-logo-box'>
                    <img className='img-fluid' src={Logo} alt='Logo' />
                </div>
                <div className="auth-heading">
                    <h2>Admin Login</h2>
                </div>
                <form className='authform'>
                    <div className='auth-form-group'>
                        <input className='auth-input' type='email' placeholder='Email' />
                        <span className='authInputIcon'><Email style={{ fontSize: '16px' }} /></span>
                    </div>
                    <div className='auth-form-group'>
                        <input className='auth-input' type='password' placeholder='Password' />
                        <span className='authInputIcon'><Lock style={{ fontSize: '16px' }} /></span>
                    </div>
                    <div className='auth-form-group authSubmitbtn mb-0'>
                        <button className='theme-btn btn-main' type='button'>Sign In</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signin;