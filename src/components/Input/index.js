import React from 'react';
import { Form } from 'semantic-ui-react';

export default ({
  name,
  icon,
  placeholder,
  typeInput,
  value,
  handleChange,
  className,
}) => (
  <Form.Input
    className={className}
    fluid
    name={name}
    icon={icon}
    iconPosition='left'
    placeholder={placeholder}
    type={typeInput}
    value={value}
    onChange={handleChange}
  />
);
