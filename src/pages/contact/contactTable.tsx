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
import { useQuery, useQueryClient } from "react-query";
import client from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import "./contact.css";

const fetchContact = async () => {
  const response = await client.get("/contact/view-all");
  console.log("Raw response from API:", response.data);
  return response.data.contacts; // or response.data.contact depending on structure
};

// const deleteFaq = async (id: string) => {
//   await client.delete(`/faq/delete-faq/${id}`);
// };

const ContactTable = ({ searchQuery }: { searchQuery: string }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery("AllContacts", fetchContact);
  console.log("Fetched contact data:", data);

  //   const { mutate: deleteFaqById } = useMutation(deleteFaq, {
  //     onSuccess: () => {
  //       message.success("FAQ deleted successfully.");
  //       queryClient.invalidateQueries("AllFaqs");
  //     },
  //     onError: () => {
  //       message.error("Failed to delete FAQ.");
  //     },
  //   });

  const filteredData = Array.isArray(data)
    ? data.filter(
        (item: any) =>
          item.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.phone?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <TableCell sx={headerCellStyle}> Full Name</TableCell>
              <TableCell sx={headerCellStyle}>Email</TableCell>
              <TableCell sx={headerCellStyle}>Phone</TableCell>
              <TableCell sx={headerCellStyle}>Description</TableCell>
              <TableCell sx={headerCellStyle}>Services</TableCell>
              <TableCell sx={headerCellStyle}>File</TableCell>
              <TableCell sx={headerCellStyle}>Submitted At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item: any) => (
              <TableRow key={item._id}>
                <TableCell sx={rowCellStyle}>{item.fullName}</TableCell>
                <TableCell sx={rowCellStyle}>{item.email}</TableCell>
                <TableCell sx={rowCellStyle}>{item.phone}</TableCell>
                <TableCell sx={rowCellStyle}>{item.description}</TableCell>
                <TableCell sx={rowCellStyle}>
                  {Array.isArray(item.services)
                    ? JSON.parse(item.services[0] || "[]").join(", ")
                    : ""}
                </TableCell>
                <TableCell sx={rowCellStyle}>
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download 
                  >
                    Download
                  </a>
                </TableCell>

                <TableCell sx={rowCellStyle}>
                  {new Date(item.createdAt).toLocaleString()}
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
              <span
                className={`page-button ${
                  typeof page === "number" && page === currentPage
                    ? "active"
                    : ""
                }`}
                key={`dots-${idx}`}
                style={{ padding: "0 4px" }}
              >
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
  whiteSpace: "nowrap",
  padding: "13px 16px",
  fontSize: "12px",
  fontFamily: "Albert Sans",
  fontWeight: "600",
  color: "#818181",
  borderBottom: "1px solid #EAECF0",
};

const rowCellStyle = {
  whiteSpace: "nowrap",
  fontFamily: "Albert Sans",
  VscWhitespace: "nowrap",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "20px",
  color: "#101828",
};

export default ContactTable;
