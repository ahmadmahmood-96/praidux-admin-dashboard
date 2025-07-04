import { Button, Col, Form, Input, Row, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import client from "../../../../utils/axios";
import DescriptionTitle from "../../../../components/ui/DescriptionTitle";
import LoadingSpinner from "../../../../components/ui/LoaderSpinner";

const AddColor = () => {
  const location = useLocation();
  const id = location.state?.id;
  const isEdit = !!id;
  const [form] = Form.useForm<ColorFormValues>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading: isColorLoading } = useQuery(
    ["Color", id],
    async () => {
      const { data } = await client.get(`/color/view-color/${id}`);
      return data.result;
    },
    {
      enabled: isEdit,
      onError: () => {
        message.error("Failed to fetch color");
      },
    }
  );

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
      });
    }
  }, [data, form]);

  const { mutate: submitColor, isLoading } = useMutation(
    async (values: ColorFormValues) => {
      if (isEdit) {
        await client.patch(`/color/update-color/${id}`, values);
      } else {
        await client.post(`/color/add-color`, values);
      }
    },
    {
      onSuccess: () => {
        message.success(
          isEdit ? "Color updated successfully" : "Color added successfully"
        );
        queryClient.invalidateQueries(["AllColors"]);
        queryClient.invalidateQueries(["AllCarColors"]);
        navigate("/car-config/colors");
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Submission failed";
        message.error(msg);
      },
    }
  );

  const onFinish = (values: ColorFormValues) => {
    submitColor(values);
  };

  return (
    <>
      <LoadingSpinner
        isLoading={isEdit ? isColorLoading : isLoading ? true : false}
      />
      <DescriptionTitle
        title={isEdit ? "Edit Color" : "Add Color"}
        description="Enter the color name"
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
              label="Color Name"
              name="name"
              rules={[
                { required: true, message: "Please enter the color name" },
              ]}
            >
              <Input size="large" placeholder="e.g. Red" />
            </Form.Item>
          </Col>
          <Col span={24} style={{ textAlign: "right", marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
            >
              {isEdit ? "Update Color" : "Add Color"}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddColor;
