import React, { useState, useEffect } from 'react'
import "./style.css"
import Sidebar from './sidebar'
import Topbar from './topbar'

const AppLayout = ({ children }) => {

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        // Check if the screen size is mobile (width <= 768px)
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        setIsSidebarCollapsed(isMobile);
    }, []);

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };
    
    return (
        <div className='main-container'>
            <Topbar onToggleSidebar={handleToggleSidebar} />
            <div className='content-container'>
                <div className={`sidebar ${isSidebarCollapsed ? "collapse" : ""}`}>
                    <Sidebar />
                </div>
                <div className='content'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AppLayout;