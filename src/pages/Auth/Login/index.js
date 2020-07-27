import React, { useState } from 'react';
import {
  Grid,
  Form,
  Segment,
  Icon,
  Message,
  Header,
  Button,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import firebase from 'config/firebase';
import Input from 'components/Input';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [formState, setFormState] = useState({
    formValues: {
      email: '',
      password: '',
    },
    formErrors: {
      email: '',
      password: '',
    },
    formValidity: {
      email: false,
      password: false,
    },
  });

  const handleValidation = (target) => {
    const { name, value } = target;
    const fieldValidationErrors = formState.formErrors;
    const validity = formState.formValidity;
    const isEmail = name === 'email';
    const isPassword = name === 'password';
    const emailTest = /\S+@\S+\.\S+/;
    const passwordTest = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;

    validity[name] = value.length > 0;
    fieldValidationErrors[name] = validity[name]
      ? ''
      : `${name} is required and cannot be empty`;

    if (validity[name]) {
      if (isEmail) {
        validity[name] = emailTest.test(value);
        fieldValidationErrors[name] = validity[name]
          ? ''
          : `${name} should be a valid email address`;
      }
      if (isPassword) {
        validity[name] = passwordTest.test(value);
        fieldValidationErrors[name] = validity[name]
          ? ''
          : `${name} should be 6 characters minimum and have normal, capitalize characters and numbers`;
      }
    }

    setFormState({
      ...formState,
      formErrors: fieldValidationErrors,
      formValidity: validity,
    });
  };

  const handleChange = ({ target }) => {
    const { formValues } = formState;
    formValues[target.name] = target.value;
    setFormState({ formValues });
    handleValidation(target);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { formValues, formValidity } = formState;
    if (!Object.values(formValidity).every(Boolean)) {
      for (let key in formValues) {
        let target = {
          name: key,
          value: formValues[key],
        };
        handleValidation(target);
      }
    }

    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(formValues.email, formValues.password)
      .then((accountLogin) => {
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setErrors([...errors, err.message]);
      });
  };

  const handleError = (errors, inputName) => {
    return errors.some((err) => err.toLowerCase().includes(inputName))
      ? 'error'
      : '';
  };

  return (
    <Grid textAlign='center' verticalAlign='middle' className='register'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h1' icon color='blue' textAlign='center'>
          <Icon name='code branch' color='blue' />
          Login Here
        </Header>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
            <Input
              name='email'
              icon='mail'
              placeholder='Email...'
              typeInput='email'
              value={formState.formValues.email}
              handleChange={handleChange}
              className={handleError(errors, 'email')}
            />
            <Input
              name='password'
              icon='lock'
              placeholder='Password...'
              typeInput='password'
              value={formState.formValues.password}
              handleChange={handleChange}
              className={handleError(errors, 'password')}
            />

            <Button
              className={loading ? 'loading' : ''}
              color='blue'
              fluid
              size='large'
              type='submit'
              disabled={Object.values(formState.formErrors).some(Boolean)}
            >
              Login
            </Button>
          </Segment>
        </Form>
        {Object.values(formState.formErrors).some(Boolean) && (
          <Message error>
            <h1>Errors</h1>
            {Object.values(formState.formErrors).map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </Message>
        )}
        {errors.length !== 0 && (
          <Message error>
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </Message>
        )}
        <Message>
          Don't have an account? <Link to='/register'>Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
