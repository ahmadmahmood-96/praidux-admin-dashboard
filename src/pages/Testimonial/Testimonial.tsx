import { useState } from "react";
import "./Testimonial.css";
import VideoTestimonial from "./videoTestimonial/VideoTestimonial";
import StaticTestimonial from "./staticTestimonial/staticTestimonial";
import { useNavigate } from "react-router-dom";
const Testimonials = () => {
  const [selectedCategory, setSelectedCategory] =
    useState("Video Testimonials");
  const navigate = useNavigate();
  const categoryMap: { [key: string]: string } = {
    "Video Testimonials": "Video Testimonials",
    "Image Testimonials": "Image Testimonials",
  };

  return (
    <>
      <div className="testimonial-main-container">
        <div className="testimonial-header">
          <div className="header-right">
            <p className="Testimonial-heading">Testimonials</p>
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
          <div className="header-left-testimonial">
            <button
              className="Add-testimonial-button"
              onClick={() => navigate("/add-video-testimonial")}
            >
              Add Video Testimonial
            </button>
            <button className="Add-testimonial-button"
             onClick={() => navigate("/add-static-testimonial")}>
              Add Static Testimonial
            </button>
          </div>
        </div>

        {/* ✅ Conditional rendering */}
        <div className="testimonial-content">
          {selectedCategory === "Video Testimonials" ? (
            <VideoTestimonial />
          ) : (
            <StaticTestimonial />
          )}
        </div>
      </div>
    </>
  );
};

export default Testimonials;
