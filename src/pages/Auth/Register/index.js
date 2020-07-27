import React, { useState } from 'react';
import md5 from 'md5';
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

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [userRef] = useState(firebase.database().ref('users'));
  const [formState, setFormState] = useState({
    formValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    formErrors: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    formValidity: {
      username: false,
      email: false,
      password: false,
      passwordConfirm: false,
    },
  });

  const handleValidation = (target) => {
    const { name, value } = target;
    const fieldValidationErrors = formState.formErrors;
    const validity = formState.formValidity;
    const isUsername = name === 'username';
    const isEmail = name === 'email';
    const isPassword = name === 'password';
    const isPasswordConfirm = name === 'passwordConfirm';
    const emailTest = /\S+@\S+\.\S+/;
    const passwordTest = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;

    validity[name] = value.length > 0;
    fieldValidationErrors[name] = validity[name]
      ? ''
      : `${name} is required and cannot be empty`;

    if (validity[name]) {
      if (isUsername) {
        validity[name] = value.length >= 6;
        fieldValidationErrors[name] = validity[name]
          ? ''
          : `${name} should be 6 characters minimum`;
      }
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
      if (isPasswordConfirm) {
        validity[name] = passwordTest.test(value);
        fieldValidationErrors[name] = validity[name]
          ? ''
          : `${name} should be 6 characters minimum and have normal, capitalize characters and numbers`;

        fieldValidationErrors[name] =
          value === formState.formValues.password
            ? ''
            : `${name} should be same with password`;
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
      .createUserWithEmailAndPassword(formValues.email, formValues.password)
      .then((data) => {
        console.log(data);
        data.user
          .updateProfile({
            displayName: formValues.username,
            photoURL: `http://gravatar.com/avatar/${md5(
              data.user.email,
            )}?d=identicon`,
          })
          .then(() => {
            saveUser(data).then(() => {
              console.log('user saved');
              setLoading(false);
            });
          })
          .catch((err) => {
            console.error(err);
            setLoading(false);
            setErrors([...errors, err.message]);
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setErrors([...errors, err.message]);
      });
  };

  const saveUser = (userCreate) => {
    return userRef.child(userCreate.user.uid).set({
      name: userCreate.user.displayName,
      avatar: userCreate.user.photoURL,
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
        <Header as='h2' icon color='blue' textAlign='center'>
          <Icon name='puzzle piece' color='blue' />
          Register Here
        </Header>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
            <Input
              name='username'
              icon='user'
              placeholder='Username...'
              typeInput='text'
              value={formState.formValues.username}
              handleChange={handleChange}
            />
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
            <Input
              name='passwordConfirm'
              icon='repeat'
              placeholder='Password Confirmation...'
              typeInput='password'
              value={formState.formValues.passwordConfirm}
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
              Register
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
          Already user? <Link to='/login'>Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
