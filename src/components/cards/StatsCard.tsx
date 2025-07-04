import { Card } from "antd";
import { ReactNode } from "react";
import CountUp from "react-countup";
import "./styles.less";

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconColor?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  iconColor = "#1890ff",
}: StatsCardProps) => {
  return (
    <Card className="stats-card">
      <div className="stats-card-content">
        <div
          className="icon-wrapper"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <span className="icon" style={{ color: iconColor }}>
            {icon}
          </span>
        </div>
        <div className="stat-value">
          <CountUp end={value} separator="," />
        </div>
        <div className="stat-title">{title}</div>
      </div>
    </Card>
  );
};

export default StatsCard;
