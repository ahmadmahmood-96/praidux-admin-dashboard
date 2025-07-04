import { Divider } from "antd";

const SubHeading = ({ title }: { title: string }) => {
  return (
    <>
      <Divider />
      <div style={{ marginBottom: "10px" }}>
        <h3 style={{ color: "var(--hover-color)" }}>{title}</h3>
      </div>
    </>
  );
};

export default SubHeading;
