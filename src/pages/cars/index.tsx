import React from "react";
import { HorizontalMenu, MenuList } from "../../components/horizontalMenu";
import { Col, Row } from "antd";
import { BackHistoryButton } from "../../components";

const CarsHome: React.FC = () => {
  const routes: MenuList[] = [
    {
      keyName: "",
      pathName: "Cars",
      path: "/cars",
    },
    {
      keyName: "add-car",
      pathName: "Add Car",
      path: "/cars/add-car",
    },
  ];
  return (
    <>
      <Row justify="space-between" align="bottom">
        <Col>
          <div className="page-title">
            <h2>Cars</h2>
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

export default CarsHome;
