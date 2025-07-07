import React from "react";
import { Table, Dropdown, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

const data = Array.from({ length: 50 }, (_, index) => ({
  key: index,
  question: `Question ${index + 1} Goes here`,
  answer: `Lorem Ipsum is a dummy text. Lorem Ipsum is a dummy text`,
}));

const columns = [
  {
    title: "Question",
    dataIndex: "question",
    key: "question",
    render: (text: string) => <strong>{text}</strong>,
  },
  {
    title: "Answer",
    dataIndex: "answer",
    key: "answer",
  },
  {
    title: "Actions",
    key: "actions",
    align: "center" as const,
    render: () => (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="1">Edit</Menu.Item>
            <Menu.Item key="2">Delete</Menu.Item>
          </Menu>
        }
        trigger={["click"]}
      >
        <Button icon={<DownOutlined />} />
      </Dropdown>
    ),
  },
];

const FaqTable = () => {
  return (
    <div
      style={{
        // padding: 24,
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.05)",
        // maxWidth: 1000,
        // margin: "0 auto",
        border:" 1px solid #EAECF0",
      }}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
        bordered={false}
        rowClassName={() => "faq-row"}
      />
    </div>
  );
};

export default FaqTable;
