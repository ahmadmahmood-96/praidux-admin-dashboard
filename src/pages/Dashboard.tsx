import { useState, ReactNode } from "react";
import { DatePicker, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";

import client from "../utils/axios";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/ui/LoaderSpinner";
import StatsCard from "../components/cards/StatsCard";
import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import DescriptionTitle from "../components/ui/DescriptionTitle";
import "./dashboard.css";
import ProjectCard from "../components/projectCard/projectCardDisplay";
const { RangePicker } = DatePicker;

interface Stats {
  totalVisits: number;
  uniqueVisitors: number;
  startDate?: string;
  endDate?: string;
}

interface StatsCardConfig {
  title: string;
  key: string; // the key from the stats object (e.g. "totalVisits")
  value: number;
  icon: ReactNode;
  iconColor?: string;
}

const fetchVisitStats = async (
  startDate?: string,
  endDate?: string
): Promise<Stats> => {
  try {
    const { data } = await client.get<Stats>("visit/stats", {
      params: {
        startDate,
        endDate,
      },
    });
    return data;
  } catch (err) {
    message.error("Failed to fetch stats");
    throw err;
  }
};

const Dashboard = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
const navigate = useNavigate();

  const toggleCheck = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    console.log("Deleting:", selectedIds);
    // Add your delete API logic here
  };

  const handlePause = () => {
    console.log("Pausing:", selectedIds);
    // Add your pause API logic here
  };
  const dummyProjects = [
    {
      id: "1",
      title: "Gradient Website",
      mainCategory: "Mobile App",
      categories: ["UIUX", "Software Development", "AI ML", "Cross Platform"],
      image: "/Images/Project/projectImg.png",
    },
    {
      id: "2",
      title: "AI Chatbot",
      mainCategory: "AI/ML",
      categories: ["UIUX", "Software Development", "AI ML", "Cross Platform"],
      image: "/Images/Project/projectImg.png",
    },
  ];
  // const { data: stats, isLoading } = useQuery(

  // );

  // const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
  //   if (dates?.[0] && dates?.[1]) {
  //     setDateRange([dates[0], dates[1]]);
  //   } else {
  //     setDateRange(null);
  //   }
  // };

  return (
    <>
      {/* <LoadingSpinner isLoading={isLoading} /> */}
      {/* <div style={{ padding: 24 }}>
        <Row gutter={16} justify="space-between" align="middle">
          <Col>
            <DescriptionTitle
              title="Analytics Overview"
              description="Number of unique and total visitors visited hikar website"
            />
          </Col>
          <Col>
            <RangePicker
              size="large"
              value={dateRange}
              onChange={handleDateChange}
              allowClear
            />
          </Col>
        </Row>

        <Row gutter={16}>
          {statCards.map((card, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={card.key}>
              <StatsCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                iconColor={card.iconColor}
              />
            </Col>
          ))}
        </Row>
      </div> */}
      <div className="Dashboard-container-Main">
        <div className="Dashboard-container-Main-header">
          <div
            style={{ display: "flex", gap: "16px", alignItems: "center" }}
            className="top-later"
          >
            <p className="Project-Dashboard-heading">Projects</p>
            <div className="button-categories-project">
              {["All", "Mobile", "AI ML", "Chatbot"].map((label, index) => (
                <button
                  key={label}
                  className={`category-button ${
                    selectedCategory === label ? "selected" : ""
                  } ${index === 0 ? "first" : ""} ${index === 3 ? "last" : ""}`}
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
              <input placeholder="Search here..." className="Search-project" />
              <img src="/Images/Project/SearchKey.svg" alt="search" />
            </div>
            <button className="Add-projectbutton"
             onClick={() => navigate("add-project")}>
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
            <button className="Add-projectbutton" onClick={handlePause}>
              Pause
            </button>
            <button className="Add-projectbutton" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
        <div className="project-card-containers">
          {dummyProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              mainCategory={project.mainCategory}
              categories={project.categories}
              image={project.image}
              checked={selectedIds.includes(project.id)}
              onToggleCheck={() => toggleCheck(project.id)}
              onMoreInfo={() => console.log("More info about:", project.id)}
              onDelete={() => console.log("Delete")}
              onPause={() => console.log("Pause")}
              onEdit={() => console.log("Edit")}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
