import React, { useState } from 'react'
import "./style.css"
import { Link } from 'react-router-dom'
import Logo from '../../assets/images/logo-long.png'
import PersonImg from '../../assets/images/personImg.jpg'
import { Menu as MenuIcon } from '@mui/icons-material'
import { Avatar, Menu, MenuItem, Typography, IconButton } from '@mui/material'

const Topbar = ({ onToggleSidebar }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className='topbar-container'>
            <div className='topbar-left-wrapper'>
                <Link to={'/'} className='logo-link'>
                    <img className='img-fluid' src={Logo} alt='Logo Img' />
                </Link>
                <button type='button' onClick={onToggleSidebar} className='humburgerBtn'><MenuIcon /></button>
            </div>
            <div className='topbar-right-wrapper'>
                <div className='topbar-userinfo' onClick={handleClick}>
                    {/* Username */}
                    <Typography className='username-text' variant="body1">John Doe</Typography>

                    {/* User Avatar */}
                    <IconButton size="small">
                        <Avatar
                            alt="John Doe"
                            src={PersonImg}
                            sx={{ width: 40, height: 40 }}
                        />
                    </IconButton>
                </div>

                {/* Dropdown Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    sx={{
                        '& .MuiPaper-root': {
                          width: '175px',
                          boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.1)',
                        },
                    }}
                >
                    {/* <MenuItem className='dropMenuItem' onClick={handleClose}>Profile</MenuItem>
                    <MenuItem className='dropMenuItem' onClick={handleClose}>Settings</MenuItem> */}
                    <MenuItem className='dropMenuItem' onClick={handleClose}>Logout</MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default Topbar;