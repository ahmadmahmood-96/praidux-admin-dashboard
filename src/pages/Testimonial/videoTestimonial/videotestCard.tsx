import "./videoTestimonial.css";

const VideoTestCard = () => {
  return (
    <>
      <div className="videotestCard">
        <div className="video-section"></div>
        <div className="video-card-second">
          <div className="video-content-testimonial">
            <div className="video-testimonial-top-content">
              <div className="video-header-gapss">
                <p className="clientName-video-testimonial">Muzamal Hussain</p>
                <p className="project-name-testimonial">Grower.io</p>
                <div className="rating-container">
                  <img src="/Images/testimonial/star.svg" alt="star" className="stars" />
                  <img src="/Images/testimonial/star.svg" alt="star" className="stars" />
                  <img src="/Images/testimonial/star.svg" alt="star" className="stars" />
                  <img src="/Images/testimonial/star.svg" alt="star" className="stars" />
                  <img src="/Images/testimonial/star.svg" alt="star" className="stars" />
                </div>
              </div>
              <img
                style={{ cursor: "pointer" }}
                src="/Images/testimonial/moreInfo.svg"
                alt="info"
              />
            </div>
            <p className="testimonial-video-description">
              "Unforgettable video experience! Each edit was a masterpiece, and
              the seamless transitions made the final product even more special.
              Every frame told a story, creating a lasting impression"
            </p>
          </div>
          <div className="video-card-bottom-div-testimonial">
            <div className="video-bottom-testimonial-tags">
              <div className="vide-testimonial-tags">
                <img src="/Images/testimonial/language.svg" alt="language" />
                <p className="web-category-tag-video">Web</p>
              </div>
              <div className="vide-testimonial-tags">
                <img src="/Images/testimonial/apple.svg" alt="language" />
                <p className="web-category-tag-video">IOS</p>
              </div>
              <div className="vide-testimonial-tags">
                <img src="/Images/testimonial/Android.svg" alt="language" />
                <p className="web-category-tag-video">Android</p>
              </div>
            </div>
            <div className="video-testimonial-live">
              <div className="livee"></div>
              <p className="live-paraaaa">The app is live</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoTestCard;
