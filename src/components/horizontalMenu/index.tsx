import { useEffect, useState } from "react";
import { Menu } from "antd";

import { Link, Outlet, useLocation } from "react-router-dom";
import CardWrapper from "../cardWrapper";
import ContentWrapper from "../contentWrapper";
import "./style.less";

export interface MenuList {
  keyName: string;
  pathName: string | JSX.Element;
  path: string;
  disabled?: boolean;
}
export interface MenuListProps {
  routes: MenuList[];
  userId?: string | null;
  parent_id?: string | null;
}

export const HorizontalMenu = (props: MenuListProps) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedPathName, setSelectedPathName] = useState<
    string | JSX.Element
  >("");
  const location = useLocation();
  useEffect(() => {
    const pathName = location.pathname.split("/");
    const userIdCheck = !isNaN(+pathName[3]);
    if (pathName[2] != undefined && pathName[3] == undefined) {
      setSelectedItem(pathName[2]);
    } else if (pathName[3] != undefined && !userIdCheck) {
      setSelectedItem(pathName[3]);
    } else if (userIdCheck) {
      setSelectedItem(pathName[2]);
    } else {
      setSelectedItem("");
    }
    // setSelectedItem(
    //   pathName[2] ?? (pathName[3] && !userIdCheck ? pathName[3] : userIdCheck ? pathName[2] : '')
    // );
    const selectedItemData = props.routes.find(
      (route) => route.keyName === selectedItem
    );
    setSelectedPathName(selectedItemData ? selectedItemData.pathName : "");
  }, [location, selectedItem, props.routes]);

  return (
    <ContentWrapper>
      <div className={props.routes.length > 1 ? "horizontal-menu-box" : ""}>
        {props.routes.length > 1 && selectedPathName && (
          <div className="select-name">{selectedPathName}</div>
        )}
        <Menu
          mode="horizontal"
          className="tab-menu"
          selectedKeys={[selectedItem]}
          onClick={(e) => setSelectedItem(e.key)}
        >
          {props.routes.map((route) => (
            <Menu.Item key={route.keyName} disabled={route.disabled ?? false}>
              <Link to={route.path}>{route.pathName}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </div>
      <CardWrapper>
        <Outlet context={props.userId} />
      </CardWrapper>
    </ContentWrapper>
  );
};
