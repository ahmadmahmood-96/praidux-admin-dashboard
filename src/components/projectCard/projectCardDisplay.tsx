import React from "react";
import { Dropdown, Menu } from "antd";
import "./ProjectCard.css";

const ProjectCard = ({
  title,
  mainCategory,
  categories,
  image,
  checked,
  onToggleCheck,
  onMoreInfo,
  onDelete,
  onPause,
  onEdit,
}: any) => {
  const getCategoryClass = (category: string) => {
    const map: Record<string, string> = {
      UIUX: "UIUX-CATEGORY",
      "Software Development": "Software-Development-CATEGORY",
      "AI ML": "AIML-CATEGORY",
      "Cross Platform": "CROSS-CATEGORY",
    };
    return map[category] || "default-category";
  };

  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={onEdit}>
        Edit
      </Menu.Item>
      <Menu.Item key="pause" onClick={onPause}>
        Pause
      </Menu.Item>
      <Menu.Item key="delete" onClick={onDelete}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="ProjectCardDisplay">
      <div className="project-card-header">
        <p className="Project-heading-titlwe">{title}</p>
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
