import { Button, Col, Input, message, Modal, Row, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "react-query";
import client from "../../../../utils/axios";
import DescriptionTitle from "../../../../components/ui/DescriptionTitle";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../components/ui/LoaderSpinner";
import { useMemo, useState } from "react";

const { confirm } = Modal;

const ColorsList = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchAllColors = async (): Promise<ColorType[]> => {
    const { data } = await client.get<{
      status: string;
      result: ColorType[];
    }>("/color/view-colors");
    return data.result;
  };

  const {
    data: colors,
    isLoading,
    error,
  } = useQuery(["AllColors"], fetchAllColors);

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: `Delete color "${name}"?`,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await client.delete(`/color/delete-color/${id}`);
          message.success(`Successfully deleted ${name} color`);
          queryClient.invalidateQueries(["AllColors"]);
          queryClient.invalidateQueries(["AllCarColors"]);
        } catch (err) {
          message.error(`Failed to delete ${name}`);
        }
      },
    });
  };

  const columns: ColumnsType<ColorType> = [
    {
      title: "Color Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <EditOutlined
            style={{ fontSize: 18 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/car-config/add-colors", { state: { id: record._id } });
            }}
          />
          <DeleteOutlined
            style={{ fontSize: 18, color: "red", marginLeft: "5px" }}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record._id, record.name);
            }}
          />
        </Space>
      ),
    },
  ];

  const filteredColors = useMemo(() => {
    if (!searchText) return colors;
    const search = searchText.toLowerCase();
    return colors?.filter((color) => color.name.toLowerCase().includes(search));
  }, [colors, searchText]);

  if (error) message.error("Error fetching colors");

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <Row justify="space-between" align="middle">
        <Col>
          <DescriptionTitle
            title="List of Colors"
            description="View all car colors in the system"
          />
        </Col>
        <Col>
          <Button
            size="large"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/car-config/add-colors")}
          >
            Add New Color
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Input.Search
            allowClear
            placeholder="Search by Color Name"
            size="large"
            style={{ marginBottom: 12 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>
      <Table
        rowKey="_id"
        loading={isLoading}
        dataSource={filteredColors}
        columns={columns}
        rowClassName="row-hoverable"
        onRow={(record) => ({
          onClick: () => {
            navigate("/car-config/add-colors", { state: { id: record._id } });
          },
        })}
      />
    </>
  );
};

export default ColorsList;
