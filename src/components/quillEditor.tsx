import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  disable?: boolean;
  height?: number;
  onChange: (value: string) => void;
}

const QuillTextEditor: React.FC<QuillEditorProps> = ({
  value,
  disable,
  height = 300,
  onChange,
}) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }, { size: [] }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { check: "check" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "formula"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header", "font", "size", "align", "color", "background",
    "bold", "italic", "underline", "strike",
    "blockquote", "code-block",
    "list", "bullet", "check", "indent",
    "link", "image", "formula"
  ];

  return (
    <div style={{ marginBottom: "10px" }}>
      <ReactQuill
        readOnly={disable}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
      <style>
        {`
          .ql-container {
            min-height: ${height}px !important;
            background-color: white !important;
          }
          .ql-editor {
            background-color: white !important;
          }
        `}
      </style>
    </div>
  );
};

export default QuillTextEditor;
