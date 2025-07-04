import React from "react";
import { HorizontalMenu, MenuList } from "../../components/horizontalMenu";

const UsersHome: React.FC = () => {
  const routes: MenuList[] = [
    {
      keyName: "", // /users
      pathName: "Users",
      path: "/users",
    },
    {
      keyName: "new", // will match pathname[3] === "new"
      pathName: "Add User",
      path: "/users/add-user/new",
    },
  ];
  return <HorizontalMenu routes={routes} />;
};

export default UsersHome;
