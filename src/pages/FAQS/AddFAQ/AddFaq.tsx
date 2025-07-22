import { useState } from "react";
import client from "../../../utils/axios";
import { useMutation, useQueryClient } from "react-query";
import LoadingSpinner from "../../../components/ui/LoaderSpinner";
import "./addFaq.css";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { message } from "antd";

const AddFaq = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const { mutate: submitFaq, isLoading } = useMutation(
    async () => {
      const response = await client.post("/faq/add-faq", { question, answer });
      return response.data;
    },
    {
      onSuccess: () => {
        message.success("FAQ added successfully");
        queryClient.invalidateQueries(["AllFaqs"]); // if you have a list query
        navigate("/faqs"); // change to your actual route
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          "Something went wrong while adding FAQ";
        message.error(msg);
      },
    }
  );
  const handleSubmit = () => {
  if (!question.trim()) {
    message.warning("Please enter a question");
    return;
  }
  if (!answer.trim()) {
    message.warning("Please enter an answer");
    return;
  }
  submitFaq();
};

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <div className="AddFaqContainer">
        <div className="Add-Faq-Header">
          <button className="BackNavigation" onClick={() => navigate(-1)}>
            <img src="/Images/Project/back.svg" alt="Back" className="BackArrow" />
            Back
          </button>
          <div style={{ display: "flex", gap: "8px" }}>
            <p className="ProjectNavigationhead">FAQs</p>
            <p className="ProjectNavigationhead">|</p>
            <p className="ProjectNavigationheaddetails">Add</p>
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
              onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="dots-loader">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddFaq;
