import React, { Component } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Button, Modal, Input, ModalBody } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import { NotificationManager } from "../../components/common/react-notifications";
import { Formik, Form, Field } from "formik";

import { toggleAuthenticatorState, loginUser, loginUserSuccess } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { fetch } from "../../helpers/Utils";



// const RawHTML = ({children, className = ""}) => <div className={className} dangerouslySetInnerHTML={{ __html: children.replace(/\n/g, '<br />')}} />



class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      oneTimePassword: ""
    };
    this.formickRef = React.createRef();
  }

  onUserLogin = async (values) => {
    if (!this.props.loading) {
      if (values.email !== "" && values.password !== "") {
        await this.props.loginUser(values, this.props.history);
        // this.checkForUpdates();
      }
    }
  }

  validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  }

  validatePassword = (value) => {
    let error;
    if (!value) {
      error = "Please enter your password";
    } else if (value.length < 3) {
      error = "Value must be longer than 2 characters";
    }
    return error;
  }

  componentDidUpdate() {
    const { error } = this.props;
    if (error) {
      NotificationManager.warning(error, "Login Error", 3000, null, null, '');
    }
  }

  // doneScanning() {
  //   return this.props.toggleAuthenticatorScanningState(this.props.scanningDoneAlready);
  // }

  async verifyUser() {
    const { authenticationServer, clientID, clientSecret } = this.props;
    const { oneTimePassword } = this.state;
    if(this.formickRef) {
      const { email, password } = this.formickRef.state.values;
      const request = await fetch(`${authenticationServer}/tfa/verify`, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username: email,
          password,
          client_id: clientID,
          client_secret: clientSecret,
          grant_type: 'password',
          otp: oneTimePassword
        })
      });
      if(!request.ok) {
        const tempResponse = await request.json();
        return NotificationManager.error(
          tempResponse.message || request.statusText,
          "Google Authenticator Error",
          3000,
          null,
          null,
          ''
        );
      }
      const response = await request.json();
      return await this.props.loginUserSuccess(response, this.props.history);
    }
  }

  render() {
    const { password, email } = this.state;
    const { showAuthenticator } = this.props;
    const initialValues = { email, password };
    document.body.classList.add('rounded');
    document.title = `Login | Back Office`;
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="7" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
              <p className="white mb-0">
                Please use your credentials to login.
                <br />
                If you are not a member, please{" "}
                <NavLink to={`/register`} className="white">
                  register
                </NavLink>
                .
              </p>
            </div>
            <div className="form-side">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.login-title" />
              </CardTitle>

              <Formik
                ref={ (ref) => this.formickRef = ref }
                initialValues={initialValues}
                onSubmit={this.onUserLogin}>
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.email" />
                      </Label>
                      <Field
                        className="form-control"
                        name="email"
                        // validate={this.validateEmail}
                      />
                      {errors.email && touched.email && (
                        <div className="invalid-feedback d-block">
                          {errors.email}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.password" />
                      </Label>
                      <Field
                        className="form-control"
                        type="password"
                        name="password"
                        validate={this.validatePassword}
                      />
                      {errors.password && touched.password && (
                        <div className="invalid-feedback d-block">
                          {errors.password}
                        </div>
                      )}
                    </FormGroup>
                    <div className="d-flex justify-content-between align-items-center">
                      <NavLink to={`/user/forgot-password`}>
                        <IntlMessages id="user.forgot-password-question" />
                      </NavLink>
                      <Button
                        color="primary"
                        type="submit"
                        className={`btn-shadow btn-multiple-state ${this.props.loading ? "show-spinner" : ""}`}
                        size="lg"
                      >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label"><IntlMessages id="user.login-button" /></span>
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
			  
                <Modal backdrop={true} contentClassName="p-4" centered isOpen={showAuthenticator} toggle={ () => this.props.toggleAuthenticatorState(this.props.showAuthenticator) }>
                  <ModalBody className="text-center">
                    <h1>Autenticazione Google</h1>


                    {/* {
                      !scanningDoneAlready ?
                      <div>
                        <p>Confiura l'autenticazione a due fattori per scansionando il codice QR.</p>
                        <RawHTML>{ qr }</RawHTML>

                        <p><i>Dovrai configurare la tua App per poter efettuare l'accesso.</i></p>
                        <Button color="primary" onClick={ () => this.doneScanning() }>Done Scanning</Button>
                      </div>
                      :
                    } */}

                    <div>
                      <p>L'ultimo passaggio è inserire la password one-time generata dall'App Google Authenticator per verificare la tua identità.</p>
                      <FormGroup className="has-float-label">
                        <Label for="otp">One-Time Password</Label>
                        <Input
                          id="otp"
                          type="password"
                          onChange={ (event) => this.setState({ oneTimePassword: event.target.value }) }
                        />
                      </FormGroup>
                      <Button color="primary" onClick={ () => this.verifyUser() }>Verify One-Time Password</Button>
                    </div>
                    

                  </ModalBody>
                </Modal>
               

            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading, error, authenticationServer, clientID, clientSecret, qr, showAuthenticator, frontOfficeURL } = authUser;
  return { user, loading, error, authenticationServer, clientID, clientSecret, qr, showAuthenticator, frontOfficeURL };
};

export default connect(
  mapStateToProps, {
    toggleAuthenticatorState,
    loginUser,
    loginUserSuccess
  }
)(Login);
