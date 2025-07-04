import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const beforeUpload = (file: File) => {
  const isAllowedType =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg";

  if (!isAllowedType) {
    message.error("Only JPG/PNG/JPEG files are allowed!");
    return Upload.LIST_IGNORE;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error("Image must be smaller than 5MB!");
    return Upload.LIST_IGNORE;
  }

  return true;
};

const ImageUpload = ({ fileList, setFileList }: any) => {
  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Upload
      listType="picture-card"
      accept=".png,.jpg,.jpeg"
      multiple
      fileList={fileList}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      customRequest={({ onSuccess }) => {
        // Prevent actual upload
        setTimeout(() => {
          onSuccess && onSuccess("ok");
        }, 0);
      }}
      onPreview={(file) => {
        const url = file.thumbUrl || file.url;
        window.open(url, "_blank");
      }}
    >
      {fileList.length >= 8 ? null : (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Upload>
  );
};

export default ImageUpload;
