import "./staticTestimonial.css";
import { Dropdown, Menu } from "antd";
import {
  EditOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
interface StaticTestimonialData {
  _id: string;
  projectLogo?: string;
  description?: string;
  clientImage?: string;
  clientName?: string;
  designation?: string;
}

interface StaticTestimonialCardProps {
  data: StaticTestimonialData;
  checked: boolean;
  onToggleCheck: () => void;
  onAction: (id: string, action: "edit" | "pause" | "delete") => void;
}

const StaticTestimonialCard: React.FC<StaticTestimonialCardProps> = ({
  data,
  checked,
  onToggleCheck,
  onAction,
}) => {
  if (!data) return null;

  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={() => onAction(data._id, "edit")}>
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <EditOutlined />
          Edit
        </span>
      </Menu.Item>
      <Menu.Item key="pause" onClick={() => onAction(data._id, "pause")}>
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <PauseCircleOutlined />
          Pause
        </span>
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => onAction(data._id, "delete")}>
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <DeleteOutlined />
          Delete
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="Static-Testimonial-card">
      <div className="sttic-card-top-header-selection">
        <p className="selct-project-test">Select Project</p>
        <img
          src={
            checked
              ? "/Images/Project/checked.svg"
              : "/Images/Project/unchecked.svg"
          }
          alt="Checked"
          style={{ cursor: "pointer" }}
          onClick={onToggleCheck}
        />
      </div>

      <div className="static-testimonial-body">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p className="project-logo-static">Project Logo</p>
          <Dropdown overlay={menu} trigger={["click"]}>
            <img
              style={{ cursor: "pointer" }}
              src="/Images/testimonial/moreInfo.svg"
              alt="info"
            />
          </Dropdown>
        </div>
        {data.projectLogo && (
          <div className="project-logo-image-static">
            <img
              src={data.projectLogo}
              alt="Project Logo"
              style={{ width: "100%", borderRadius: "8px", height: "100%" }}
            />
          </div>
        )}

        <p className="statuc-testimonial-description">{data.description}</p>

        <div className="project-static-details-personal">
          {data.clientImage && (
            <div className="image-client">
              <img
                src={data.clientImage}
                alt="Client"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "100%",
                }}
              />
            </div>
          )}
          <div className="clientName-designation">
            <p className="project-client-name-client">{data.clientName}</p>
            <p className="project-designation-client">{data.designation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticTestimonialCard;
