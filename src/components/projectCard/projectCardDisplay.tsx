
import { Dropdown, Menu } from "antd";
import {
  EditOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./ProjectCard.css";

const ProjectCard = ({
  title,
  mainCategory,
  categories,
  image,
  checked,
  onToggleCheck,
  onDelete,
  onPause,
  onEdit,
}: any) => {
  const categoryToGroupMap: Record<string, string> = {
    // Design
    "UIUX Design": "design",
    Wireframe: "design",
    "User research": "design",

    // Development
    "Mobile Development": "development",
    "Web Development": "development",
    "Software Development": "development",

    // AI
    "Custom AI Model": "ai",
    "Open Source AI Model": "ai",
    "ML & AI": "ai",

    // Platform
    Mobile: "platform",
    Web: "platform",
    "Cross platform": "platform",
  };

  const getCategoryClass = (category: string) => {
    const group = categoryToGroupMap[category] || "default";
    return `category-tag ${group}-tag`; // returns e.g. "category-tag design-tag"
  };

 const menu = (
  <Menu>
    <Menu.Item key="edit" onClick={onEdit}>
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <EditOutlined />
        Edit
      </span>
    </Menu.Item>
    <Menu.Item key="pause" onClick={onPause}>
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <PauseCircleOutlined />
        Pause
      </span>
    </Menu.Item>
    <Menu.Item key="delete" onClick={onDelete}>
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <DeleteOutlined />
        Delete
      </span>
    </Menu.Item>
  </Menu>
);

  return (
    <div className="ProjectCardDisplay">
      <div className="project-card-header">
        <p className="Project-heading-titlwe">Select Project</p>
        <img
          src={
            checked
              ? "/Images/Project/checked.svg"
              : "/Images/Project/unchecked.svg"
          }
          alt={checked ? "Checked" : "Unchecked"}
          style={{ cursor: "pointer" }}
          onClick={onToggleCheck}
        />
      </div>

      <div className="Project-Bottom-card">
        <img className="projectImageMain" src={image} alt={title} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <p className="ProjectCategoryMain">{mainCategory}</p>
            <Dropdown overlay={menu} trigger={["click"]}>
              <img
                src="/Images/Project/moreInfo.svg"
                alt="More Info"
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
          </div>

          <p className="ProjectMain-Name">{title}</p>

          <div className="category-Main-wraps">
            {categories.map((category: string, index: number) => (
              <p key={index} className={getCategoryClass(category)}>
                {category}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
