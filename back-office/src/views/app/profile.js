import React, { Component, Fragment } from "react";
import {
  Row,
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
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import SingleLightbox from "../../components/pages/SingleLightbox";
import UserCardBasic from "../../components/cards/UserCardBasic";
import { NotificationManager } from "../../components/common/react-notifications";
import { fetch } from "../../helpers/Utils";


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
  company: Yup.string().required("Company is required!"),
  email: Yup.string().email("Invalid email address").required("Email is required!"),
  user_id: Yup.string().required("User ID is required!"),
  password: Yup.string(),
  data_creation_user: Yup.string().required("Data Creation User is required!"),
  data_modify_user: Yup.string().required("Data Modify User is required!")
});


const topClients = [
  {
    id: 1,
    thumb: 'https://gogo-react.coloredstrategies.com/assets/img/profile-pic-l-5.jpg',
    name: 'Mayra Sibley',
    status: 'Working hard!'
  },
  {
    id: 2,
    thumb: 'https://gogo-react.coloredstrategies.com/assets/img/profile-pic-l-2.jpg',
    name: 'Philip Nelms',
    status: 'Lead Developer'
  },
  {
    id: 3,
    thumb: 'https://gogo-react.coloredstrategies.com/assets/img/profile-pic-l-10.jpg',
    name: 'Kathryn Mengel',
    status: 'Dog & Cat Person'
  },
  {
    id: 4,
    thumb: 'https://gogo-react.coloredstrategies.com/assets/img/profile-pic-l-4.jpg',
    name: 'Esperanza Lodge',
    status: 'Now giving divorce advices :)'
  },
  {
    id: 5,
    thumb: 'https://gogo-react.coloredstrategies.com/assets/img/profile-pic-l-3.jpg',
    name: 'Ken Ballweg',
    status: 'Hi there, I am using Gogo!'
  },
  {
    id: 6,
    thumb: 'https://gogo-react.coloredstrategies.com/assets/img/profile-pic-l-6.jpg',
    name: 'Rasheeda Vaquera',
    status: '...'
  },
  {
    id: 7,
    thumb: 'https://gogo-react.coloredstrategies.com/assets/img/profile-pic-l-7.jpg',
    name: 'Linn Ronning',
    status: 'What goes around comes around'
  },
  {
    id: 8,
    thumb: 'https://gogo-react.coloredstrategies.com/assets/img/profile-pic-l-9.jpg',
    name: 'Marty Otte',
    status: 'Big city life'
  },
  {
    id: 9,
    thumb: 'https://gogo-react.coloredstrategies.com/assets/img/profile-pic-l-11.jpg',
    name: 'Laree Munsch',
    status: 'New Job :)'
  }
];

class Profile extends Component {

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

  togglePasswordModal() {
    const { editPasswordModalOpen } = this.state;
    return this.setState({
      editPasswordModalOpen: !editPasswordModalOpen
    });
  }

  async savePassword(values) {
    const { baseURL, token, clientID, user } = this.props;
    this.setState({
        processing: true
    });
    return await fetch(`${baseURL}/api/users/${user.id}`, {
        method: 'PUT',
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
    const { baseURL, token, clientID, user } = this.props;
    this.setState({
        processing: true
    });
    return await fetch(`${baseURL}/api/users/${user.id}`, {
        method: 'PUT',
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
                editProfileModalOpen: false
            });
            delete values.password;
            let updatedUser = Object.assign(user, values);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            NotificationManager.success(
              "Your profile has been updated successfully.",
              "Success",
              3000,
              null,
              null,
              ''
            );
        }
    });
  }


  render() {
    const { user } = this.props;
    const { editProfileModalOpen, editPasswordModalOpen, processing } = this.state;
    document.title = `Profile | Back Office`;
    document.body.classList.add('rounded');
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12" lg="4">
            <h1 className="font-weight-light mb-5">User</h1>
            <Card className="mb-4">
              <div className="position-absolute card-top-buttons">
                <Button outline color={"white"} className="icon-button">
                  <i className="simple-icon-pencil" />
                </Button>
              </div>
              <SingleLightbox thumb={user.avatar} large={user.avatar} className="card-img-top" />
              <CardBody>
                <p className="text-muted text-small mb-2"><IntlMessages id="profile.about" /></p>
                <p className="mb-3">
                  I’m a web developer. I spend my whole day, practically every day, experimenting with HTML, CSS, and JavaScript; dabbling with Python and Ruby; and inhaling a wide variety of potentially useless information through a few hundred RSS feeds. I build websites that delight and inform. I do it well.
                </p>
                <div className="d-flex justify-content-around">
                  <Button size="sm" color="primary" outline onClick={ () => this.togglePasswordModal() }>Edit Password</Button>
                  <Button size="sm" color="primary" onClick={ () => this.toggleProfileModal() }>Edit Profile</Button>
                </div>

                <Modal contentClassName="py-5 px-4" centered isOpen={editPasswordModalOpen} toggle={ () => this.togglePasswordModal() }>
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
                              <div className="d-flex justify-content-end align-items-center">
                                  <Button color="primary" type="submit" size="lg">{processing ? 'Processing...' : 'Reset'}</Button>
                              </div>
                            </ModalBody>
                        </Form>
                      )}
                    </Formik>
                  </Modal>
                
                <Modal backdrop="static" centered isOpen={editProfileModalOpen} toggle={ () => this.toggleProfileModal() }>
                  <Formik
                    initialValues={{
                      first_name: user.first_name,
                      last_name: user.last_name,
                      company: user.company,
                      email: user.email,
                      user_id: user.user_id,
                      data_creation_user: user.data_creation_user,
                      data_modify_user: user.data_modify_user
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
                                <Label>Company</Label>
                                <Field className="form-control" name="company" />
                                {errors.company && touched.company ? (
                                  <div className="invalid-feedback d-block">
                                    {errors.company}
                                  </div>
                                ) : null}
                              </FormGroup>
                              <FormGroup className="form-group has-float-label">
                                <Label>E-mail Address</Label>
                                <Field className="form-control" name="email" />
                                {errors.email && touched.email ? (
                                  <div className="invalid-feedback d-block">
                                    {errors.email}
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
                              <FormGroup className="form-group has-float-label">
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
                              </FormGroup>
                            </ModalBody>
                            <ModalFooter>
                              <Button color="primary" type="button"  onClick={ () => this.toggleProfileModal() } outline>Cancel</Button>
                              <Button color="primary" type="submit">{processing ? 'Processing...' : 'Save Profile'}</Button>
                            </ModalFooter>
                        </Form>
                      )}
                    </Formik>
                  </Modal>
              </CardBody>
            </Card>
          </Colxx>
          
          <Colxx xxs="12" lg="8" className="mb-4 col-right">
            <h1 className="font-weight-light mb-5">Top Clients</h1>
            <Row>
            {
              topClients.map( (client, index) => {
                return (
                  <Colxx xxs="12" md="6" lg="4" key={index}>
                      <UserCardBasic data={client} />
                  </Colxx>
                );
              })
            }
            </Row>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser, menu }) => {
  const { containerClassnames } = menu;
  const { user: loginUser, baseURL, token, clientID } = authUser;
  const user = typeof(loginUser) === "string" ? JSON.parse(loginUser) : loginUser;
  return { user, token, baseURL, clientID, containerClassnames };
};

export default injectIntl(
  withRouter(
    connect(
      mapStateToProps,
      {}
    )(Profile)
  )
);


