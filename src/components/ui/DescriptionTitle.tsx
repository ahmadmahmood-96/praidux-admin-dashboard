import "./style.less";

const DescriptionTitle = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="description-title">
      <h2>{title}</h2>
      <span>{description}</span>
    </div>
  );
};

export default DescriptionTitle;
