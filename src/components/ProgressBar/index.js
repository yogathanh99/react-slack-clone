import React from 'react';
import { Progress } from 'semantic-ui-react';
import styled from 'styled-components';

const StyleProgress = styled(Progress)`
  margin: 0.3em 0 0 0 !important;
`;

const ProgressBar = (props) => {
  const { percentUploaded } = props;

  return (
    <StyleProgress
      percent={percentUploaded}
      progress
      indicating
      inverted
      size='medium'
    />
  );
};

export default ProgressBar;
