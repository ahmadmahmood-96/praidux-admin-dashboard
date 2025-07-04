import {
  Button,
  Col,
  Input,
  message,
  Row,
  Space,
  Table,
  Tag,
  Modal,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "react-query";
import client from "../../../utils/axios";
import DescriptionTitle from "../../../components/ui/DescriptionTitle";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/ui/LoaderSpinner";
import { useMemo, useState } from "react";
import { FormattedNumber } from "react-intl";

const { confirm } = Modal;

const CarsList = () => {
  const [searchText, setSearchText] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const columns: ColumnsType<CarsList> = [
    {
      title: "Make",
      dataIndex: "make",
      key: "make",
      sorter: (a, b) => a.make.localeCompare(b.make),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      sorter: (a, b) => a.model.localeCompare(b.model),
    },
    {
      title: "Year",
      dataIndex: "manufacturing_year",
      key: "manufacturing_year",
      sorter: (a, b) => a.manufacturing_year - b.manufacturing_year,
    },
    {
      title: "Gear Type",
      dataIndex: "gear_type",
      key: "gear_type",
      filters: [
        { text: "Automatic", value: "Automatic" },
        { text: "Manual", value: "Manual" },
        { text: "AMT", value: "AMT" },
        { text: "Column Shift", value: "Column Shift" },
      ],
      onFilter: (value, record) => record.gear_type === value,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Fuel Type",
      dataIndex: "fuel_type",
      key: "fuel_type",
      filters: [
        { text: "Petrol", value: "Petrol" },
        { text: "Diesel", value: "Diesel" },
        { text: "Electric", value: "Electric" },
        { text: "Hybrid", value: "Hybrid" },
        { text: "LPG", value: "LPG" },
        { text: "CNG", value: "CNG" },
      ],
      onFilter: (value, record) => record.fuel_type === value,
      render: (type: string) => <Tag color="green">{type}</Tag>,
    },
    {
      title: "Price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (_, record) => (
        <FormattedNumber
          value={record.price}
          style="currency"
          currency={record.currency}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <EditOutlined
            style={{ fontSize: 18 }}
            onClick={() =>
              navigate(`/cars/add-car`, {
                state: { id: record._id },
              })
            }
          />
          <DeleteOutlined
            style={{ fontSize: 18, color: "red", marginLeft: "5px" }}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(
                record._id,
                record.make,
                record.model,
                record.manufacturing_year
              );
            }}
          />
        </Space>
      ),
    },
  ];

  const handleDelete = (
    id: string,
    make: string,
    model: string,
    year: number
  ) => {
    confirm({
      title: `Delete "${make + " " + model + " " + year}"?`,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await client.delete(`/cars/delete-car/${id}`);
          message.success(
            `Successfully deleted ${make + " " + model + " " + year}`
          );
          queryClient.invalidateQueries(["AllCars"]);
        } catch (err) {
          message.error(`Failed to delete ${make + " " + model + " " + year}`);
        }
      },
    });
  };

  const fetchAllCars = async (): Promise<CarsList[]> => {
    const { data } = await client.get<{
      status: string;
      result: CarsList[];
    }>("/cars/view-cars");
    return data.result;
  };

  const {
    data: cars,
    isLoading: carsLoading,
    error: carsError,
  } = useQuery(["AllCars"], fetchAllCars);

  const filteredCars = useMemo(() => {
    if (!searchText) return cars;

    return cars?.filter((car) => {
      const search = searchText.toLowerCase();
      return (
        car.make?.toLowerCase().includes(search) ||
        car.model?.toLowerCase().includes(search) ||
        car.manufacturing_year?.toString().includes(search) ||
        car.fuel_type?.toString().includes(search) ||
        car.gear_type?.toString().includes(search) ||
        car.price?.toString().includes(search)
      );
    });
  }, [cars, searchText]);

  if (carsError) message.error("Error fetching cars");

  return (
    <>
      <LoadingSpinner isLoading={carsLoading} />
      <Row justify="space-between">
        <Col>
          <DescriptionTitle
            title="List of Cars"
            description="View all cars in the Hikar system"
          />
        </Col>
        <Col>
          <Button
            size="large"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/cars/add-car")}
          >
            Add New Car
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Input.Search
            allowClear
            placeholder="Search by Make, Model, Year, or Reg No"
            size="large"
            style={{ marginBottom: 12 }}
            onChange={(e: any) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>
      <Table<CarsList>
        rowKey="_id"
        loading={carsLoading}
        dataSource={filteredCars}
        columns={columns}
        rowClassName="row-hoverable"
        onRow={(record) => ({
          onClick: () => {
            navigate("/cars/add-car", { state: { id: record._id } });
          },
        })}
      />
    </>
  );
};

export default CarsList;
