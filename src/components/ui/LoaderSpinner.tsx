import { Spin } from "antd";
import "./spinner.css"
interface SpinnerProps {
  isLoading: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<SpinnerProps> = ({
  isLoading,
  className = "",
}) => {
  return (
    <Spin
      className={`custom-spin ${isLoading ? `app-loading-wrapper ${className}` : "hide"}`}
    />
  );
};

export default LoadingSpinner;
