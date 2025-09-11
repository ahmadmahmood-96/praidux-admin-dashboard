import { useState, useEffect } from "react";
import "./AddProject.css";
import { Select } from "antd";
import { Upload, Switch, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import client from "../../utils/axios";
import type { UploadChangeParam } from "antd/es/upload";
import { useMutation, useQueryClient } from "react-query";
import LoadingSpinner from "../../components/ui/LoaderSpinner";
const { Option } = Select;
const UpdateProject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [imagesChanged, setImagesChanged] = useState(false);

  const { data: project, isLoading } = useQuery(
    ["ProjectById", id],
    async () => {
      const res = await client.get(`/project/view-project/${id}`);
      return res.data.result;
    }
  );
  const updateProjectMutation = useMutation(
    async (formData: FormData) => {
      return await client.put(`/project/update-project/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    {
      onSuccess: () => {
        message.success("Project updated successfully!");
        queryClient.invalidateQueries(["ProjectById", id]); // optional: refresh data
        navigate("/projects");
      },
      onError: (error) => {
        console.error("Update error:", error);
        message.error("Failed to update project.");
      },
    }
  );

  // After your useQuery()
  const [mainCategory, setMainCategory] = useState("Mobile App");
  const [selectedDesign, setSelectedDesign] = useState("");
  const [selectedDevelopment, setSelectedDevelopment] = useState("");
  const [selectedAI, setSelectedAI] = useState("");
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [logoFile, setLogoFile] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [imageFiles, setImageFiles] = useState<any[]>([]);
  const [shouldList, setShouldList] = useState(false);
  const [title, setTitle] = useState("");
  const [projectclient, setProjectClient] = useState("");
  const [duration, setDuration] = useState("");
  const [downloads, setDownloads] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setMainCategory(project.mainCategory || "Mobile App");
      setProjectClient(project.client || "");
      setDuration(project.duration || "");
      setDownloads(project.downloads || "");
      setDescription(project.description || "");
      setShouldList(project.listOnWebsite || false);

      // Categories
      setSelectedDesign(
        project.categories?.find((c: string) =>
          ["UIUX Design", "Wireframe", "User research"].includes(c)
        ) || ""
      );

      setSelectedDevelopment(
        project.categories?.find((c: string) =>
          [
            "Mobile Development",
            "Web Development",
            "Software Development",
          ].includes(c)
        ) || ""
      );

      setSelectedAI(
        project.categories?.find((c: string) =>
          ["Custom AI Model", "Open Source AI Model", "ML & AI"].includes(c)
        ) || ""
      );

      setSelectedPlatform(
        project.categories?.find((c: string) =>
          ["Mobile", "Web", "Cross platform"].includes(c)
        ) || ""
      );

      // Logo
      if (project.logo) {
        setLogoFile({
          uid: "logo",
          name: "project_logo.png",
          status: "done",
          url: project.logo,
        });
      }

      // Video
      if (project.video) {
        setVideoFile({
          uid: "video",
          name: "project_video.mp4",
          status: "done",
          url: project.video,
        });
      }

      // Images
      if (project.images?.length > 0) {
        const imgFiles = project.images.map((url: string, index: number) => ({
          uid: `img-${index}`,
          name: `image_${index}.png`,
          status: "done",
          url,
        }));
        setImageFiles(imgFiles);
      }
    }
  }, [project]);

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
    if (info.file.status !== "removed") {
      // Wrap manually to simulate Ant Design’s Upload format
      const wrappedFile = {
        uid: info.file.uid,
        name: info.file.name,
        status: "done",
        originFileObj: info.file, // ✅ wrap here
      };
      setLogoFile(wrappedFile);
    } else {
      setLogoFile(null);
    }
  };

  const handleVideoChange = (info: any) => {
    if (info.file.status !== "removed") {
      const wrappedFile = {
        uid: info.file.uid,
        name: info.file.name,
        status: "done",
        originFileObj: info.file, // ✅ wrap to ensure it's usable in FormData
      };
      setVideoFile(wrappedFile);
    } else {
      setVideoFile(null);
    }
  };
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

  const handleImagesChange = ({ fileList }: UploadChangeParam<any>) => {
    const activeFiles = fileList.filter((file) => file.status !== "removed");

    const newUploads = activeFiles.filter((file) => file.originFileObj);
    const existingFiles = imageFiles.filter(
      (file) =>
        file.url && !file.originFileObj && !removedImages.includes(file.url)
    );

    if (newUploads.length > 0) setImagesChanged(true);

    setImageFiles([...existingFiles, ...newUploads]);
  };

  const handleRemoveImage = (fileToRemove: any) => {
    if (fileToRemove.url && !fileToRemove.originFileObj) {
      // Existing image - mark for removal from backend
      setRemovedImages((prev) => [...prev, fileToRemove.url]);
    }

    // Remove from UI immediately
    setImageFiles((prev) =>
      prev.filter((file) => file.uid !== fileToRemove.uid)
    );

    // Mark that images have changed
    setImagesChanged(true);
  };

  const submitProject = async () => {
    const isValid = validateFormSequentially();
    if (!isValid) return;
    const formData = new FormData();

    // ✅ Text fields
    formData.append("title", title);
    formData.append("mainCategory", mainCategory);
    formData.append("client", projectclient);
    formData.append("duration", duration);
    formData.append("downloads", downloads);
    formData.append("description", description);
    formData.append("listOnWebsite", shouldList.toString());

    // ✅ Categories
    const categories = [
      selectedDesign,
      selectedDevelopment,
      selectedAI,
      selectedPlatform,
    ].filter(Boolean);
    categories.forEach((cat) => formData.append("categories", cat));

    // ✅ Logo
    if (
      logoFile?.originFileObj instanceof File ||
      logoFile?.originFileObj instanceof Blob
    ) {
      formData.append("logo", logoFile.originFileObj);
    } else if (logoFile?.url) {
      formData.append("existingLogo", logoFile.url);
    }

    // ✅ Video
    if (
      videoFile?.originFileObj instanceof File ||
      videoFile?.originFileObj instanceof Blob
    ) {
      formData.append("video", videoFile.originFileObj);
    } else if (videoFile?.url) {
      formData.append("existingVideo", videoFile.url);
    } else {
      formData.append("removeVideo", "true");
    }

    formData.append("imagesChanged", imagesChanged.toString());

    // ✅ Existing images
    imageFiles.forEach((file) => {
      if (file.url && !file.originFileObj) {
        formData.append("existingImages", file.url); // ✅ send URLs
      }
    });

    // ✅ New uploaded images
    imageFiles.forEach((file) => {
      if (file.originFileObj) {
        formData.append("images", file.originFileObj); // ✅ send File/Blob
      }
    });

    // ✅ Removed image URLs
    removedImages.forEach((url) => {
      formData.append("removedImages[]", url);
    });

    updateProjectMutation.mutate(formData);
  };
  return (
    <>
      <LoadingSpinner
        isLoading={isLoading || updateProjectMutation.isLoading}
      />
      <div className="Add-Project-Container">
        <p className="Project-add-heading">Projects</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button className="BackNavigation" onClick={() => navigate(-1)}>
              <img
                src="/Images/Project/back.svg"
                alt="Back"
                className="BackArrow"
              />
              Back
            </button>
            <div style={{ display: "flex", gap: "8px" }}>
              <p className="ProjectNavigationhead">Project</p>
              <p className="ProjectNavigationhead">|</p>
              <p className="ProjectNavigationheaddetails">View</p>
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
                      const isLt15MB = file.size / 1024 / 1024 <= 15;
                      if (!isLt15MB) {
                        message.error("Image must be smaller than 15MB!");
                        return Upload.LIST_IGNORE;
                      }
                      return false; // Prevent auto-upload
                    }}
                    showUploadList={false}
                    onChange={handleLogoChange}
                    fileList={logoFile ? [logoFile] : []}
                    onRemove={handleRemoveImage}
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
                        gap: "12px",
                        marginTop: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px dashed #ccc",
                          position: "relative",
                        }}
                      >
                        <img
                          src={
                            logoFile.originFileObj
                              ? URL.createObjectURL(logoFile.originFileObj)
                              : logoFile.url
                          }
                          alt="Project Logo"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <span
                          onClick={() => setLogoFile(null)}
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
                    accept="video/*"
                    showUploadList={false}
                    onChange={handleVideoChange}
                    fileList={videoFile ? [videoFile] : []}
                    beforeUpload={(file) => {
                      const isLt50MB = file.size / 1024 / 1024 <= 50;
                      if (!isLt50MB) {
                        message.error("Video must be smaller than 50MB!");
                        return Upload.LIST_IGNORE; // 🚫 Prevent adding file
                      }
                      return false; // ✅ Prevent auto-upload
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

                  {videoFile && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginTop: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "200px",
                          height: "150px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px dashed #ccc",
                          position: "relative",
                        }}
                      >
                        <video
                          src={
                            videoFile.originFileObj
                              ? URL.createObjectURL(videoFile.originFileObj)
                              : videoFile.url
                          }
                          controls
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <span
                          onClick={() => setVideoFile(null)}
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
                    const isLt15MB = file.size / 1024 / 1024 <= 15;
                    if (!isLt15MB) {
                      message.error(`${file.name} must be smaller than 15MB!`);
                      return Upload.LIST_IGNORE; // 🚫 Block oversized file
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
                      const preview = (() => {
                        try {
                          if (
                            file.originFileObj &&
                            file.originFileObj instanceof Blob
                          )
                            return URL.createObjectURL(file.originFileObj);

                          return file.url || "";
                        } catch (err) {
                          console.error("Preview error", err, file);
                          return "";
                        }
                      })();

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
                            onClick={() => handleRemoveImage(file)}
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
                onClick={() => submitProject()}
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

export default UpdateProject;
