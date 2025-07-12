import { useState } from "react";
import {
  Table,
  TableBody,
  Box,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Dropdown, Menu, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import client from "../../utils/axios";
import { ConfirmModal } from "../../components/ui/index.tsx";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/ui/LoaderSpinner.tsx";

const fetchFaqs = async () => {
  const { data } = await client.get("/blog/view-blogs");
  return data;
};

const deleteFaq = async (id: string) => {
  await client.delete(`/blog/delete-blog/${id}`);
};

const BlogTable = ({ searchQuery }: { searchQuery: string }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data = [], isLoading, isError } = useQuery("AllFaqs", fetchFaqs);
  const blogs = data?.result || [];
  console.log("data", blogs);
  const { mutate: deleteFaqById } = useMutation(deleteFaq, {
    onSuccess: () => {
      message.success("Blog deleted successfully.");
      queryClient.invalidateQueries("AllFaqs");
    },
    onError: () => {
      message.error("Failed to delete Blog.");
    },
  });

  const filteredData = blogs.filter(
    (item: any) =>
      item.blogTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.writerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Smart pagination display logic
  const visiblePages = () => {
    if (totalPages <= 6)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  if (isLoading) return  <LoadingSpinner
          isLoading={true}
        />;
  if (isError) return <p>Something went wrong while loading FAQs</p>;
  const stripHtml = (html: string) =>
    html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");

  //   const preview = stripHtml(blog.blogContent).slice(0, 100) + "...";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #EAECF0",
        boxShadow: "0 0 10px rgba(0,0,0,0.05)", // ✅ ADD shadow here only
      }}
    >
      <TableContainer
        sx={{
          borderBottom: "1px solid #EAECF0", // ✅ No full border
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        <Table
          sx={{
            minWidth: 850,
            borderRadius: "8px",
            border: "1px solid #EAECF0",
          }}
        >
          <TableHead>
            <TableRow sx={{ background: "#F9FAFB" }}>
              <TableCell sx={headerCellStyle}>Title</TableCell>
              <TableCell sx={headerCellStyle}>Writer Name</TableCell>
              <TableCell sx={headerCellStyle}>Description</TableCell>
              <TableCell sx={headerCellStyle}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item: any) => (
              <TableRow
                key={item._id}
                sx={{
                  "&:last-of-type td": {
                    borderBottom: "none", // ✅ Removes bottom border of last row
                  },
                }}
              >
                <TableCell sx={rowCellStyle} style={{ whiteSpace: "nowrap" }}>
                  {item.blogTitle}
                </TableCell>
                <TableCell sx={rowCellStyle} style={{ whiteSpace: "nowrap" }}>
                  {item.writerName}
                </TableCell>
                <TableCell sx={rowCellStyle}>
                  {" "}
                  <span title={stripHtml(item.blogContent)}>
                    {stripHtml(item.blogContent).slice(0, 100)}...
                  </span>
                </TableCell>
                <TableCell sx={rowCellStyle}>
                  <Dropdown
                    trigger={["click"]}
                    overlay={
                      <Menu>
                        <Menu.Item
                          onClick={() => navigate(`/add-Blog/${item._id}`)}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          onClick={() =>
                            ConfirmModal({
                              className: "delete-modal",
                              title: "Delete Blog",
                              content:
                                "Are you sure you want to delete this Blog?",
                              okText: "Delete",
                              cancelText: "Cancel",
                              onOk: () => deleteFaqById(item._id),
                              onCancel: () => console.log("Cancelled"),
                              okButtonProps: { className: "orange-button" },
                            })
                          }
                        >
                          Delete
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <span style={{ cursor: "pointer" }}>
                      <img src="/Images/dropdown.svg" alt="actions" />
                    </span>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
          padding: "14px 24px",
          background: "#fff",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          style={{
            display: "flex",
            gap: "8px",
            border: "1px solid #D0D5DD",
            borderRadius: "8px",
            padding: "8px 14px",
            background: "transparent",
            alignItems: "center",
          }}
        >
          <img src="/Images/arrow-left.svg" alt="left" />
          Previous
        </button>

        <div style={{ display: "flex", gap: "4px" }}>
          {" "}
          {visiblePages().map((page, idx) =>
            page === "..." ? (
              <span key={idx} style={{ padding: "0 4px" }}>
                ...
              </span>
            ) : (
              <button
                key={page}
                // type={page === currentPage ? "primary" : "default"}
                style={{
                  minWidth: 20,
                  background: "transparent",
                  height: 20,
                  fontWeight: page === currentPage ? "600" : "400",
                  fontFamily: "Albert Sans",
                  border: "none",
                  padding: "0px",
                  boxShadow: "none",
                  margin: "0",
                }}
                onClick={() => setCurrentPage(page as number)}
              >
                {page}
              </button>
            )
          )}
        </div>
        <button
          // size="small"
          style={{
            display: "flex",
            gap: "8px",
            border: "1px solid #D0D5DD",
            borderRadius: "8px",
            padding: "8px 14px",
            background: "transparent",
            alignItems: "center",
          }}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
          <img src="/Images/arrow-right.svg" alt="left" />
        </button>
      </Box>
    </div>
  );
};

// Cell styles
const headerCellStyle = {
  p: 0,
  padding: "13px 16px",
  fontSize: "12px",
  fontFamily: "Albert Sans",
  fontWeight: "600",
  color: "#818181",
  borderBottom: "1px solid #EAECF0",
};

const rowCellStyle = {
  fontFamily: "Albert Sans",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "20px",
  color: "#101828",
};

export default BlogTable;
