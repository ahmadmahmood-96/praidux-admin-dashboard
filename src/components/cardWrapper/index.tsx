import React from 'react';

import { Card } from 'antd';
import "./style.less";
type FooProps = {
  children:React.ReactNode // JSX.Element //
}
const ContentWrapper: React.FC<FooProps> = (props) =>  {

  return (
    <Card bordered={false} className='card-wrapper'>
     {props.children}
    </Card>
  )
};

export default ContentWrapper;