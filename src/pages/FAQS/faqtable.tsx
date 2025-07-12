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
import "./faq.css";

const fetchFaqs = async () => {
  const { data } = await client.get("/faq/view-faqs");
  return data;
};

const deleteFaq = async (id: string) => {
  await client.delete(`/faq/delete-faq/${id}`);
};

const FaqTable = ({ searchQuery }: { searchQuery: string }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data = [], isLoading, isError } = useQuery("AllFaqs", fetchFaqs);

  const { mutate: deleteFaqById } = useMutation(deleteFaq, {
    onSuccess: () => {
      message.success("FAQ deleted successfully.");
      queryClient.invalidateQueries("AllFaqs");
    },
    onError: () => {
      message.error("Failed to delete FAQ.");
    },
  });

  const filteredData = Array.isArray(data)
    ? data.filter(
        (item: any) =>
          item.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getVisiblePages = (totalPages: number, currentPage: number) => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1); // Always include first page

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages); // Always include last page
    }

    // Remove duplicates just in case
    return [...new Set(pages)];
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong while loading FAQs</p>;

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
              <TableCell sx={headerCellStyle}>Question</TableCell>
              <TableCell sx={headerCellStyle}>Answer</TableCell>
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
                <TableCell sx={rowCellStyle}>{item.question}</TableCell>
                <TableCell sx={rowCellStyle}>{item.answer}</TableCell>
                <TableCell sx={rowCellStyle}>
                  <Dropdown
                    trigger={["click"]}
                    overlay={
                      <Menu>
                        <Menu.Item
                          onClick={() => navigate(`/update-faq/${item._id}`)}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          onClick={() =>
                            ConfirmModal({
                              className: "delete-modal",
                              title: "Delete FAQ",
                              content:
                                "Are you sure you want to delete this FAQ?",
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
          <img className="arrowRight" src="/Images/arrow-left.svg" alt="left" />
          Previous
        </button>

        <div
          className="pagination-container"
          style={{
            display: "flex",
            gap: "4px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getVisiblePages(totalPages, currentPage).map((page, idx) =>
            page === "..." ? (
              <span key={`dots-${idx}`} style={{ padding: "0 4px" }}>
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                className={`page-button ${
                  page === currentPage ? "active" : ""
                }`}
                onClick={() => setCurrentPage(Number(page))}
                style={{
                  minWidth: "24px",
                  height: "24px",
                  border: "none",
                  borderRadius: "4px",
                  background: "transparent",
                  fontWeight: page === currentPage ? "600" : "400",
                  cursor: "pointer",
                }}
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
          <img
            className="arrowRight"
            src="/Images/arrow-right.svg"
            alt="left"
          />
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
  VscWhitespace: "nowrap",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "20px",
  color: "#101828",
};

export default FaqTable;
