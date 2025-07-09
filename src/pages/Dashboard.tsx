import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../utils/axios";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/ui/LoaderSpinner";
import "./dashboard.css";
import { message } from "antd";
import ProjectCard from "../components/projectCard/projectCardDisplay";
import { ConfirmModal } from "../components/ui/index.tsx";
const Dashboard = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  const categoryMap: { [key: string]: string } = {
    All: "All",
    Mobile: "Mobile App",
    Web: "Web",
    IOS: "IOS",
  };

  const fetchProjects = async () => {
    const { data } = await client.get("/project/view-projects");
    console.log("result of Project", data.result);
    return data.result;
  };

  const toggleCheck = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = (id?: string) => {
    const idsToDelete = id ? [id] : selectedIds;

    ConfirmModal({
      className: "delete-modal",
      title: "Delete Project",
      content: "Are you sure you want to delete the selected project?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await Promise.all(
            idsToDelete.map((projectId) =>
              client.delete(`/project/delete-project/${projectId}`)
            )
          );
          console.log("Deleted:", idsToDelete);
          setSelectedIds([]);
          await refetch();
        } catch (error) {
          console.error("Failed to delete:", error);
        }
      },
      onCancel: () => {
        console.log("Delete cancelled");
      },
      okButtonProps: {
        className: "orange-button", // 👈 Add your class here
      },
    });
  };

  const handlePause = async (id?: string) => {
    const idsToPause = id ? [id] : selectedIds;

    try {
      await Promise.all(
        idsToPause.map((projectId) =>
          client.put(`/project/update-list-status/${projectId}`, {
            listOnWebsite: false,
          })
        )
      );
      message.success("Project paused.");
      setSelectedIds([]);
      await refetch();
    } catch (err) {
      console.error("Pause error:", err);
      message.error("Failed to pause project(s).");
    }
  };

  const {
    data: projects = [],
    isLoading,
    // isError,
    refetch,
  } = useQuery(["AllProjects"], fetchProjects);
  const filteredProjects = projects.filter((proj: any) => {
    const matchesCategory =
      categoryMap[selectedCategory] === "All" ||
      proj.mainCategory === categoryMap[selectedCategory];

    const matchesSearch = proj.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (isLoading) return <LoadingSpinner isLoading={true} />;
  return (
    <>
      {/* <LoadingSpinner isLoading={isLoading} /> */}
      
      <div className="Dashboard-container-Main">
        <div className="Dashboard-container-Main-header">
          <div
            style={{ display: "flex", gap: "16px", alignItems: "center" }}
            className="top-later"
          >
            <p className="Project-Dashboard-heading">Projects</p>
            <div className="button-categories-project">
              {Object.keys(categoryMap).map((label, index) => (
                <button
                  key={label}
                  className={`category-button ${
                    selectedCategory === label ? "selected" : ""
                  } ${index === 0 ? "first" : ""} ${
                    index === Object.keys(categoryMap).length - 1 ? "last" : ""
                  }`}
                  onClick={() => setSelectedCategory(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }} className="addsearch">
            <div className="search-project-main-div">
              <img src="/Images/Project/search.svg" alt="search" />
              <input
                placeholder="Search here..."
                className="Search-project"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <img src="/Images/Project/SearchKey.svg" alt="search" />
            </div>
            <button
              className="Add-projectbutton"
              onClick={() => navigate("add-project")}
            >
              Add Project
            </button>
          </div>
        </div>
        {selectedIds.length > 0 && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              gap: "10px",
            }}
          >
            <button className="Add-projectbutton" onClick={() => handlePause()}>
              Pause
            </button>
            <button
              className="Add-projectbutton"
              onClick={() => handleDelete()}
            >
              Delete
            </button>
          </div>
        )}
        <div className="project-card-containers">
          {filteredProjects.map((project: any) => (
            <ProjectCard
              key={project._id}
              title={project.title}
              mainCategory={project.mainCategory}
              categories={project.categories}
              image={project.logo}
              checked={selectedIds.includes(project._id)}
              onToggleCheck={() => toggleCheck(project._id)}
              onMoreInfo={() => console.log("More info about:", project._id)}
              onDelete={() => handleDelete(project._id)}
              onPause={() => handlePause(project._id)}
              onEdit={() => navigate(`/update-project/${project._id}`)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
