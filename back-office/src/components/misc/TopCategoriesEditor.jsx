import React from 'react';
import axios from 'axios';
import { Card, CardBody, CardTitle, FormGroup, Label, Button } from 'reactstrap';
import { Colxx } from '../common/CustomBootstrap';
import { Formik, Form, Field, getIn } from 'formik';
import { NotificationManager } from '../common/react-notifications';
import SingleSelect from './SingleSelect';
import SearchableProductSelector from './SearchableProductSelector';

const ErrorMessage = ({ name }) => (
  <Field
    name={name}
    render={({ form }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? <div className="invalid-feedback d-block">{error}</div> : null;
    }}
  />
);

class TopCategoriesEditor extends React.Component {

  async handleSubmission(values) {
    try {
      const { action } = this.props.component;
      const submissionRequest = await axios({
        url: action,
        method: 'POST',
        data: values,
        headers: {
          Authorization: `Bearer ${this.props.token}`
        }
      });
      if(submissionRequest.status !== 201) {
        throw new Error(submissionRequest.data.message);
      }
      return NotificationManager.success(`Top Categories saved successfully.`, `Success!`);
    } catch(e) {
      console.error(e);
      return NotificationManager.error(e.message, `Error!`);
    }
  }

  render() {
    const { component, token } = this.props;
    const { title, action, options, defaultOptions, categories, selectedOption } = component;
    return (
      <Card className="my-5">
        <CardBody>
            <CardTitle>{title}</CardTitle>
            <Formik
              initialValues={{ selectedOption, categories }}
              onSubmit={ async (values) => await this.handleSubmission(values) }
            >
              { ({ setFieldValue, values }) => (
                <Form className="my-3">
                  <FormGroup row className="justify-content-center">
                    <Colxx sm={6}>
                      <FormGroup className="has-float-label">
                        <Label for={`selectedOption`}>Rule</Label>
                        <Field
                          options={options}
                          component={SingleSelect}
                          id={`selectedOption`}
                          name={`selectedOption`}
                          validate={ (value) => value !== "" ? undefined : "Title is required" }
                        />
                        <ErrorMessage name={`selectedOption`} />
                      </FormGroup>
                    </Colxx>
                    { values.selectedOption && values.selectedOption === "custom" ? (
                      <Colxx sm={6}>
                        <FormGroup className="has-float-label">
                          <Label for={`categories`}>Categories</Label>
                          <Field
                            options={defaultOptions}
                            component={SearchableProductSelector}
                            token={token}
                            id={`categories`}
                            action={action}
                            name={`categories`}
                            validate={ (value) => value.length > 0 ? undefined : "Categories are required" }
                          />
                          <ErrorMessage name={`categories`} />
                        </FormGroup>
                      </Colxx>
                    ) : null }
                  </FormGroup>
                  <div className="text-right">
                    <Button color="primary" type="submit">Save</Button>
                  </div>
                </Form>
              )}
            </Formik>
        </CardBody>
      </Card>
    );
  }
}


export default TopCategoriesEditor;