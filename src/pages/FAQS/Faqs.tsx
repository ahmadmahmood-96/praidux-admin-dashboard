import { useState } from "react";
import "./faq.css";
import { useNavigate } from "react-router-dom";
import FaqTable from "./faqtable"
const FAQS = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  //   if (isLoading) return <LoadingSpinner isLoading={true} />;
  return (
    <>
      <div className="FAQ-CONTAINER">
        <div className="FAQ-VIEW-HEADER">
          <p className="Project-Dashboard-heading">FAQs</p>

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
              onClick={() => navigate("/add-Faq")}
            >
              Add FAQ
            </button>
          </div>
        </div>
     <FaqTable searchQuery={searchQuery} />

      </div>
    </>
  );
};

export default FAQS;
