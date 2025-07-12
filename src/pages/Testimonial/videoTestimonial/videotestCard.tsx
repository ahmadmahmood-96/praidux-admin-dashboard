import "./videoTestimonial.css";
import { Dropdown, Menu } from "antd";

interface VideoTestCardProps {
  testimonial: {
    clientName: string;
    designation: string;
    projectName: string;
    stars: number;
    description: string;
    websiteLink?: string;
    iosLink?: string;
    androidLink?: string;
    liveStatus: string;
    videoUrl?: string;
    _id: string;
  };
  checked: boolean;
  onToggleCheck: () => void;
 onAction: (id: string, action: "edit" | "pause" | "delete") => void;

}

const VideoTestCard = ({
  testimonial,
  checked,
  onToggleCheck,
  onAction
}: VideoTestCardProps) => {
  const {
    clientName,
    // designation,
    projectName,
    stars,
    description,
    // websiteLink,
    // iosLink,
    // androidLink,
    liveStatus,
    videoUrl,
  } = testimonial;
const menu = (
  <Menu>
    <Menu.Item key="edit" onClick={() => onAction(testimonial._id, "edit")}>
      Edit
    </Menu.Item>
    <Menu.Item key="pause" onClick={() => onAction(testimonial._id, "pause")}>
      Pause
    </Menu.Item>
    <Menu.Item key="delete" onClick={() => onAction(testimonial._id, "delete")}>
      Delete
    </Menu.Item>
  </Menu>
);


  return (
    <div className="videotestCard">
      <div className="sttic-card-top-header-selection">
        <p className="selct-project-test">Select Project</p>
        <img
          src={
            checked
              ? "/Images/Project/checked.svg"
              : "/Images/Project/unchecked.svg"
          }
          alt="Checked"
          style={{ cursor: "pointer" }}
          onClick={onToggleCheck}
        />
      </div>

      <div className="video-test-bottom-part-card">
        <div className="video-section">
          {videoUrl && (
            <video src={videoUrl} controls width="100%" height="100%" />
          )}
        </div>
        <div className="video-card-second">
          <div className="video-content-testimonial">
            <div className="video-testimonial-top-content">
              <div className="video-header-gapss">
                <p className="clientName-video-testimonial">{clientName}</p>
                <p className="project-name-testimonial">{projectName}</p>
                {stars > 0 && (
                  <div className="rating-container">
                    {Array.from({ length: stars }, (_, i) => (
                      <img
                        key={i}
                        src="/Images/testimonial/star.svg"
                        alt="star"
                        className="stars"
                      />
                    ))}
                  </div>
                )}
              </div>
              <Dropdown overlay={menu} trigger={["click"]}>
                <img
                  style={{ cursor: "pointer" }}
                  src="/Images/testimonial/moreInfo.svg"
                  alt="info"
                />
              </Dropdown>
            </div>
            <p className="testimonial-video-description">"{description}"</p>
          </div>
          <div className="video-card-bottom-div-testimonial">
            <div className="video-bottom-testimonial-tags">
              {testimonial.websiteLink ? (
                <a
                  href={testimonial.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vide-testimonial-tags"
                >
                  <img src="/Images/testimonial/language.svg" alt="language" />
                  <p className="web-category-tag-video">Web</p>
                </a>
              ) : null}

              {testimonial.iosLink ? (
                <a
                  href={testimonial.iosLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vide-testimonial-tags"
                >
                  <img src="/Images/testimonial/apple.svg" alt="ios" />
                  <p className="web-category-tag-video">iOS</p>
                </a>
              ) : null}

              {testimonial.androidLink ? (
                <a
                  href={testimonial.androidLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vide-testimonial-tags"
                >
                  <img src="/Images/testimonial/Android.svg" alt="android" />
                  <p className="web-category-tag-video">Android</p>
                </a>
              ) : null}
            </div>

            <div className="video-testimonial-live">
              {liveStatus === "yes" && <div className="livee"></div>}
              <p className="live-paraaaa">
                {liveStatus === "yes" ? "The app is live" : "App is not live"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTestCard;
