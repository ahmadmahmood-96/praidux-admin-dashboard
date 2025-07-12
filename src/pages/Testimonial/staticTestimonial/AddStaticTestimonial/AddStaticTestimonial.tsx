import "./addstaticTest.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Upload, Switch, message } from "antd";
import type { UploadFile } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import client from "../../../../utils/axios"; // your axios instance
import LoadingSpinner from "../../../../components/ui/LoaderSpinner";
const AddStaticTestimonial = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<any>(null);
  const [clientImageFile, setClientImageFile] = useState<any>(null);
  const [shouldList, setShouldList] = useState(true);
  const { id } = useParams();
  const isEditMode = !!id;

  const [clientName, setClientName] = useState("");
  const [designation, setDesignation] = useState("");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>("");
  const [clientImagePreviewUrl, setClientImagePreviewUrl] =
    useState<string>("");
  console.log(clientImagePreviewUrl);
  console.log(logoPreviewUrl);
  const handleLogoChange = (info: UploadChangeParam<UploadFile<any>>) => {
    console.log("Selected file:", info.file);
    setLogoFile(info.file);
    if (info.file.originFileObj) {
      setLogoPreviewUrl(URL.createObjectURL(info.file.originFileObj));
    }
  };

  const handleClientImageChange = (
    info: UploadChangeParam<UploadFile<any>>
  ) => {
    const file = info.file;
    setClientImageFile(file);
    if (file.originFileObj) {
      setClientImagePreviewUrl(URL.createObjectURL(file.originFileObj));
    }
  };

  useEffect(() => {
    if (isEditMode) {
      client
        .get(`/staticTestimonial/view-static-testimonial/${id}`)
        .then((res) => {
          const data = res.data.result;
          setClientName(data.clientName);
          setDesignation(data.designation);
          setProjectName(data.projectName);
          setDescription(data.description);
          setShouldList(data.listOnWebsite);
          setLogoPreviewUrl(data.projectLogo); // replace with actual field name
          setClientImagePreviewUrl(data.clientImage); // replace with actual field name

          // Do not prefill image files (it's okay UX-wise)
        })
        .catch(() => {
          message.error("Failed to load testimonial");
        });
    }
  }, [id]);
  const handleSubmit = async () => {
    if (!clientName.trim()) {
      message.warning("Please enter Client Name");
      return;
    }
    if (!designation.trim()) {
      message.warning("Please enter Designation");
      return;
    }
    if (!projectName.trim()) {
      message.warning("Please enter Project Name");
      return;
    }
    if (!description.trim()) {
      message.warning("Please enter Description");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("clientName", clientName);
    formData.append("designation", designation);
    formData.append("projectName", projectName);
    formData.append("description", description);
    formData.append("listOnWebsite", shouldList.toString());

    if (logoFile) {
      formData.append("projectLogo", logoFile);
    }

    if (clientImageFile) {
      formData.append("clientImage", clientImageFile);
    }

    try {
      if (isEditMode) {
        await client.put(
          `/staticTestimonial/update-static-testimonial/${id}`,
          formData
        );
        message.success("Testimonial updated successfully");
      } else {
        await client.post(
          `/staticTestimonial/add-static-testimonial`,
          formData
        );
        message.success("Testimonial added successfully");
      }

      navigate("/testimonials");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Something went wrong during submission";
      message.error(msg);
    } finally {
      setIsSubmitting(false); // Stop loader
    }
  };

  return (
    <>
      {isSubmitting && <LoadingSpinner isLoading={true} />}
      <div className="Add-video-testimonial">
        <p className="Project-add-heading">Testimonial</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Back navigation */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button className="BackNavigation" onClick={() => navigate(-1)}>
              <img src="/Images/Project/back.svg" alt="Back" />
              Back
            </button>
            <div style={{ display: "flex", gap: "8px" }}>
              <p className="ProjectNavigationhead">Testimonials</p>
              <p className="ProjectNavigationhead">|</p>
              <p className="ProjectNavigationheaddetails">Add</p>
            </div>
          </div>

          <div className="add-video-form">
            {/* Client Name and Designation */}
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
            <div className="add-video-top-line">
              <div className="add-video-test-container">
                <p className="client-name-paraa">Project Name</p>
                <input
                  className="client-naMe-Input"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="add-video-test-container"></div>
            </div>

            {/* Description */}
            <div className="add-video-test-container">
              <p className="client-name-paraa">Description</p>
              <textarea
                className="client-naMe-Input-description fixed-textarea"
                placeholder="Tell us a little about the project..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Upload Section */}
            <div className="add-video-top-line">
              {/* Project Logo */}
              <div className="add-video-test-container">
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
                      {!clientImageFile && logoPreviewUrl && (
                      <img
                        src={
                          logoFile?.originFileObj
                            ? URL.createObjectURL(logoFile.originFileObj)
                            : logoPreviewUrl
                        }
                        alt="Preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                    <button className="Upload-button-reuable">
                      <img
                        style={{ width: "24px", height: "24px" }}
                        src="/Images/Project/Cloud-Upload.svg"
                        alt="upload"
                      />
                      Upload
                    </button>
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
                        {/* ✅ Preview */}
                        {logoFile.originFileObj && (
                          <img
                            src={URL.createObjectURL(logoFile.originFileObj)}
                            alt="Preview"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                      </div>
                    )}
                  </Upload>

                  {/* {logoFile && (
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
                )} */}
                </div>
              </div>

              {/* Client Image */}
              <div className="add-video-test-container">
                <p className="add-form-title">Client Image (Optional)</p>
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
                    onChange={handleClientImageChange}
                    fileList={clientImageFile ? [clientImageFile] : []}
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
                    {!clientImageFile && logoPreviewUrl && (
                      <img
                        src={
                          clientImageFile?.originFileObj
                            ? URL.createObjectURL(clientImageFile.originFileObj)
                            : clientImagePreviewUrl
                        }
                        alt="Preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                    <button className="Upload-button-reuable">
                      <img
                        style={{ width: "24px", height: "24px" }}
                        src="/Images/Project/Cloud-Upload.svg"
                        alt="upload"
                      />
                      Upload
                    </button>
                    {clientImageFile && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <p className="selectedFileName">
                          {clientImageFile.name}
                        </p>
                        <span
                          style={{
                            cursor: "pointer",
                            color: "#344054",
                            fontWeight: "bold",
                            fontSize: "16px",
                          }}
                          onClick={() => setClientImageFile(null)}
                        >
                          ×
                        </span>
                        {/* ✅ Preview */}
                        {clientImageFile.originFileObj && (
                          <img
                            src={URL.createObjectURL(
                              clientImageFile.originFileObj
                            )}
                            alt="Preview"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                      </div>
                    )}
                  </Upload>

                  {/* {clientImageFile && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <p className="selectedFileName">{clientImageFile.name}</p>
                    <span
                      style={{
                        cursor: "pointer",
                        color: "#344054",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                      onClick={() => setClientImageFile(null)}
                    >
                      ×
                    </span>
                  </div>
                )} */}
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
              {isEditMode ? "Update Testimonial" : "Submit Request"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStaticTestimonial;
