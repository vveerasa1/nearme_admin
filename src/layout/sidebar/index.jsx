import React, { useState, useEffect } from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Business, LocalOffer } from '@mui/icons-material';
import './style.css';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const [activePath, setActivePath] = useState(location.pathname);

    useEffect(() => {
        // Update active path whenever the location changes
        setActivePath(location.pathname);
    }, [location]);

    const menuItems = [
        { label: 'Dashboard', icon: <Home />, path: '/dashboard' },
        { label: 'Business Listings', icon: <Business />, path: '/business-listings' },
        { label: 'Deals', icon: <LocalOffer />, path: '/deals' },
        { label: 'Discounts', icon: <LocalOffer />, path: '/discounts' },
        { label: 'Coupons', icon: <LocalOffer />, path: '/coupons' },
    ];

    return (
        <List className='menuList'>
            {menuItems.map((item) => (
                <ListItemButton
                    key={item.path}
                    component={Link}
                    to={item.path}
                    className='menuItemBtn'
                    sx={{
                        backgroundColor: activePath === item.path ? '#0689C7' : 'transparent',
                        color: activePath === item.path ? '#fff' : 'inherit',
                        '&:hover': {
                            backgroundColor: '#0689C7',
                        },
                    }}
                >
                    <ListItemIcon
                        className='menuItemIcon'
                        sx={{
                            color: activePath === item.path ? '#fff' : 'inherit',
                        }}
                    >
                        {React.cloneElement(item.icon, { fontSize: '18px' })}
                    </ListItemIcon>
                    <ListItemText className='menuItemText' primary={item.label} />
                </ListItemButton>
            ))}
        </List>
    );
};

export default Sidebar;
