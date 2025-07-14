import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../../../utils/axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LoadingSpinner from "../../../components/ui/LoaderSpinner";
import TextArea from "antd/es/input/TextArea";
import { message } from "antd";
import "./updateFaq.css";

const UpdateFaq = () => {
  const { id } = useParams(); // ← Get FAQ ID from route
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const {
    data,
    isLoading: isFetching,
    isError,
  } = useQuery(
    ["faq", id],
    async () => {
      const { data } = await client.get(`/faq/view-faq/${id}`);
      return data;
    },
    { enabled: !!id }
  );

  // ✅ This effect sets form fields when data arrives
  useEffect(() => {
    if (data) {
      setQuestion(data.question);
      setAnswer(data.answer);
    }
  }, [data]);

  // ✅ Submit update
  const { mutate: updateFaq, isLoading: isSubmitting } = useMutation(
    async () => {
      const response = await client.put(`/faq/update-faq/${id}`, {
        question,
        answer,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        message.success("FAQ updated successfully");
        queryClient.invalidateQueries("AllFaqs");
        navigate("/faqs");
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          "Something went wrong while updating FAQ";
        message.error(msg);
      },
    }
  );

  if (isFetching) return <LoadingSpinner isLoading={true} />;
  if (isError) return <p>Something went wrong while fetching FAQ</p>;

  return (
    <>
      <LoadingSpinner isLoading={isSubmitting} />
      <div className="AddFaqContainer">
        <div className="Add-Faq-Header">
          <button className="BackNavigation" onClick={() => navigate(-1)}>
            <img src="/Images/Project/back.svg" alt="Back" />
            Back
          </button>
          <div style={{ display: "flex", gap: "8px" }}>
            <p className="ProjectNavigationhead">FAQs</p>
            <p className="ProjectNavigationhead">|</p>
            <p className="ProjectNavigationheaddetails">Edit</p>
          </div>
        </div>
        <div className="Add-Faq-form">
          <div className="Add-Input-form-cont">
            <p className="Add-Input-form-con-para">Question</p>
            <input
              className="add-input-question"
              placeholder="Enter question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="Add-Input-form-cont">
            <p className="Add-Input-form-con-para">Answer</p>
            <TextArea
              className="add-input-question"
              placeholder="Enter answer"
              autoSize={false}
              style={{ height: "100px", resize: "none" }}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          <button
            className="Add-faq-button"
            onClick={() => {
              if (!question.trim()) {
                message.warning("Please enter a question");
                return;
              }
              if (!answer.trim()) {
                message.warning("Please enter an answer");
                return;
              }
              updateFaq();
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="dots-loader">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdateFaq;
