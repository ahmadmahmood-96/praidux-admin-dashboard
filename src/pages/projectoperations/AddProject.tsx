import { useState } from "react";
import "./AddProject.css";
import { Select } from "antd";
import { Upload, Switch, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import client from "../../utils/axios";
import LoadingSpinner from "../../components/ui/LoaderSpinner";
const { Option } = Select;
const AddProject = () => {
  const navigate = useNavigate();
  const [mainCategory, setMainCategory] = useState("Mobile App");
  const [selectedDesign, setSelectedDesign] = useState("");
  const [selectedDevelopment, setSelectedDevelopment] = useState("");
  const [selectedAI, setSelectedAI] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [logoFile, setLogoFile] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [imageFiles, setImageFiles] = useState<any[]>([]);
  const [shouldList, setShouldList] = useState(true);
  const [title, setTitle] = useState("");
  const [projectclient, setProjectClient] = useState("");
  const [duration, setDuration] = useState("");
  const [downloads, setDownloads] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();
  const { mutate: submitProject, isLoading } = useMutation(
    async () => {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("mainCategory", mainCategory);
      formData.append("client", projectclient);
      formData.append("duration", duration);
      formData.append("downloads", downloads);
      formData.append("description", description);
      formData.append("listOnWebsite", shouldList.toString());

      const selectedCategories = [
        selectedDesign,
        selectedDevelopment,
        selectedAI,
        selectedPlatform,
      ].filter(Boolean);

      selectedCategories.forEach((cat) => formData.append("categories", cat));

      if (logoFile) {
        formData.append("logo", logoFile);
        console.log("✅ Logo file added:", logoFile);
      } else {
        console.log("❌ No logo file selected");
      }

      if (videoFile) {
        formData.append("video", videoFile);
      }

      imageFiles.forEach((fileObj) => {
        if (fileObj.originFileObj) {
          formData.append("images", fileObj.originFileObj);
        }
      });

      // Send with centralized axios client
      const response = await client.post("/project/add-project", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e: any) => {
          const percent = Math.round((e.loaded * 100) / (e.total || 1));
          console.log("Upload Progress:", percent + "%");
        },
      });

      return response.data;
    },
    {
      onSuccess: () => {
        message.success("Project added successfully");
        queryClient.invalidateQueries(["AllProjects"]);
        navigate("/projects");
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          "Something went wrong while uploading";
        message.error(msg);
      },
    }
  );
  const validateFormSequentially = () => {
    if (!projectclient.trim()) {
      message.warning("Please enter the Client name");
      return false;
    }

    if (!title.trim()) {
      message.warning("Please enter the Title");
      return false;
    }

    if (!duration.trim()) {
      message.warning("Please enter the Duration");
      return false;
    }

    if (!downloads.trim()) {
      message.warning("Please enter Downloads / Visitors");
      return false;
    }

    if (!description.trim()) {
      message.warning("Please enter the Description");
      return false;
    }

    if (!logoFile) {
      message.warning("Please upload a Project Logo");
      return false;
    }

    if (imageFiles.length === 0) {
      message.warning("Please upload at least one Project Image");
      return false;
    }
    if (
      !selectedDesign &&
      !selectedDevelopment &&
      !selectedAI &&
      !selectedPlatform
    ) {
      message.warning(
        "Please select at least one category (Design, Development, AI, or Platform)"
      );
      return false;
    }

    return true;
  };

  const renderOption = (
    group: string,
    value: string,
    selected: string,
    setSelected: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <div
      key={value}
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={() => {
        console.log(`Selected category from ${group}:`, value);
        setSelected(value);
      }}
    >
      <div className={`custom-checkbox ${selected === value ? "checked" : ""}`}>
        {selected === value && (
          <img
            src="/Images/Project/check_small.png"
            alt="checked"
            style={{ width: 20, height: 20 }}
          />
        )}
      </div>

      <p className="categories-selection-form-chechfield-title">{value}</p>
    </div>
  );
  const handleLogoChange = (info: any) => {
    console.log("handleLogoChange:", info); // Add this line
    if (info.file.status !== "removed") {
      console.log("Logo file set:", info.file);
      setLogoFile(info.file);
    } else {
      setLogoFile(null);
    }
  };

  const handleVideoChange = (info: any) => {
    if (info.file.status !== "removed") setVideoFile(info.file);
    else setVideoFile(null);
  };

  const handleImagesChange = ({ fileList }: any) => {
    setImageFiles(fileList);
  };

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <div className="Add-Project-Container">
        <p className="Project-add-heading">Projects</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button className="BackNavigation" onClick={() => navigate(-1)}>
              <img src="/Images/Project/back.svg" alt="Back" />
              Back
            </button>
            <div style={{ display: "flex", gap: "8px" }}>
              <p className="ProjectNavigationhead">Project</p>
              <p className="ProjectNavigationhead">|</p>
              <p className="ProjectNavigationheaddetails">Details</p>
            </div>
          </div>
          <div className="AddProject-formContainer">
            <div className="Form-fields-row">
              <div className="Add-project-container-input1">
                <p className="add-form-title">Title</p>
                <input
                  className="DD-FORM-INPUT-FIELD"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="Add-project-container-input1">
                <p className="add-form-title">Main Category</p>
                <Select
                  value={mainCategory}
                  onChange={(value) => setMainCategory(value)}
                  placeholder="Mobile App"
                  className="search-FORM-INPUT-FIELD"
                  dropdownStyle={{ fontFamily: "Albert Sans" }}
                  bordered={false} // removes Antd's default border
                  style={{ width: "100%" }}
                  size="large"
                >
                  <Option value="Mobile App">Mobile App</Option>
                  <Option value="Web">Web</Option>
                  <Option value="iOS">iOS</Option>
                </Select>
              </div>
            </div>
            <div className="Form-fields-row">
              <div className="Add-project-container-input1">
                <p className="add-form-title">Client</p>
                <input
                  className="DD-FORM-INPUT-FIELD"
                  placeholder="Client"
                  value={projectclient}
                  onChange={(e) => setProjectClient(e.target.value)}
                />
              </div>
              <div className="Add-project-container-input1">
                <p className="add-form-title">Duration</p>
                <input
                  className="DD-FORM-INPUT-FIELD"
                  placeholder="Duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
            <div className="Form-fields-row">
              <div className="Add-project-container-input1">
                <p className="add-form-title">Downloads / Visitors</p>
                <input
                  className="DD-FORM-INPUT-FIELD"
                  placeholder="Downloads"
                  value={downloads}
                  onChange={(e) => setDownloads(e.target.value)}
                />
              </div>
              <div className="Add-project-container-input1">
                {/* <p className="add-form-title">Duration</p>
                <input className="DD-FORM-INPUT-FIELD" placeholder="Duration" /> */}
              </div>
            </div>
            <div className="Form-fields-row">
              <div className="Form-option-row">
                <div className="categories-selection-add-form">
                  <p className="categories-selection-form-title">Design</p>
                  {["UIUX Design", "Wireframe", "User research"].map((value) =>
                    renderOption(
                      "Design",
                      value,
                      selectedDesign,
                      setSelectedDesign
                    )
                  )}
                </div>
                <div className="categories-selection-add-form">
                  <p className="categories-selection-form-title">Development</p>
                  {[
                    "Mobile Development",
                    "Web Development",
                    "Software Development",
                  ].map((value) =>
                    renderOption(
                      "Development",
                      value,
                      selectedDevelopment,
                      setSelectedDevelopment
                    )
                  )}
                </div>
              </div>
              <div className="Form-option-row">
                <div className="categories-selection-add-form">
                  <p className="categories-selection-form-title">AI</p>
                  {["Custom AI Model", "Open Source AI Model", "ML & AI"].map(
                    (value) =>
                      renderOption("AI", value, selectedAI, setSelectedAI)
                  )}
                </div>
                <div className="categories-selection-add-form">
                  <p className="categories-selection-form-title">Platform</p>
                  {["Mobile", "Web", "Cross platform"].map((value) =>
                    renderOption(
                      "Platform",
                      value,
                      selectedPlatform,
                      setSelectedPlatform
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="Form-fields-row">
              {/* Project Logo */}
              <div className="Add-project-container-input1">
                <p className="add-form-title">Project Logo</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <Upload
                    showUploadList={false}
                    onChange={handleLogoChange}
                    fileList={logoFile ? [logoFile] : []}
                    beforeUpload={(file) => {
                      const isAllowedType = [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                        "image/webp",
                      ].includes(file.type);
                      if (!isAllowedType) {
                        message.error(
                          "Only JPG, PNG, GIF, and WEBP images are allowed"
                        );
                        return Upload.LIST_IGNORE; // Prevent file from being added
                      }
                      return false; // Prevent auto-upload
                    }}
                  >
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

              {/* Project Video */}
              <div className="Add-project-container-input1">
                <p className="add-form-title">Project Video</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <Upload
                    showUploadList={false}
                      accept="video/*"
                    onChange={handleVideoChange}
                    fileList={videoFile ? [videoFile] : []}
                    beforeUpload={() => false}
                  >
                    <button className="Upload-button-reuable">
                      <img
                        style={{ width: "24px", height: "24px" }}
                        src="/Images/Project/Cloud-Upload.svg"
                        alt="upload"
                      />
                      Upload
                    </button>
                  </Upload>

                  {videoFile && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <p className="selectedFileName">{videoFile.name}</p>
                      <span
                        style={{
                          cursor: "pointer",
                          color: "#344054",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                        onClick={() => setVideoFile(null)}
                      >
                        ×
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="Add-project-container-input1">
              <p className="add-form-title">Project Images</p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Upload
                  multiple
                  //   listType="picture-card"
                  onChange={handleImagesChange}
                  fileList={imageFiles}
                  beforeUpload={(file) => {
                    const isAllowedType = [
                      "image/jpeg",
                      "image/png",
                      "image/gif",
                      "image/webp",
                    ].includes(file.type);
                    if (!isAllowedType) {
                      message.error(
                        "Only JPG, PNG, GIF, and WEBP images are allowed"
                      );
                      return Upload.LIST_IGNORE; // Prevent file from being added
                    }
                    return false; // Prevent auto-upload
                  }}
                >
                  <div
                    className="Upload-button-reuable"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      style={{ width: "24px", height: "24px" }}
                      src="/Images/Project/Cloud-Upload.svg"
                      alt="upload"
                    />
                    Upload
                  </div>
                </Upload>

                {imageFiles.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    {imageFiles.map((file, index) => {
                      const preview =
                        file.thumbUrl ||
                        URL.createObjectURL(file.originFileObj);

                      return (
                        <div
                          key={file.uid || index}
                          style={{
                            position: "relative",
                            width: "100px",
                            height: "100px",
                            border: "1px dashed #ccc",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={preview}
                            alt={file.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <span
                            onClick={() => {
                              const updated = [...imageFiles];
                              updated.splice(index, 1);
                              setImageFiles(updated);
                            }}
                            style={{
                              position: "absolute",
                              top: "4px",
                              right: "6px",
                              background: "#fff",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                          >
                            ×
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="Add-project-container-input1">
              <p className="add-form-title">How can we help?</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="DD-FORM-INPUT-FIELD fixed-textarea"
                placeholder="Tell us a little about the project..."
                rows={4} // You can increase/decrease rows as needed
              />
            </div>

            <div
              className="Add-project-container-input"
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
            <div style={{ textAlign: "right", marginTop: 24 }}>
              <button
                className="ButonSubmit"
                onClick={() => {
                  const isValid = validateFormSequentially();
                  if (isValid) {
                    submitProject();
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="dots-loader">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProject;
