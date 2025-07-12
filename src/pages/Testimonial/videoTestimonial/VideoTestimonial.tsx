import "./videoTestimonial.css";
import VideoTestCard from "./videotestCard";
import { useQuery } from "react-query";
import client from "../../../utils/axios";
import LoadingSpinner from "../../../components/ui/LoaderSpinner";
import { useState } from "react";
import { ConfirmModal } from "../../../components/ui/index";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
const fetchTestimonials = async () => {
  const res = await client.get("/videoTestimonial/view-video-testimonials");
  return res.data.result;
};

const VideoTestimonial = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const toggleCheck = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

const handleDelete = async (id?: string) => {
  const idsToDelete = id ? [id] : selectedIds;

  ConfirmModal({
    className: "delete-modal",
    title: "Delete Testimonial",
    content: "Are you sure you want to delete the selected testimonial(s)?",
    okText: "Delete",
    cancelText: "Cancel",
    onOk: async () => {
      try {
        await Promise.all(
          idsToDelete.map((id) =>
            client.delete(`/videoTestimonial/delete-video-testimonial/${id}`)
          )
        );
        message.success("Deleted successfully.");
        setSelectedIds([]);
        await refetch();
      } catch (err) {
        console.error("Delete failed", err);
        message.error("Failed to delete.");
      }
    },
  });
};

const handlePause = async (id?: string) => {
  const idsToPause = id ? [id] : selectedIds;

  try {
    await Promise.all(
      idsToPause.map((id) =>
        client.put(`/videoTestimonial/update-video-status/${id}`, {
          listOnWebsite: false,
        })
      )
    );
    message.success("Paused successfully.");
    setSelectedIds([]);
    await refetch();
  } catch (err) {
    console.error("Pause failed", err);
    message.error("Failed to pause.");
  }
};


  const {
    data: testimonials,
    isLoading,
    isError,
    refetch,
  } = useQuery("testimonials", fetchTestimonials);

  if (isLoading) return <LoadingSpinner isLoading={true} />;
  if (isError) return <p>Error fetching testimonials</p>;
  const handleCardAction = (
    id: string,
    action: "edit" | "pause" | "delete"
  ) => {
    switch (action) {
      case "edit":
        navigate(`/add-video-testimonial/${id}`);
        break;
      case "pause":
        handlePause(id);
        break;
      case "delete":
        handleDelete(id);
        break;
      default:
        break;
    }
  };

  return (
    <div className="VideoTestimonial-container">
      <p className="vide-testimonial-heading">Video Testimonials</p>

      {selectedIds.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <button className="Add-projectbutton" onClick={() => handlePause()}>
            Pause
          </button>
          <button className="Add-projectbutton" onClick={() => handleDelete()}>
            Delete
          </button>
        </div>
      )}

      <div className="video-testimonila-bottoms">
        {testimonials.map((testimonial: any) => (
          <VideoTestCard
            testimonial={testimonial}
            checked={selectedIds.includes(testimonial._id)}
            onToggleCheck={() => toggleCheck(testimonial._id)}
            onAction={handleCardAction}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoTestimonial;
