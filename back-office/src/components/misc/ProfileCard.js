import React, { Component } from "react";
import { injectIntl } from "react-intl";
import {
    Card,
    CardBody,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label
  } from "reactstrap";
import { Colxx } from "../common/CustomBootstrap";
import SingleLightbox from "../pages/SingleLightbox";
import { Formik, Field, Form } from "formik";
import IntlMessages from "../../helpers/IntlMessages";
import * as Yup from "yup";
import { NotificationManager } from "../common/react-notifications";
import dynamicFunctions from './functions';
import { fetch } from "../../helpers/Utils";
import { connect } from 'react-redux';
import TwoFactorAuthentication from "./TwoFactorAuthentication";


function equalTo(ref, msg) {
    return Yup.mixed().test({
      name: 'equalTo',
      exclusive: false,
      message: msg || `${ref.path} must be the same as ${ref}`,
      params: {
        reference: ref.path,
      },
      test: function(value) {
        return value === this.resolve(ref);
      },
    });
  }
  
  Yup.addMethod(Yup.string, 'equalTo', equalTo);
  
  const editPasswordSchema = Yup.object().shape({
    old_password: Yup.string().required('Current Password is required.'),
    new_password: Yup.string().required('New Password is required.'),
    new_password_confirmation: Yup.string().required('New Password Confirmation is required.').equalTo(Yup.ref('new_password'), 'Passwords must match')
  });
  
  
  const editProfileSchema = Yup.object().shape({
    first_name: Yup.string().required("First Name is required!"),
    last_name: Yup.string().required("Last Name is required!"),
    email_address: Yup.string().email("Invalid email address").required("Email is required!"),
    user_id: Yup.string().required("User ID is required!"),
    tfa_enabled: Yup.boolean()
    // password: Yup.string(),
    // data_creation_user: Yup.string().required("Data Creation User is required!"),
    // data_modify_user: Yup.string().required("Data Modify User is required!")
  });
  

class ProfileCard extends Component {

    state = {
        editProfileModalOpen: false,
        editPasswordModalOpen: false,
        processing: false
    }

    toggleProfileModal() {
        const { editProfileModalOpen } = this.state;
        return this.setState({
          editProfileModalOpen: !editProfileModalOpen
        });
    }

    renderFunctions() {
        let { component: { functions } } = this.props;
        
        if(functions) {
            functions = functions.map( functionName => {
                if(functionName in dynamicFunctions) {
                    return dynamicFunctions[functionName]();
                }
                return null;
            }).filter( functionName => functionName !== null );
        } else {
            functions = [];
        }
        return functions;
    }
    
    togglePasswordModal() {
        const { editPasswordModalOpen } = this.state;
        return this.setState({
            editPasswordModalOpen: !editPasswordModalOpen
        });
    }

    async savePassword(values) {
        let { baseURL, token, clientID, user } = this.props;
        user = typeof(user) === "string" ? JSON.parse(user) : user;
        this.setState({
            processing: true
        });
        return await fetch(`${baseURL}/password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              old_password: values.old_password,
              new_password: values.new_password,
              new_password_confirmation: values.new_password_confirmation,
              client_id: clientID
            })
        })
        .then( (response) => {
            if(!response.ok) {
                response.json()
                .then( response => {
                    this.setState({
                        processing: false
                    });
                    throw new Error(response.message);
                } )
                .catch( error => {
                  this.setState({
                    processing: false
                  });
                  NotificationManager.error(
                    error.message,
                    "Oops!",
                    3000,
                    null,
                    null,
                    ''
                  );
                });
            } else {
                this.setState({
                    processing: false,
                    editPasswordModalOpen: false
                });
                NotificationManager.success(
                  "Your password has been updated successfully.",
                  "Success",
                  3000,
                  null,
                  null,
                  ''
                );
            }
        });
    }
    
    async saveProfile(values) {
        let { baseURL, token, clientID, user } = this.props;
        user = typeof(user) === "string" ? JSON.parse(user) : user;
        this.setState({
            processing: true
        });
        return await fetch(`${baseURL}/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              ...values,
              client_id: clientID
            })
        })
        .then( async (response) => {
            if(!response.ok) {
                response.json()
                .then( response => {
                    this.setState({
                        processing: false
                    });
                    throw new Error(response.message);
                } )
                .catch( error => {
                  this.setState({
                    processing: false
                  });
                  NotificationManager.error(
                    error.message,
                    "Oops!",
                    3000,
                    null,
                    null,
                    ''
                  );
                });
            } else {
                this.setState({
                    processing: false,
                    editProfileModalOpen: false
                });
                let updatedResponse = await response.json();
                let responseUser = updatedResponse.user;
                delete responseUser.password;
                let updatedUser = Object.assign(user, responseUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                NotificationManager.success(
                  "Your profile has been updated successfully.",
                  "Success",
                  3000,
                  null,
                  null,
                  ''
                );
                window.location.reload();
            }
        });
    }

    render() {
        let { user, component: { title } } = this.props;
        user = typeof(user) === "string" ? JSON.parse(user) : user;
        const { editProfileModalOpen, editPasswordModalOpen, processing } = this.state;
        return (
            <Colxx xxs="12" lg="4" className="d-inline-block align-top">
            <h1 className="font-weight-light mb-5">{title}</h1>
            <Card className="mb-4">
                {/* <div className="position-absolute card-top-buttons">
                <Button outline color={"white"} className="icon-button">
                    <i className="simple-icon-pencil" />
                </Button>
                </div> */}
                <SingleLightbox thumb={user.image} large={user.image} className="card-img-top" />
                <CardBody>
                { user.bio ? 
                <div>
                    <p className="text-muted text-small mb-2"><IntlMessages id="profile.about" /></p>
                    <p className="mb-3">{user.bio}</p>
                </div> : null }
                
                <div className="d-flex justify-content-around">
                    <Button size="sm" color="primary" outline onClick={ () => this.togglePasswordModal() }>Edit Password</Button>
                    <Button size="sm" color="primary" onClick={ () => this.toggleProfileModal() }>Edit Profile</Button>
                </div>

                <Modal backdrop="static" contentClassName="py-5 px-4" centered isOpen={editPasswordModalOpen} toggle={ () => this.togglePasswordModal() }>
                    <Formik
                    initialValues={{
                        old_password: "",
                        new_password: "",
                        new_password_confirmation: ""
                    }}
                    validationSchema={editPasswordSchema}
                    onSubmit={ (values) => this.savePassword(values) }
                    >
                        {( { errors, touched } ) => (
                        <Form className="av-tooltip tooltip-label-bottom">
                            <ModalHeader tag="div" className="border-bottom-0 pb-0">
                                <span className="logo-single" />
                                <h4 className="mb-0">Reset Password</h4>
                            </ModalHeader>
                            <ModalBody>
                                <FormGroup className="form-group has-float-label">
                                <Label>Current Password</Label>
                                <Field className="form-control" name="old_password" type="password" />
                                {errors.old_password && touched.old_password && (
                                    <div className="invalid-feedback d-block">
                                        {errors.old_password}
                                    </div>
                                )}
                                </FormGroup>
                                <FormGroup className="form-group has-float-label">
                                <Label>New Password</Label>
                                <Field className="form-control" name="new_password" type="password" />
                                {errors.new_password && touched.new_password && (
                                    <div className="invalid-feedback d-block">
                                        {errors.new_password}
                                    </div>
                                )}
                                </FormGroup>
                                <FormGroup className="form-group has-float-label">
                                <Label>New Password Again</Label>
                                <Field className="form-control" name="new_password_confirmation" type="password" />
                                {errors.new_password_confirmation && touched.new_password_confirmation && (
                                    <div className="invalid-feedback d-block">
                                        {errors.new_password_confirmation}
                                    </div>
                                )}
                                </FormGroup>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" type="button"  onClick={ () => this.togglePasswordModal() } outline>Cancel</Button>
                                <Button color="primary" type="submit" size="lg">{processing ? 'Processing...' : 'Reset'}</Button>
                            </ModalFooter>
                        </Form>
                        )}
                    </Formik>
                    </Modal>
                
                <Modal backdrop="static" centered isOpen={editProfileModalOpen} toggle={ () => this.toggleProfileModal() }>
                    <Formik
                    initialValues={{
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email_address: user.email_address,
                        user_id: user.user_id,
                        tfa_enabled: user.tfaEnabled
                    }}
                    validationSchema={editProfileSchema}
                    onSubmit={ (values) => this.saveProfile(values) }
                    >
                        {( { errors, touched } ) => (
                        <Form className="av-tooltip tooltip-label-bottom">
                            <ModalHeader>Edit Profile</ModalHeader>
                            <ModalBody>
                                <FormGroup className="form-group has-float-label">
                                <Label>First Name</Label>
                                <Field className="form-control" name="first_name" />
                                {errors.first_name && touched.first_name ? (
                                    <div className="invalid-feedback d-block">
                                    {errors.first_name}
                                    </div>
                                ) : null}
                                </FormGroup>
                                <FormGroup className="form-group has-float-label">
                                <Label>Last Name</Label>
                                <Field className="form-control" name="last_name" />
                                {errors.last_name && touched.last_name ? (
                                    <div className="invalid-feedback d-block">
                                    {errors.last_name}
                                    </div>
                                ) : null}
                                </FormGroup>
                                <FormGroup className="form-group has-float-label">
                                <Label>E-mail Address</Label>
                                <Field className="form-control" name="email_address" />
                                {errors.email_address && touched.email_address ? (
                                    <div className="invalid-feedback d-block">
                                    {errors.email_address}
                                    </div>
                                ) : null}
                                </FormGroup>
                                <FormGroup className="form-group has-float-label">
                                <Label>User ID</Label>
                                <Field className="form-control" name="user_id" />
                                {errors.user_id && touched.user_id ? (
                                    <div className="invalid-feedback d-block">
                                    {errors.user_id}
                                    </div>
                                ) : null}
                                </FormGroup>

                                <FormGroup className="form-group">
                                    <div className="row">
                                        <div className="col">
                                            <Label>Two-Factor Authentication</Label>
                                        </div>
                                        <div className="col text-right">
                                            <Field
                                                name="tfa_enabled"
                                                component={TwoFactorAuthentication}
                                            />
                                        </div>
                                    </div>
                                </FormGroup>

                                {/* <FormGroup className="form-group has-float-label">
                                <Label>Data Creation User</Label>
                                <Field className="form-control" name="data_creation_user" />
                                {errors.data_creation_user && touched.data_creation_user ? (
                                    <div className="invalid-feedback d-block">
                                    {errors.data_creation_user}
                                    </div>
                                ) : null}
                                </FormGroup>
                                <FormGroup className="form-group has-float-label">
                                <Label>Data Modify User</Label>
                                <Field className="form-control" name="data_modify_user" />
                                {errors.data_modify_user && touched.data_creation_user ? (
                                    <div className="invalid-feedback d-block">
                                    {errors.data_modify_user}
                                    </div>
                                ) : null}
                                </FormGroup> */}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" type="button"  onClick={ () => this.toggleProfileModal() } outline>Cancel</Button>
                                <Button color="primary" type="submit">{processing ? 'Processing...' : 'Save Profile'}</Button>
                            </ModalFooter>
                        </Form>
                        )}
                    </Formik>
                    </Modal>
                    <div className="row justify-content-end mt-5 mx-5">
                        { this.renderFunctions() }
                    </div>
                </CardBody>
            </Card>
            </Colxx>    
        );
    }
}



const mapStateToProps = ({ authUser }) => {
    const { authenticationServer } = authUser;
    return { authenticationServer };
};

export default injectIntl(
    connect(
        mapStateToProps,
        {}
    )(ProfileCard)
);