import { Result, Button } from "antd";
import UseAuthentication from "../utils/useAuthentication";

export default function ErrorPage() {
  const { logout } = UseAuthentication();
  return (
    <>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => logout}>
            Go back to Home
          </Button>
        }
      />
    </>
  );
}
