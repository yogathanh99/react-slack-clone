import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: #000;
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
    border: 6px solid #fff;
    border-color: #fff transparent #fff transparent;
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

export default () => {
  return (
    <Wrapper>
      <Spinner />
    </Wrapper>
  );
};
