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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
  const [fileLists, setFileLists] = useState<{ [key: number]: UploadFile[] }>(
    {}
  );

  type ContentBlock = {
    media: File | null;
    text: string;
    mediaUrl?: string | null;
    mediaType?: string | null; // "image" | "video"
  };

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    { media: null, text: "" },
  ]);
  // Handle media change
  const handleMediaChange = (file: any, index: number) => {
    const updated = [...contentBlocks];

    if (file instanceof File) {
      updated[index].media = file;
    } else if (file.originFileObj instanceof File) {
      updated[index].media = file.originFileObj;
    } else {
      console.warn("⚠️ No valid file found", file);
    }

    setContentBlocks(updated);

    // ✅ update Upload's fileList so AntD tracks it
    setFileLists((prev) => ({
      ...prev,
      [index]: [
        {
          uid: `${Date.now()}`,
          name: file.name || `media-${index}`,
          status: "done",
          url: updated[index].media
            ? URL.createObjectURL(updated[index].media)
            : updated[index].mediaUrl,
        } as UploadFile,
      ],
    }));
  };

  // Handle text change
  const handleTextChange = (value: string, index: number) => {
    const updated = [...contentBlocks];
    updated[index].text = value;
    setContentBlocks(updated);
  };

  // Add new content block
  const addContentBlock = () => {
    setContentBlocks([...contentBlocks, { media: null, text: "" }]);
  };

  // Remove content block
  const removeContentBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const categoryOptions = [
    "UIUX",
    "Software Development",
    "AI ML",
    "Cross Platform",
  ];

  const handleSubmit = async () => {
    if (!writerName.trim()) {
      message.warning("Please enter the writer's name");
      return;
    }

    if (!blogTitle.trim()) {
      message.warning("Please enter the blog title");
      return;
    }

    if (categories.length === 0) {
      message.warning("Please select at least one category");
      return;
    }

    if (!blogImageFile && !blogImageUrl) {
      message.warning("Please upload a blog image");
      return;
    }
    const hasValidBlock = contentBlocks.some(
      (block) =>
        (block.media || block.mediaUrl) &&
        block.text &&
        block.text.trim() !== ""
    );

    if (!hasValidBlock) {
      message.warning(
        "Please add at least one content block with media and text"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("writerName", writerName);
      formData.append("blogTitle", blogTitle);
      formData.append("categories", JSON.stringify(categories));
      formData.append("listOnWebsite", shouldList.toString());

      // Main blog image
      if (blogImageFile) {
        formData.append("blogImage", blogImageFile);
      }

      // ✅ Build blocks array
      const blocks = contentBlocks.map((block, index) => {
        if (block.media) {
          const tempKey = `blockMedia_${index}`;
          formData.append(tempKey, block.media); // upload actual file
          return {
            tempFileKey: tempKey, // backend will map this file
            text: block.text || "",
          };
        }
        return { text: block.text || "" };
      });

      // ✅ Send JSON string for backend
      formData.append("contentBlocks", JSON.stringify(blocks));
      formData.append("blogContent", blogContent);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const latestFile = info.fileList[info.fileList.length - 1];

    if (latestFile) {
      // some AntD versions keep the File here:
      const file = latestFile.originFileObj || (latestFile as unknown as File);

      if (file instanceof File) {
        setBlogImageFile(file);
        setBlogImageUrl("");
        // console.log("✅ Selected Blog Image:", file);
      } else {
        // console.warn("⚠️ No File found in Upload event:", latestFile);
      }
    }
  };

  useEffect(() => {
    if (isEditMode) {
      client
        .get(`/blog/view-blog/${id}`)
        .then((res) => {
          const data = res.data.result;
          // console.log("Fetched blog data:", data);

          setWriterName(data.writerName || "");
          setBlogTitle(data.blogTitle || "");
          setCategories(data.categories || []);
          setShouldList(data.listOnWebsite);
          setBlogImageUrl(data.blogImageUrl || "");
          setBlogContent(data.blogContent || "");

          if (
            Array.isArray(data.contentBlocks) &&
            data.contentBlocks.length > 0
          ) {
            setContentBlocks(
              data.contentBlocks.map((block: any) => ({
                text: block.text || "",
                mediaUrl: block.mediaUrl || null,
                mediaType: block.mediaType || null,
                media: null,
              }))
            );
            const initialFileLists: { [key: number]: UploadFile[] } = {};
            data.contentBlocks.forEach((block: any, idx: number) => {
              if (block.mediaUrl) {
                initialFileLists[idx] = [
                  {
                    uid: `-${idx}`,
                    name: `media-${idx}`,
                    status: "done",
                    url: block.mediaUrl,
                  } as UploadFile,
                ];
              }
            });
            setFileLists(initialFileLists);
          }
        })
        .catch(() => {
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
              <img
                src="/Images/Project/back.svg"
                alt="Back"
                className="BackArrow"
              />
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
                          style={{
                            fontFamily: "Albert Sans",
                            color: "#9AA1B2",
                          }}
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

                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      // ✅ Size check: 15MB
                      const isLt15MB = file.size / 1024 / 1024 <= 15;
                      if (!isLt15MB) {
                        message.error("Image must be smaller than 15MB!");
                        return Upload.LIST_IGNORE; // 🚫 Prevent file from being added
                      }
                      return false; // Prevent auto-upload
                    }}
                    onChange={handleImageChange}
                  >
                    <button className="Upload-button-reuable">
                      <img
                        src="/Images/Project/Cloud-Upload.svg"
                        alt="upload"
                        width={24}
                        height={24}
                      />
                      Upload
                    </button>
                  </Upload>

                  {(blogImageFile || blogImageUrl) && (
                    <div
                      style={{
                        position: "relative",
                        width: "120px",
                        height: "120px",
                        border: "1px dashed #ccc",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      {blogImageFile ? (
                        <img
                          src={URL.createObjectURL(blogImageFile)}
                          alt="Blog Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src={blogImageUrl}
                          alt="Blog"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      {/* ❌ Close Button */}
                      <span
                        onClick={() => {
                          setBlogImageFile(null);
                          setBlogImageUrl("");
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
                  )}
                </div>
              </div>
            </div>
            <div
              className="add-video-test-container"
              style={{ marginTop: "20px" }}
            >
              <p className="client-name-paraa">Blog Description</p>
              <textarea
                className="client-naMe-Input"
                style={{ height: "120px", resize: "vertical" }}
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                placeholder="Write a short description about the blog..."
              />
            </div>

            {contentBlocks.map((block, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {/* Blog Media */}
                <div className="add-video-test-container">
                  <p className="client-name-paraa">
                    Add Media (Image or Video)
                  </p>
                  <Upload
                    showUploadList={false}
                    onChange={(info) => handleMediaChange(info.file, index)}
                    fileList={fileLists[index] || []}
                    beforeUpload={(file) => {
                      const isAllowedType = [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                        "image/webp",
                        "video/mp4",
                        "video/webm",
                        "video/ogg",
                      ].includes(file.type);

                      if (!isAllowedType) {
                        message.error(
                          "Only images (jpg, png, gif, webp) and videos (mp4/webm/ogg) allowed"
                        );
                        return Upload.LIST_IGNORE;
                      }
                      const isImage = file.type.startsWith("image/");
                      const maxSizeMB = isImage ? 15 : 50; // 15MB for images, 50MB for videos

                      if (file.size / 1024 / 1024 > maxSizeMB) {
                        message.error(
                          `${
                            isImage ? "Image" : "Video"
                          } must be smaller than ${maxSizeMB}MB!`
                        );
                        return Upload.LIST_IGNORE;
                      }
                      return false; // ✅ prevents auto-upload
                    }}
                  >
                    <button className="Upload-button-reuable">
                      <img
                        style={{ width: "24px", height: "24px" }}
                        src="/Images/Project/Cloud-Upload.svg"
                        alt="upload"
                      />
                      Upload Media
                    </button>
                  </Upload>

                  {(block.media || block.mediaUrl) && (
                    <div
                      style={{
                        position: "relative",
                        width: "120px",
                        height: "120px",
                        border: "1px dashed #ccc",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      {block.media ? (
                        // 🆕 Show NEW uploaded file
                        block.media.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(block.media)}
                            alt="preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <video
                            src={URL.createObjectURL(block.media)}
                            controls
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )
                      ) : block.mediaType === "image" && block.mediaUrl ? (
                        // ✅ Show EXISTING image from backend
                        <img
                          src={block.mediaUrl}
                          alt="existing"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : block.mediaType === "video" && block.mediaUrl ? (
                        // ✅ Show EXISTING video from backend
                        <video
                          src={block.mediaUrl}
                          controls
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : null}

                      {/* ❌ Remove button */}
                      <span
                        onClick={() => {
                          const updated = [...contentBlocks];
                          updated[index].media = null;
                          updated[index].mediaUrl = null;
                          updated[index].mediaType = null;
                          setContentBlocks(updated);
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
                  )}
                </div>

                {/* Blog Text */}
                <div className="add-video-test-container">
                  <p className="client-name-paraa">Blog Text</p>
                  <ReactQuill
                    theme="snow"
                    value={block.text}
                    onChange={(value) => handleTextChange(value, index)}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["blockquote"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "list",
                      "bullet",
                      "blockquote",
                    ]}
                    style={{
                      height: "250px",
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                      border: "none",
                      overflow: "hidden",
                    }}
                  />
                </div>

                {/* Remove button for each block */}
                {contentBlocks.length > 1 && (
                  <button
                    style={{
                      background: "red",
                      border: "none",
                      color: "white",
                      width: "fit-content",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => removeContentBlock(index)}
                  >
                    Remove This Section
                  </button>
                )}
              </div>
            ))}

            {/* Add More Button */}
            <button
              type="button"
              className="Upload-button-reuable"
              style={{ width: "fit-content" }}
              onClick={addContentBlock}
            >
              + Add More Content
            </button>

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
