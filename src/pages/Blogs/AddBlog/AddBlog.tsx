import "./AddBlog.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Upload, Switch, message } from "antd";
import type { UploadFile } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import LoadingSpinner from "../../../components/ui/LoaderSpinner";
import {
  FormControl,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
} from "@mui/material";
import client from "../../../utils/axios";
import QuillTextEditor from "../../../components/quillEditor";

const AddBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [blogContent, setBlogContent] = useState("");
  const [shouldList, setShouldList] = useState(true);
  const [writerName, setWriterName] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogImageFile, setBlogImageFile] = useState<any>(null);
  const [blogImageUrl, setBlogImageUrl] = useState("");

  const categoryOptions = [
    "UIUX",
    "Software Development",
    "AI ML",
    "Cross Platform",
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("writerName", writerName);
      formData.append("blogTitle", blogTitle);
      formData.append("categories", JSON.stringify(categories));
      formData.append("blogContent", blogContent);
      formData.append("listOnWebsite", shouldList.toString());
      if (blogImageFile) formData.append("blogImage", blogImageFile);

      if (isEditMode) {
        await client.put(`/blog/update-blog/${id}`, formData);
        message.success("Blog updated successfully");
      } else {
        await client.post(`/blog/add-blog`, formData);
        message.success("Blog created successfully");
      }

      navigate("/blogs");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Something went wrong while submitting the blog";
      message.error(msg);
    }
    finally {
    setIsSubmitting(false); // Stop loader
  }
  };

  const handleImageChange = (info: UploadChangeParam<UploadFile<any>>) => {
    setBlogImageFile(info.file);
  };

  useEffect(() => {
    if (isEditMode) {
      client
        .get(`/blog/view-blog/${id}`)
        .then((res) => {
          const data = res.data.result;
          setWriterName(data.writerName || "");
          setBlogTitle(data.blogTitle || "");
          setCategories(data.categories || []);
          setShouldList(data.listOnWebsite);
          setBlogContent(data.blogContent || "");
          setBlogImageUrl(data.blogImageUrl || "");
        })
        .catch((err) => {
          console.error("Failed to fetch blog", err);
          message.error("Failed to load blog data");
        });
    }
  }, [id]);

  return (
    <>
    {isSubmitting && <LoadingSpinner isLoading={true} />}

    <div className="Add-video-testimonial">
      <p className="Project-add-heading">Blog</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button className="BackNavigation" onClick={() => navigate(-1)}>
            <img src="/Images/Project/back.svg" alt="Back" />
            Back
          </button>
          <div style={{ display: "flex", gap: "8px" }}>
            <p className="ProjectNavigationhead">Blog</p>
            <p className="ProjectNavigationhead">|</p>
            <p className="ProjectNavigationheaddetails">Details</p>
          </div>
        </div>

        <div className="add-video-form">
          {/* Row 1 */}
          <div className="add-video-top-line">
            <div className="add-video-test-container">
              <p className="client-name-paraa">Writer Name</p>
              <input
                className="client-naMe-Input"
                value={writerName}
                onChange={(e) => setWriterName(e.target.value)}
              />
            </div>
            <div className="add-video-test-container">
              <p className="client-name-paraa">Blog Title</p>
              <input
                className="client-naMe-Input"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="add-video-top-line">
            <div className="add-video-test-container">
              <p className="client-name-paraa">Blog Categories</p>
              <FormControl fullWidth>
                <Select
                  multiple
                  displayEmpty
                  value={categories}
                  onChange={(e) => setCategories(e.target.value as string[])}
                  renderValue={(selected) =>
                    selected.length === 0 ? (
                      <span
                        style={{ fontFamily: "Albert Sans", color: "#9AA1B2" }}
                      >
                        Select Categories
                      </span>
                    ) : (
                      <span
                        style={{
                          fontFamily: "Albert Sans",
                          fontSize: "14px",
                          color: "#000",
                          lineHeight: "125%",
                        }}
                      >
                        {selected.join(", ")}
                      </span>
                    )
                  }
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
                  {categoryOptions.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      sx={{
                        backgroundColor: "transparent",
                        "&.Mui-selected": {
                          backgroundColor: "transparent",
                        },
                        "&.Mui-selected:hover": {
                          backgroundColor: "transparent",
                        },
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <Checkbox
                        checked={categories.indexOf(name) > -1}
                        sx={{
                          color: "#49454F",
                          "&.Mui-checked": {
                            color: "#FF5F1F",
                          },
                        }}
                      />
                      <ListItemText
                        primary={name}
                        primaryTypographyProps={{
                          sx: {
                            fontFamily: "Albert Sans",
                            fontSize: "14px",
                            lineHeight: "125%",
                          },
                        }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="add-video-test-container">
              <p className="add-form-title">Blog Image</p>
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
                  onChange={handleImageChange}
                  fileList={blogImageFile ? [blogImageFile] : []}
                  beforeUpload={() => false}
                >
                  {!blogImageFile && blogImageUrl && (
                    <img
                      src={blogImageUrl}
                      alt="Blog"
                      width="100%"
                      style={{
                        maxWidth: "300px",
                        borderRadius: "8px",
                        backgroundColor: "#f2f2f2",
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
                </Upload>

                {blogImageFile && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <p className="selectedFileName">{blogImageFile.name}</p>
                    <span
                      style={{
                        cursor: "pointer",
                        color: "#344054",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                      onClick={() => setBlogImageFile(null)}
                    >
                      ×
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Blog Content */}
          <div className="add-video-test-container">
            <p className="client-name-paraa">Blog Content</p>
            <QuillTextEditor
              value={blogContent}
              onChange={(value) => setBlogContent(value)}
              height={300}
            />
          </div>
          {/* List on Website */}
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

export default AddBlog;
