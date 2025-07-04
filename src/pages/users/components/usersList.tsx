import { message, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import DescriptionTitle from "../../../components/ui/DescriptionTitle";
import LoadingSpinner from "../../../components/ui/LoaderSpinner";
import client from "../../../utils/axios";

const UsersList = () => {
  const navigate = useNavigate();
  const columns: ColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      sorter: (a, b) =>
        (a.phone_number || "").localeCompare(b.phone_number || ""),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => (a.role || "").localeCompare(b.role || ""),
      filters: [
        {
          text: "Admin",
          value: "admin",
        },
        {
          text: "Salesperson",
          value: "salesperson",
        },
      ],
      onFilter: (value: boolean | React.Key, record: User) =>
        record.role === value,
      render: (role: string) =>
        role === "admin" ? (
          <Tag color="green">Admin</Tag>
        ) : (
          <Tag color="blue">Salesperson</Tag>
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
      sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <EditOutlined
            style={{ fontSize: 18 }}
            onClick={() => navigate(`/users/add-user/${record._id}`)}
          />
          <DeleteOutlined
            style={{ fontSize: 18, color: "red", marginLeft: "5px" }}
          />
        </Space>
      ),
    },
  ];

  const fetchAllUsers = async (): Promise<User[]> => {
    const { data } = await client.get<{
      status: string;
      users: User[];
    }>(`/user/users`);
    return data.users;
  };

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery(["Users"], fetchAllUsers);

  if (usersError) message.error("Error fetching insurance agents");

  return (
    <>
      <LoadingSpinner isLoading={usersLoading} />
      <DescriptionTitle
        title="List of Users"
        description="View all users in the sekai system"
      />
      <Table
        rowKey="_id"
        loading={usersLoading}
        dataSource={users}
        columns={columns}
      />
    </>
  );
};

export default UsersList;
