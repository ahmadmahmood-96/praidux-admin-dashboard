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

const CarConfigList = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchAllCarConfigs = async (): Promise<CarMake[]> => {
    const { data } = await client.get<{
      status: string;
      result: CarMake[];
    }>("/config/view-car-configs");
    return data.result;
  };

  const {
    data: carConfigs,
    isLoading,
    error,
  } = useQuery(["AllCarConfigs"], fetchAllCarConfigs);

  const handleDelete = (id: string, make: string) => {
    confirm({
      title: `Delete "${make}" and all its models?`,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await client.delete(`/config/delete-car-config/${id}`);
          message.success(`Successfully deleted ${make} make and its models`);
          queryClient.invalidateQueries(["AllCarConfigs"]);
          queryClient.invalidateQueries(["AllMakes"]);
        } catch (err) {
          message.error(`Failed to delete ${make}`);
        }
      },
    });
  };

  const columns: ColumnsType<CarMake> = [
    {
      title: "Make",
      dataIndex: "name",
      key: "name",
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Models",
      dataIndex: "models",
      key: "models",
      render: (models: string[]) => models.join(", "),
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
              navigate("/car-config/add-config", { state: { id: record._id } });
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

  const filteredCarConfigs = useMemo(() => {
    if (!searchText) return carConfigs;
    const search = searchText.toLowerCase();
    return carConfigs?.filter((carMake) => {
      return (
        carMake.name.toLowerCase().includes(search) ||
        carMake.models.some((model) => model.toLowerCase().includes(search))
      );
    });
  }, [carConfigs, searchText]);

  if (error) message.error("Error fetching car configs");

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <Row justify="space-between">
        <Col>
          <DescriptionTitle
            title="List of Car Makes & Models"
            description="View all car makes & models in the system"
          />
        </Col>
        <Col>
          <Button
            size="large"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/car-config/add-config")}
          >
            Add New Car Config
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Input.Search
            allowClear
            placeholder="Search by Make or Model"
            size="large"
            style={{ marginBottom: 12 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>
      <Table
        rowKey="_id"
        loading={isLoading}
        dataSource={filteredCarConfigs}
        columns={columns}
        rowClassName="row-hoverable"
        onRow={(record) => ({
          onClick: () => {
            navigate("/car-config/add-config", { state: { id: record._id } });
          },
        })}
      />
    </>
  );
};

export default CarConfigList;
