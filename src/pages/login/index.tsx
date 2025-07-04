import { useState, useEffect } from "react";
import { Button, Form, Input, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./style.less";
import ResetPasswordModal from "../../components/resetPassword/ResetPasswordModal";
import UseAuthentication from "../../utils/useAuthentication";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = UseAuthentication();
  const [form] = Form.useForm<LoginFormValues>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  });

  const onFinish = async (values: LoginFormValues) => {
    if (!values.email || !values.password)
      return message.error("Please enter credentials");
    const { email, password } = values;
    login(email, password);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Row
        justify="center"
        align="middle"
        gutter={30}
        style={{ margin: 0 }}
        className="row-box"
      >
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="login-left-box">
          <img
            className="hikar-logo-image"
            src="/hikar-logo.png"
            alt="Hikar logo"
          />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          className="login-right-box"
        >
          <Form
            layout="vertical"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            form={form}
          >
            <Col span={24}>
              <h1>Log into your Hikar Account</h1>
              <span className="sub-title">
                Sign in by entering correct credentials
              </span>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter the E-mail" },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                    validateTrigger: "onBlur",
                  },
                ]}
              >
                <Input size="large" placeholder="Enter E-mail" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter the password" },
                ]}
              >
                <Input.Password size="large" placeholder="Enter Password" />
              </Form.Item>

              <div className="login-options">
                <span
                  className="forgot-password"
                  onClick={() => setModalVisible(true)}
                >
                  Forgot Password?
                </span>
              </div>
            </Col>

            <Col span={24}>
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="primary"
                  size="large"
                  style={{ width: "100%" }}
                  loading={loading}
                  htmlType="submit"
                >
                  Sign in
                </Button>
              </Form.Item>
            </Col>
          </Form>
        </Col>
      </Row>

      {isModalVisible && (
        <ResetPasswordModal
          isResetPassword={false}
          onOk={handleOk}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default Login;
