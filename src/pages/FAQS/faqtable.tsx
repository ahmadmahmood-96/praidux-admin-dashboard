import React, { useState } from "react";
import {
  Table,
  TableBody,
  Box,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Dropdown, Menu, Button, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import client from "../../utils/axios";
import { ConfirmModal } from "../../components/ui/index.tsx";
import { useNavigate } from "react-router-dom";

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

const filteredData = data.filter(
  (item: any) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
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
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          padding: "16px",
          background: "#fff",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <Button
          size="small"
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>

        {visiblePages().map((page, idx) =>
          page === "..." ? (
            <span key={idx} style={{ padding: "0 4px" }}>
              ...
            </span>
          ) : (
            <Button
              key={page}
              size="small"
              type={page === currentPage ? "primary" : "default"}
              style={{ minWidth: 32, height: 32 }}
              onClick={() => setCurrentPage(page as number)}
            >
              {page}
            </Button>
          )
        )}

        <Button
          size="small"
          variant="outlined"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
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

export default FaqTable;
