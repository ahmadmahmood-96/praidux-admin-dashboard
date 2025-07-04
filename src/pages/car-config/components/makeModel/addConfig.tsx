import { Button, Col, Form, Input, Row, Space, message } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import client from "../../../../utils/axios";
import DescriptionTitle from "../../../../components/ui/DescriptionTitle";
import LoadingSpinner from "../../../../components/ui/LoaderSpinner";

interface CarMakeFormValues {
  name: string;
  models: string[];
}

const AddCarConfig = () => {
  const location = useLocation();
  const id = location.state?.id;
  const isEdit = !!id;
  const [form] = Form.useForm<CarMakeFormValues>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading: isMakeModelLoading } = useQuery(
    ["CarConfig", id],
    async () => {
      const { data } = await client.get(`/config/view-car-config/${id}`);
      return data.result;
    },
    {
      enabled: isEdit,
      onError: () => {
        message.error("Failed to fetch car config");
      },
    }
  );

  // Populate form when data loads
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        models: data.models,
      });
    }
  }, [data, form]);

  const { mutate: submitCarMake, isLoading } = useMutation(
    async (values: CarMakeFormValues) => {
      if (isEdit) {
        await client.patch(`/config/update-car-config/${id}`, values);
      } else {
        await client.post(`/config/add-car-config`, values);
      }
    },
    {
      onSuccess: () => {
        message.success(isEdit ? "Car make updated" : "Car make created");
        queryClient.invalidateQueries(["AllCarConfigs"]);
        queryClient.invalidateQueries(["AllMakes"]);
        navigate("/car-config");
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Submission failed";
        message.error(msg);
      },
    }
  );

  const onFinish = (values: CarMakeFormValues) => {
    submitCarMake(values);
  };

  return (
    <>
      <LoadingSpinner
        isLoading={isEdit ? isMakeModelLoading : isLoading ? true : false}
      />
      <DescriptionTitle
        title={isEdit ? "Edit Car Make & Models" : "Add Car Make & Models"}
        description="Enter car make and its models"
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Car Make"
              name="name"
              rules={[{ required: true, message: "Please enter car make" }]}
            >
              <Input size="large" placeholder="e.g. Honda" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.List
              name="models"
              rules={[
                {
                  validator: async (_, models) => {
                    if (!models || models.length < 1) {
                      return Promise.reject(
                        new Error("At least one model is required")
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  <label>Models</label>
                  <Row gutter={[16, 8]}>
                    {fields.map(({ key, name, ...restField }) => (
                      <Col xs={24} md={12} lg={8} key={key}>
                        <Space
                          align="baseline"
                          style={{ display: "flex", width: "100%" }}
                        >
                          <Form.Item
                            {...restField}
                            name={name}
                            rules={[
                              {
                                required: true,
                                message: "Please enter model",
                              },
                            ]}
                            style={{ flex: 1 }}
                          >
                            <Input placeholder="e.g. Civic" size="large" />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            style={{ color: "red" }}
                          />
                        </Space>
                      </Col>
                    ))}
                  </Row>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ marginTop: 8 }}
                  >
                    Add Model
                  </Button>
                </>
              )}
            </Form.List>
          </Col>

          <Col span={24} style={{ textAlign: "right", marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
            >
              {isEdit ? "Update Car Make" : "Add Car Make"}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddCarConfig;
