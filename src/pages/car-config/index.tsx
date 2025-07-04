import React from "react";
import { HorizontalMenu, MenuList } from "../../components/horizontalMenu";
import { Col, Row } from "antd";
import { BackHistoryButton } from "../../components";

const CarConfigHome: React.FC = () => {
  const routes: MenuList[] = [
    {
      keyName: "",
      pathName: "Cars Make & Model",
      path: "/car-config",
    },
    {
      keyName: "add-config",
      pathName: "Add make & model",
      path: "/car-config/add-config",
    },
    {
      keyName: "colors",
      pathName: "Car Colors",
      path: "/car-config/colors",
    },
    {
      keyName: "add-colors",
      pathName: "Add car colors",
      path: "/car-config/add-colors",
    },
  ];
  return (
    <>
      <Row justify="space-between" align="bottom">
        <Col>
          <div className="page-title">
            <h2>Car Config</h2>
          </div>
        </Col>
        <Col>
          <div className="top-back-btn">
            <BackHistoryButton name="Back" />
          </div>
        </Col>
      </Row>
      <HorizontalMenu routes={routes} />
    </>
  );
};

export default CarConfigHome;
