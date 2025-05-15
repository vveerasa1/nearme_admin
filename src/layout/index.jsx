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
  theme,
  Space,
} from "antd";
import { Link, useLocation } from "react-router-dom";

import Logo from "../assets/images/logo-long.png";
import MLogo from "../assets/images/icon.png";
import '../../src/layout/style.css'

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
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
      
    ) {
      return "2";
    }
  
    if (
      path.startsWith("/deals") ||
      path.startsWith("/edit-offer/Deal")||
      path.startsWith("/view/Deal")

    ) {
      return "3";
    }
  
    if (
      path.startsWith("/discounts") ||
      path.startsWith("/edit-offer/Discount")||
      path.startsWith("/view/Discount")

    ) {
      return "4";
    }
  
    if (
      path.startsWith("/coupons") ||
      path.startsWith("/edit-offer/Coupon")||
      path.startsWith("/view/Coupon")

    ) {
      return "5";
    }
  
    return "1"; // Default fallback to dashboard
  };
  

  const profileMenu = (
    <Menu
      items={[
        { key: "1", label: "Profile" },
        { key: "2", label: "Logout" },
      ]}
    />
  );

  return (
    <Layout style={{ height: "100vh" }}>
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
          items={[
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
          ]}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "fixed",
            top: 0,
            left: collapsed ? 80 : 200,
            right: 0,
            zIndex: 100,
            height: 64,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
  type="text"
  onClick={() => setCollapsed(!collapsed)}
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
            <Dropdown overlay={profileMenu} trigger={["click"]}>
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
