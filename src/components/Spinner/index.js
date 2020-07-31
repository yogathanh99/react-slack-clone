import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: ${(props) => (props.primary ? '#000' : '#fff')};
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;

  &:after {
    content: ' ';
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: ${(props) => (props.primary ? '6px solid #fff' : '6px solid #000')};
    border-color: ${(props) =>
      props.primary
        ? '#fff transparent #fff transparent'
        : '#000 transparent #000 transparent'};
    animation: lds-dual-ring 1.2s linear infinite;
  }

  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default ({ primary }) => {
  return (
    <Wrapper primary={primary}>
      <Spinner primary={primary} />
    </Wrapper>
  );
};
