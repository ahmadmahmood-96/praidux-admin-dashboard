import "./staticTestimonial.css";
import StaticTestimonialCard from "./statictestCard";
import { useQuery } from "react-query";
import client from "../../../utils/axios";
import LoadingSpinner from "../../../components/ui/LoaderSpinner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ConfirmModal } from "../../../components/ui";
import { message } from "antd";

const fetchStaticTestimonials = async () => {
  const res = await client.get("/staticTestimonial/view-static-testimonials");
  return res.data.result;
};

const StaticTestimonial = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const {
    data: testimonials,
    isLoading,
    isError,
    refetch,
  } = useQuery("staticTestimonials", fetchStaticTestimonials);

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
              client.delete(`/staticTestimonial/delete-static-testimonial/${id}`)
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
          client.put(`/staticTestimonial/update-static-list-status/${id}`, {
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

  const handleCardAction = (
    id: string,
    action: "edit" | "pause" | "delete"
  ) => {
    switch (action) {
      case "edit":
        navigate(`/add-static-testimonial/${id}`);
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

  if (isLoading) return <LoadingSpinner isLoading={true} />;
  if (isError) return <p>Error fetching testimonials</p>;

  return (
    <div className="Static-Testimonial-containers">
      <p className="static-test-heading">Static Testimonials</p>

      {selectedIds.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            justifyContent: "end",
            marginBottom: "16px",
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

      <div className="static-containers-stat">
        {testimonials.map((testimonial: any) => (
          <StaticTestimonialCard
            key={testimonial._id}
            data={testimonial}
            checked={selectedIds.includes(testimonial._id)}
            onToggleCheck={() => toggleCheck(testimonial._id)}
            onAction={handleCardAction}
          />
        ))}
      </div>
    </div>
  );
};

export default StaticTestimonial;
