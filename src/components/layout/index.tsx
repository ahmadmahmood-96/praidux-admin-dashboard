import React, { useState, useEffect, useRef } from "react";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { GrHomeRounded } from "react-icons/gr";
import {
  FileTextOutlined,
  QuestionCircleOutlined,
  CommentOutlined,
} from "@ant-design/icons";

import { Layout, Menu, Button, theme, Dropdown, Avatar } from "antd";
import { Link, useLocation, Outlet } from "react-router-dom";
import { ConfirmModal } from "../index.tsx";
import "./style.less";
import { UseAuthentication } from "../../utils/useAuthentication";
import ThemeToggle from "../ui/ThemeToggle.tsx";
const { Header, Sider } = Layout;

const AppLayout: React.FC = () => {
  const { user, logout } = UseAuthentication();
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 1024);

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const handleResize = () => {
    setCollapsed(window.innerWidth <= 1024);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (window.innerWidth <= 1024) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setCollapsed(true);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [selectedItem, setSelectedItem] = useState("");
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    let pathName = path.split("/")[1];
    // const testimonialRelatedRoutes = [
    //   "testimonials",
    //   "add-video-testimonial",
    //   "edit-video-testimonial",
    // ];
    // if (testimonialRelatedRoutes.includes(pathName)) {
    //   pathName = "testimonials";
    // }
    if (["testimonials", "add-video-testimonial" , "add-static-testimonial"].includes(pathName)) {
      pathName = "testimonials";
    }
     if (["blogs", "add-Blog"].includes(pathName)) {
      pathName = "blogs";
    }

    if (["add-Faq", "update-faq"].includes(pathName)) {
      pathName = "faqs";
    }
    if (
      path === "/" ||
      path === "/add-project" ||
      path.startsWith("/update-project/")
    ) {
      setSelectedItem("");
    } else {
      setSelectedItem(pathName);
    }

    if (window.innerWidth <= 1024) {
      setCollapsed(true);
    }
  }, [location]);

  const handleLogout = () => {
    ConfirmModal({
      className: "logout-modal",
      title: "Logout",
      content: "Are you sure you want to logout?",
      okText: "Logout",
      cancelText: "Cancel",
      onOk: logout,
    });
  };

  const allowedRolesByMenuItem: { [key: string]: string[] } = {
    // cars: ["admin"],
    // "car-config": ["admin"],
    // users: ["admin"],
    testimonials: ["admin"],
    faqs: ["admin"],
    blogs: ["admin"],
  };

  const getMenuIcon = (menuItem: string) => {
    switch (menuItem) {
      // case "cars":
      //   return <IoCarSportOutline />;
      // case "car-config":
      //   return <RiListSettingsFill />;
      // case "users":
      //   return <HiOutlineUsers />;
      case "testimonials":
        return <CommentOutlined />;
      case "faqs":
        return <QuestionCircleOutlined />;
      case "blogs":
        return <FileTextOutlined />;
      default:
        return null;
    }
  };

  const formatMenuItemName = (menuItem: string) => {
    return menuItem
      .split("-") // split at hyphens
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize
      .join(" "); // rejoin with spaces
  };

  const getMenuItems = () => {
    return Object.keys(allowedRolesByMenuItem).map((menuItem) => {
      if (allowedRolesByMenuItem[menuItem].includes(user.role)) {
        return (
          <Menu.Item key={menuItem} icon={getMenuIcon(menuItem)}>
            <Link to={`/${menuItem}`}>{formatMenuItemName(menuItem)}</Link>
          </Menu.Item>
        );
      }
      return null;
    });
  };

  return (
    <>
      <Layout className="main">
        <Sider
          ref={sidebarRef}
          trigger={null}
          collapsible
          breakpoint="lg"
          collapsedWidth="80"
          collapsed={collapsed}
          className="side-bar"
          width={220}
        >
          <div className="logo">
            {collapsed ? (
              <img
                src="/praidux-logo.png"
                alt="Praidux logo"
                width="24"
                height="20"
                style={{ width: 50 }}
              />
            ) : (
              <img
                src="/praidux-logo.png"
                alt="Hikar Logo"
                width="150"
                height="41"
                style={{ width: "120px" }}
              />
            )}
          </div>
          <Menu
            theme="light"
            mode="inline"
            className="sidebar-menu"
            selectedKeys={[selectedItem]}
            onClick={(e) => setSelectedItem(e.key)}
          >
            <Menu.Item key="" icon={<GrHomeRounded />}>
              <Link to="/">Projects</Link>
            </Menu.Item>
            {getMenuItems()}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header
            style={{ background: colorBgContainer }}
            className="layout-page-header-main"
          >
            <div>
              <Button
                type="text"
                className={!collapsed ? "menu-btn" : ""}
                icon={collapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "22px",
                  marginTop: "15px",
                  width: 50,
                  height: 40,
                }}
              />
            </div>
            <div className="user-details">
              <ThemeToggle />
              <div className="user-content">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>

              <Dropdown
                menu={{
                  items: [
                    {
                      key: "2",
                      icon: <LogoutOutlined />,
                      label: "Logout",
                      onClick: handleLogout,
                    },
                  ],
                }}
              >
                <div className="user-action">
                  <Avatar
                    size={41}
                    style={{ backgroundColor: colorPrimary }}
                    icon={<UserOutlined />}
                  />
                </div>
              </Dropdown>
            </div>
          </Header>
          <Outlet />
        </Layout>
      </Layout>
    </>
  );
};

export default AppLayout;
