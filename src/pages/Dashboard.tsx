import { useState, ReactNode } from "react";
import { DatePicker, Row, Col, message } from "antd";
import { Dayjs } from "dayjs";
import client from "../utils/axios";
import { useQuery } from "react-query";
import LoadingSpinner from "../components/ui/LoaderSpinner";
import StatsCard from "../components/cards/StatsCard";
import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import DescriptionTitle from "../components/ui/DescriptionTitle";

const { RangePicker } = DatePicker;

interface Stats {
  totalVisits: number;
  uniqueVisitors: number;
  startDate?: string;
  endDate?: string;
}

interface StatsCardConfig {
  title: string;
  key: string; // the key from the stats object (e.g. "totalVisits")
  value: number;
  icon: ReactNode;
  iconColor?: string;
}

const fetchVisitStats = async (
  startDate?: string,
  endDate?: string
): Promise<Stats> => {
  try {
    const { data } = await client.get<Stats>("visit/stats", {
      params: {
        startDate,
        endDate,
      },
    });
    return data;
  } catch (err) {
    message.error("Failed to fetch stats");
    throw err;
  }
};

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const { data: stats, isLoading } = useQuery(
    ["visit-stats", dateRange],
    () => {
      if (dateRange) {
        const [start, end] = dateRange;
        return fetchVisitStats(start.toISOString(), end.toISOString());
      }
      return fetchVisitStats();
    }
  );

  const statCards: StatsCardConfig[] = [
    {
      title: "Total Visits",
      key: "totalVisits",
      value: stats?.totalVisits || 0,
      icon: <EyeOutlined />,
      iconColor: "#1890ff",
    },
    {
      title: "Unique Visitors",
      key: "uniqueVisitors",
      value: stats?.uniqueVisitors || 0,
      icon: <UserOutlined />,
      iconColor: "#52c41a",
    },
    // Add more stat cards here if needed
  ];

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates?.[0] && dates?.[1]) {
      setDateRange([dates[0], dates[1]]);
    } else {
      setDateRange(null);
    }
  };

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <div style={{ padding: 24 }}>
        <Row gutter={16} justify="space-between" align="middle">
          <Col>
            <DescriptionTitle
              title="Analytics Overview"
              description="Number of unique and total visitors visited hikar website"
            />
          </Col>
          <Col>
            <RangePicker
              size="large"
              value={dateRange}
              onChange={handleDateChange}
              allowClear
            />
          </Col>
        </Row>

        <Row gutter={16}>
          {statCards.map((card, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={card.key}>
              <StatsCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                iconColor={card.iconColor}
              />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
