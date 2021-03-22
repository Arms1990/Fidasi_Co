import React from 'react';
import axios from 'axios';
import ImagePicker from './ImagePicker';
import { Card, CardBody, CardTitle, FormGroup, Label, Button } from 'reactstrap';
import { Colxx } from '../common/CustomBootstrap';
import { Formik, Form, Field, FieldArray, getIn } from 'formik';
import { NotificationManager } from '../common/react-notifications';

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

class FeaturesEditor extends React.Component {

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
      return NotificationManager.success(`Features saved successfully.`, `Success!`);
    } catch(e) {
      console.error(e);
      return NotificationManager.error(e.message, `Error!`);
    }
  }

  render() {
    const { component } = this.props;
    const { title, imageEditorAttributes, features } = component;
    return (
      <Card className="my-5">
        <CardBody>
            <CardTitle>{title}</CardTitle>
            <Formik
              initialValues={{ features }}
              onSubmit={ async (values) => await this.handleSubmission(values) }
            >
              { ({ setFieldValue, values }) => (
                <Form className="my-3">
                  { values.features && values.features.map( (slide, index) => {
                    return (
                      <div key={index}>
                        <FieldArray
                          name="features"
                          render={ arrayHelpers => (
                            <div>
                              { (index > 0 && index === values.features.length - 1) ? <hr /> : null }
                              <div className="mt-4 mb-2 text-right">
                                <h2 aria-hidden="true" className="iconsminds-add d-inline-block" onClick={() => arrayHelpers.push({ title: '', subtitle: '' })}></h2>
                                { index !== 0 ? <h2 aria-hidden="true" className="iconsminds-close d-inline-block" onClick={ () => arrayHelpers.remove(index) }></h2> : null }
                              </div>
                              <ImagePicker
                                name="attachment"
                                token={this.props.token}
                                initialImages={slide.image}
                                attributes={imageEditorAttributes}
                                onChange={ (images) => setFieldValue(`features.${index}.image`, images) }
                              />
                              <FormGroup row>
                                <Colxx sm={6}>
                                  <FormGroup className="has-float-label">
                                    <Label for={`features.${index}.title`}>Title</Label>
                                    <Field
                                      className="form-control"
                                      type="text"
                                      id={`features.${index}.title`}
                                      name={`features.${index}.title`}
                                      validate={ (value) => value !== "" ? undefined : "Title is required" }
                                    />
                                    <ErrorMessage name={`features.${index}.title`} />
                                  </FormGroup>
                                </Colxx>
                                <Colxx sm={6}>
                                  <FormGroup className="has-float-label">
                                    <Label for={`features.${index}.subtitle`}>Subtitle</Label>
                                    <Field
                                      className="form-control"
                                      type="text"
                                      id={`features.${index}.subtitle`}
                                      name={`features.${index}.subtitle`}
                                      validate={ (value) => value !== "" ? undefined : "Subtitle is required" }
                                    />
                                    <ErrorMessage name={`features.${index}.subtitle`} />
                                  </FormGroup>
                                </Colxx>
                              </FormGroup>
                            </div>
                          )}
                        />
                      </div>
                    );
                  }) }
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


export default FeaturesEditor;