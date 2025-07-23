import "./AddVideoTest.css";
import { useNavigate } from "react-router-dom";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useState, useEffect } from "react";
import { Upload, Switch } from "antd";
import type { UploadFile } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import client from "../../../../utils/axios";
import { useParams } from "react-router-dom";
import { message } from "antd";
import LoadingSpinner from "../../../../components/ui/LoaderSpinner";
const AddVideoTestimonial = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams(); // <-- Get ID from URL
  const isEditMode = !!id;
  const [liveStatus, setLiveStatus] = useState("");
  const [logoFile, setLogoFile] = useState<any>(null);
  const [shouldList, setShouldList] = useState(true);
  const [clientName, setClientName] = useState("");
  const [designation, setDesignation] = useState("");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [iosLink, setIosLink] = useState("");
  const [androidLink, setAndroidLink] = useState("");
  const [starsGiven, setStarsGiven] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleSubmit = async () => {
    if (!clientName.trim()) {
      return message.warning("Client name is required.");
    }
    if (!designation.trim()) {
      return message.warning("Designation is required.");
    }
    if (!projectName.trim()) {
      return message.warning("Project name is required.");
    }
    if (!description.trim()) {
      return message.warning("Description is required.");
    }
    if (!liveStatus) {
      return message.warning("Please select a Live Status.");
    }
    if (!starsGiven || Number(starsGiven) < 1 || Number(starsGiven) > 5) {
      return message.warning("Please provide stars between 1 and 5.");
    }
    if (!logoFile && !videoUrl) {
      return message.warning("Please upload a video.");
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("clientName", clientName);
      formData.append("designation", designation);
      formData.append("projectName", projectName);
      formData.append("liveStatus", liveStatus);
      formData.append("description", description);
      formData.append("websiteLink", websiteLink);
      formData.append("iosLink", iosLink);
      formData.append("androidLink", androidLink);
      formData.append("stars", starsGiven);
      formData.append("listOnWebsite", shouldList.toString());

      if (logoFile) formData.append("video", logoFile);

      if (isEditMode) {
        await client.put(
          `/videoTestimonial/update-video-testimonial/${id}`,
          formData
        );
        message.success("Testimonial updated successfully");
      } else {
        await client.post(`/videoTestimonial/add-video-testimonial`, formData);
        message.success("Testimonial added successfully");
      }
      navigate("/testimonials"); // change path if needed
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Something went wrong while submitting the testimonial";
      message.error(msg);
    } finally {
      setIsSubmitting(false); // Stop loader
    }
  };

  const handleLogoChange = (info: UploadChangeParam<UploadFile<any>>) => {
    setLogoFile(info.file);
  };

  useEffect(() => {
    if (isEditMode) {
      client
        .get(`/videoTestimonial/view-video-testimonial/${id}`)
        .then((res) => {
          const data = res.data.result;
          setClientName(data.clientName);
          setDesignation(data.designation);
          setProjectName(data.projectName);
          setLiveStatus(data.liveStatus);
          setDescription(data.description);
          setWebsiteLink(data.websiteLink || "");
          setIosLink(data.iosLink || "");
          setAndroidLink(data.androidLink || "");
          setStarsGiven(data.stars.toString());
          setShouldList(data.listOnWebsite);
          setVideoUrl(data.videoUrl || "");
        })
        .catch((err) => {
          console.error("Failed to fetch testimonial", err);
          message.error("Failed to load testimonial data");
        });
    }
  }, [id]);
  return (
    <>
      {isSubmitting && <LoadingSpinner isLoading={true} />}
      <div className="Add-video-testimonial">
        <p className="Project-add-heading">Video Testimonial</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button className="BackNavigation" onClick={() => navigate(-1)}>
              <img src="/Images/Project/back.svg" alt="Back" className="BackArrow"/>
              Back
            </button>
            <div style={{ display: "flex", gap: "8px" }}>
              <p className="ProjectNavigationhead">Testimonials</p>
              <p className="ProjectNavigationhead">|</p>
              <p className="ProjectNavigationheaddetails">Details</p>
            </div>
          </div>

          <div className="add-video-form">
            {/* Row 1 */}
            <div className="add-video-top-line">
              <div className="add-video-test-container">
                <p className="client-name-paraa">Client Name</p>
                <input
                  className="client-naMe-Input"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="add-video-test-container">
                <p className="client-name-paraa">Designation</p>
                <input
                  className="client-naMe-Input"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="add-video-top-line">
              <div className="add-video-test-container">
                <p className="client-name-paraa">Project Name</p>
                <input
                  className="client-naMe-Input"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="add-video-test-container">
                <p className="client-name-paraa">Live Status</p>
                <FormControl fullWidth sx={{ m: 0 }}>
                  <Select
                    labelId="live-status-label"
                    id="live-status"
                    value={liveStatus}
                    onChange={(e) => setLiveStatus(e.target.value)}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      backgroundColor: "#fff",
                      height: "48px",
                      borderRadius: "8px",
                      border: "1px solid #D0D5DD",
                    }}
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Description */}
            <div className="add-video-test-container">
              <p className="client-name-paraa">Description</p>
              <textarea
                className="client-naMe-Input-description fixed-textarea"
                placeholder="Tell us a little about the project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Row 3 */}
            <div className="add-video-top-line">
              <div className="add-video-test-container">
                <p className="client-name-paraa">Website Link</p>
                <input
                  className="client-naMe-Input"
                  value={websiteLink}
                  onChange={(e) => setWebsiteLink(e.target.value)}
                />
              </div>
              <div className="add-video-test-container">
                <p className="client-name-paraa">iOS Link</p>
                <input
                  className="client-naMe-Input"
                  value={iosLink}
                  onChange={(e) => setIosLink(e.target.value)}
                />
              </div>
              <div className="add-video-test-container">
                <p className="client-name-paraa">Android Link</p>
                <input
                  className="client-naMe-Input"
                  value={androidLink}
                  onChange={(e) => setAndroidLink(e.target.value)}
                />
              </div>
            </div>

            {/* Upload */}
            <div className="add-video-top-line">
              <div className="add-video-test-container">
                <p className="client-name-paraa">Stars Given</p>
                <input
                  type="number"
                  className="client-naMe-Input"
                  value={starsGiven}
                  min={1}
                  max={5}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setStarsGiven(""); // allow clearing the input
                    } else {
                      const numberValue = Number(value);
                      if (numberValue >= 1 && numberValue <= 5) {
                        setStarsGiven(value);
                      }
                    }
                  }}
                />
              </div>
              <div className="add-video-test-container">
                <p className="add-form-title">Upload Video</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <Upload
                   accept="video/*"
                    showUploadList={false}
                    onChange={handleLogoChange}
                    fileList={logoFile ? [logoFile] : []}
                    beforeUpload={() => false}
                  >
                    {!logoFile && videoUrl && (
                      <div  style={{
                          width: "200px",
                          height: "150px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px dashed #ccc",
                          position: "relative",
                          marginBottom:"10px",
                        }}>
                      <video
                        src={videoUrl}
                        controls
                        width="100%"
                        style={{
                          maxWidth: "100%",
                          height:"100%",
                          borderRadius: "8px",
                          backgroundColor: "#000",
                        }}
                      />
                      </div>
                    )}

                    <button className="Upload-button-reuable">
                      <img
                        style={{ width: "24px", height: "24px" }}
                        src="/Images/Project/Cloud-Upload.svg"
                        alt="upload"
                      />
                      Upload
                    </button>
                  </Upload>

                  {logoFile && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <p className="selectedFileName">{logoFile.name}</p>
                      <span
                        style={{
                          cursor: "pointer",
                          color: "#344054",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                        onClick={() => setLogoFile(null)}
                      >
                        ×
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className="add-video-test-container"
              style={{ display: "flex", gap: "12px", flexDirection: "column" }}
            >
              <p className="add-form-title" style={{ marginBottom: 0 }}>
                List on Website
              </p>
              <Switch
                style={{ width: "50px" }}
                checked={shouldList}
                onChange={(checked) => setShouldList(checked)}
              />
            </div>
            <button className="video-testimonial-button" onClick={handleSubmit}>
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddVideoTestimonial;
