import React from 'react';
import { Button, Result } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const WarningMessage: React.FC = () => {
  const navigate = useNavigate();
  // const handleBackAndReload = () => {
  //   navigate(-1); // Go back in history
  //  // window.location.reload(); // Reload the page
  // };
  const BackHome = () => {
    navigate('/');
    window.location.href = '/';
  };
  return (<Result
    status="500"
    title="There are some problems with your operation."
      extra={[
        // <Button type="primary" key="goBackButton" onClick={handleBackAndReload}>
        //   GO BACK
        // </Button>,
        <Link to="/" key="backHomeLink" onClick={BackHome}>
          <Button key="backHomeButton">Back Home</Button>
        </Link>
      ]}
  />
  );
  }

export default WarningMessage;