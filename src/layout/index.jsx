import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  faBriefcase,
  faHome,
  faStar,
  faTag,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Drawer,
  Space,
  theme,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import Logo from "../assets/images/logo-long.png";
import MLogo from "../assets/images/icon.png";
import "../../src/layout/style.css";

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "1";
    if (
      path.startsWith("/business-listings") ||
      path.startsWith("/add-new-business") ||
      path.startsWith("/add-offer") ||
      path.startsWith("/edit-business") ||
      path.startsWith("/view-business")
    )
      return "2";
    if (
      path.startsWith("/deals") ||
      path.startsWith("/edit-offer/Deal") ||
      path.startsWith("/view/Deal")
    )
      return "3";
    if (
      path.startsWith("/discounts") ||
      path.startsWith("/edit-offer/Discount") ||
      path.startsWith("/view/Discount")
    )
      return "4";
    if (
      path.startsWith("/coupons") ||
      path.startsWith("/edit-offer/Coupon") ||
      path.startsWith("/view/Coupon")
    )
      return "5";
    if (path.startsWith("/users") || path.startsWith("/view-users")) return "6"; // Added condition for "Users" page
    return "1";
  };

  const handleAvatarClick = (visible) => {
    if (visible) {
      console.log("Avatar clicked!");
      // You can trigger any logic here
    }
  };

  const handleProfileMenuClick = ({ key }) => {
    if (key === "1") {
      console.log("Logging out...");
      localStorage.removeItem("authUser");
      window.location.href = "/signin";
    }
  };

  const profileMenu = (
    <Menu
      onClick={handleProfileMenuClick}
      items={[{ key: "1", label: "Logout" }]}
    />
  );

  const menuItems = [
    {
      key: "1",
      icon: <FontAwesomeIcon icon={faHome} />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <FontAwesomeIcon icon={faBriefcase} />,
      label: <Link to="/business-listings">Business Listings</Link>,
    },
    {
      key: "3",
      icon: <FontAwesomeIcon icon={faStar} />,
      label: <Link to="/deals">Deals</Link>,
    },
    {
      key: "4",
      icon: <FontAwesomeIcon icon={faTag} />,
      label: <Link to="/discounts">Discounts</Link>,
    },
    {
      key: "5",
      icon: <FontAwesomeIcon icon={faTicket} />,
      label: <Link to="/coupons">Coupons</Link>,
    },
    {
      key: "6",
      icon: <UserOutlined />,
      label: <Link to="/users">Users</Link>, // New "Users" tab
    },
  ];

  // const profileMenu = (
  //   <Menu
  //     items={[
  //       { key: "1", label: "Profile" },
  //       { key: "2", label: "Logout" },
  //     ]}
  //   />
  // );

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Sidebar or Drawer */}
      {isMobile ? (
        <Drawer
          title={<img src={Logo} alt="Logo" style={{ maxWidth: "120px" }} />}
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          bodyStyle={{ padding: 0 }}
        >
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
            onClick={() => setMobileDrawerOpen(false)}
          />
        </Drawer>
      ) : (
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          style={{
            backgroundColor: "#31A5DC",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: collapsed ? "12px" : "20px",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={collapsed ? MLogo : Logo}
              alt="Logo"
              style={{
                maxWidth: collapsed ? "40px" : "140px",
                transition: "0.3s ease",
              }}
            />
          </div>
          <div style={{ height: 35 }} />
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            theme="dark"
            style={{
              backgroundColor: "#31A5DC",
              fontSize: "16px",
              padding: "0 8px",
              borderRight: "none",
            }}
            items={menuItems}
          />
        </Sider>
      )}

      {/* Main Layout */}
      <Layout style={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 200 }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "fixed",
            top: 0,
            left: isMobile ? 0 : collapsed ? 80 : 200,
            right: 0,
            zIndex: 100,
            height: 64,
            boxShadow: "0 1px 0px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            type="text"
            onClick={() => {
              if (isMobile) {
                setMobileDrawerOpen(true);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            style={{
              width: 36,
              height: 36,
              padding: 4,
              border: "1.5px solid #ddd",
              borderRadius: "10px",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
            }}
          >
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                style={{
                  width: "16px",
                  height: "2px",
                  backgroundColor: "#222",
                  borderRadius: "1px",
                }}
              />
            ))}
          </Button>

          <Space>
            <span style={{ fontSize: 16 }}>Admin</span>
            <Dropdown
              overlay={profileMenu}
              trigger={["click"]}
              onOpenChange={(visible) => {
                if (visible) console.log("Avatar clicked");
              }}
            >
              <Avatar
                size="large"
                icon={<UserOutlined />}
                style={{ backgroundColor: "#31A5DC", cursor: "pointer" }}
              />
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            marginTop: 64,
            padding: 24,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
