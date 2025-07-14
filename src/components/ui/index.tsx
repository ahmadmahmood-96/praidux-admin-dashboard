import { Button, Descriptions, Tooltip, Modal, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { ButtonProps } from "antd/es/button";
import {
  PlusOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
// import { AiOutlineRollback } from "react-icons/ai";
// import { RiArrowGoBackFill } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import dayjs from "dayjs";
// import { MdOutlineError } from "react-icons/md";

import "./style.less";

interface AddNewButtonProps {
  name: string | JSX.Element;
  pathName: string;
}

export const AddNewButton = (props: AddNewButtonProps) => {
  const navigate = useNavigate();
  return (
    <Button
      type="primary"
      size="large"
      className="add-btn"
      onClick={() => navigate(props.pathName)}
      icon={<PlusOutlined />}
    >
      {props.name}
    </Button>
  );
};
// End of Add new Button

interface AddButtonProps {
  name: string | JSX.Element;
  pathName: string;
}

export const NewButton = (props: AddButtonProps) => {
  const navigate = useNavigate();
  return (
    <Button
      type="primary"
      size="large"
      className="add-btn"
      onClick={() => navigate(props.pathName)}
    >
      {props.name}
    </Button>
  );
};
// End of  new Button

interface BackToButtonProps {
  name: string | JSX.Element;
  pathName: string;
}

export const BackButton = (props: BackToButtonProps) => {
  const navigate = useNavigate();
  return (
    <Tooltip title={props.name} placement="left">
      <Button
        className="back-btn"
        size="large"
        onClick={() => navigate(props.pathName)}
        icon={<IoMdArrowRoundBack />}
      ></Button>
    </Tooltip>
  );
};
interface BackToHistoryButtonProps {
  name: string | JSX.Element;
}

export const BackHistoryButton = (props: BackToHistoryButtonProps) => {
  const navigate = useNavigate();
  return (
    <Tooltip title={props.name} placement="left">
      <Button
        className="back-btn"
        size="large"
        onClick={() => navigate(-1)}
        icon={<IoMdArrowRoundBack />}
      ></Button>
    </Tooltip>
  );
};
// End of Back Button

interface TitleProps {
  title: string | JSX.Element;
}

export const DescriptionsTitle = (props: TitleProps) => {
  return (
    <Descriptions className="description" title={props.title}></Descriptions>
  );
};
// End of Descriptions
interface ConfirmModalProps {
  className: string;
  title: string;
  content: string | JSX.Element;
  okText: string;
  cancelText: string;
  //icon: JSX.Element; // Add the icon prop here
  onOk?: () => void;
  onCancel?: () => void;
   okButtonProps?: ButtonProps;        // ✅ add this
  cancelButtonProps?: ButtonProps;
}

export const ConfirmModal = (props: ConfirmModalProps) => {
  const { className, title, content, okText, cancelText, onOk, onCancel ,okButtonProps,
    cancelButtonProps} =
    props;
  const confirmOkModal = () => {
    Modal.confirm({
      className: className,
      title: title,
      content: content,
      icon:
        className == "logout-modal" ? (
          <LogoutOutlined />
        ) : (
          <ExclamationCircleOutlined />
        ),
      okText: okText,
      cancelText: cancelText,
      onOk: onOk,
      onCancel: onCancel,
       okButtonProps,        // ✅ forward the button props
      cancelButtonProps,
    });
  };

  return confirmOkModal();
};
// End of ConfirmModal

interface NotificationProps {
  description: string | JSX.Element;
  type: "success" | "error" | "info";
}

export const NotificationModal = (props: NotificationProps) => {
  const { description, type } = props;
  // const checkLanguage = localStorage.getItem('selectedLanguage');
  const confirmOkModal = () => {
    if (type == "error") {
      notification.warning({
        message: dayjs().locale() === "en" ? "Error Message" : "Fejl",
        description: description,
        duration: 5,
        placement: "top",
        className: "custom-notification",
        btn: (
          <Button size="large" onClick={() => notification.destroy()}>
            {dayjs().locale() === "en" ? "Continue" : "Fortsæt"}
          </Button>
        ),
      });
    } else if (type == "success") {
      notification.success({
        message: "Wopla!",
        description: description,
        duration: 5,
        placement: "top",
        className: "custom-notification",
        btn: (
          <Button size="large" onClick={() => notification.destroy()}>
            {dayjs().locale() === "en" ? "Continue" : "Fortsæt"}
          </Button>
        ),
      });
    } else if (type == "info") {
      notification.info({
        message: dayjs().locale() === "en" ? "Info" : "Info",
        description: description,
        duration: 5,
        placement: "top",
        className: "custom-notification",
        btn: (
          <Button size="large" onClick={() => notification.destroy()}>
            {dayjs().locale() === "en" ? "Continue" : "Fortsæt"}
          </Button>
        ),
      });
    }
  };

  return confirmOkModal();
};
// End of NotificationModal

export const AcceptNotificationModal = (props: NotificationProps) => {
  const { description, type } = props;
  // const checkLanguage = localStorage.getItem('selectedLanguage');
  const renderDescription = () => {
    if (typeof description === "string") {
      return (
        <div>
          {description.split("\n").map((item, index) => (
            <div key={index} style={{ display: "block", minHeight: "1px" }}>
              {item}
            </div>
          ))}
        </div>
      );
    }
    return null; // or handle other types of description if necessary
  };
  const confirmOkModal = () => {
    if (type == "error") {
      notification.warning({
        message: dayjs().locale() === "en" ? "Error Message" : "Fejl",
        description: description,
        duration: 0,
        placement: "top",
        className: "custom-notification",
        btn: (
          <Button size="large" onClick={() => notification.destroy()}>
            {dayjs().locale() === "en" ? "Close" : "Fortsætte"}
          </Button>
        ),
      });
    } else if (type == "success") {
      notification.success({
        message:
          dayjs().locale() === "en" ? "Accepted Offer Successfully" : "Success",
        description: renderDescription(),
        duration: 0,
        placement: "top",
        className: "custom-notification",
        btn: (
          <Button size="large" onClick={() => notification.destroy()}>
            {dayjs().locale() === "en" ? "Close" : "Fortsætte"}
          </Button>
        ),
      });
    } else if (type == "info") {
      notification.info({
        message:
          dayjs().locale() === "en" ? "Accepted Offer infofully" : "info",
        description: renderDescription(),
        duration: 0,
        placement: "top",
        className: "custom-notification",
        btn: (
          <Button size="large" onClick={() => notification.destroy()}>
            {dayjs().locale() === "en" ? "Close" : "Fortsætte"}
          </Button>
        ),
      });
    }
  };

  return confirmOkModal();
};
// End of AcceptNotificationModal
