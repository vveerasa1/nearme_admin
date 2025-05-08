import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faHome,
  faStar,
  faTag,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Logo from "../assets/images/logo-long.png";
import MLogo from "../assets/images/icon.png";

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ overflowX: "hidden", minHeight: "100vh" }} className="">
      <Sider className="px-2" trigger={null} collapsible collapsed={collapsed}>
        <div
          className="logo px-3  "
          style={{
            color: "#fff",
            fontSize: "20px",
            padding: "16px",
            textAlign: "center",
          }}
        >
          {collapsed ? (
            <img src={MLogo} className="img-fluid" alt="Logo" />
          ) : (
            <img src={Logo} className="img-fluid" alt="Logo" />
          )}
        </div>
        <Menu
          className="fs-6"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
        >
          <Menu.Item
            key="1"
            icon={<FontAwesomeIcon icon={faHome} />}
            style={{ marginBottom: "20px" }}
          >
            <Link className="text-decoration-none" to="/dashboard">
              Dashboard
            </Link>
          </Menu.Item>

          <Menu.Item
            key="2"
            icon={<FontAwesomeIcon icon={faBriefcase} />}
            style={{ marginBottom: "20px" }}
          >
            <Link className="text-decoration-none" to="/business-listings">
              Business Listing
            </Link>
          </Menu.Item>

          <Menu.Item
            key="3"
            icon={<FontAwesomeIcon icon={faStar} />}
            style={{ marginBottom: "20px" }}
          >
            <Link className="text-decoration-none" to="/deals">
              Deals
            </Link>
          </Menu.Item>

          <Menu.Item
            key="4"
            icon={<FontAwesomeIcon icon={faTag} />}
            style={{ marginBottom: "20px" }}
          >
            <Link className="text-decoration-none" to="/discounts">
              Discounts
            </Link>
          </Menu.Item>

          <Menu.Item
            key="5"
            icon={<FontAwesomeIcon icon={faTicket} />}
            style={{ marginBottom: "20px" }}
          >
            <Link className="text-decoration-none" to="/coupons">
              Coupons
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
