import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogTable from "./BlogTable";
const Blogs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <>
      <div className="FAQ-CONTAINER">
        <div className="FAQ-VIEW-HEADER">
          <p className="Project-Dashboard-heading">Blogs</p>

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
              onClick={() => navigate("/add-Blog")}
            >
              Add Blog
            </button>
          </div>
        </div>
     <BlogTable searchQuery={searchQuery} />
      </div>
    </>
  );
};

export default Blogs;
