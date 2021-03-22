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

class SlidesEditor extends React.Component {

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
      return NotificationManager.success(`Carousel saved successfully.`, `Success!`);
    } catch(e) {
      console.error(e);
      return NotificationManager.error(e.message, `Error!`);
    }
  }

  render() {
    const { component } = this.props;
    const { title, imageEditorAttributes, slides } = component;
    return (
      <Card className="my-5">
        <CardBody>
            <CardTitle>{title}</CardTitle>
            <Formik
              initialValues={{ slides }}
              onSubmit={ async (values) => await this.handleSubmission(values) }
            >
              { ({ setFieldValue, values }) => (
                <Form className="my-3">
                  { values.slides && values.slides.map( (slide, index) => {
                    return (
                      <div key={index}>
                        <FieldArray
                          name="slides"
                          render={ arrayHelpers => (
                            <div>
                              { (index > 0 && index === values.slides.length - 1) ? <hr /> : null }
                              <div className="mt-4 mb-2 text-right">
                                <h2 aria-hidden="true" className="iconsminds-add d-inline-block" onClick={() => arrayHelpers.push({ title: '', subtitle: '', button_content: '', button_link: '' })}></h2>
                                { index !== 0 ? <h2 aria-hidden="true" className="iconsminds-close d-inline-block" onClick={ () => arrayHelpers.remove(index) }></h2> : null }
                              </div>
                              <ImagePicker
                                name="attachment"
                                token={this.props.token}
                                initialImages={slide.image}
                                attributes={imageEditorAttributes}
                                onChange={ (images) => setFieldValue(`slides.${index}.image`, images) }
                              />
                              <FormGroup row>
                                <Colxx sm={6}>
                                  <FormGroup className="has-float-label">
                                    <Label for={`slides.${index}.title`}>Title</Label>
                                    <Field
                                      className="form-control"
                                      type="text"
                                      id={`slides.${index}.title`}
                                      name={`slides.${index}.title`}
                                      validate={ (value) => value !== "" ? undefined : "Title is required" }
                                    />
                                    <ErrorMessage name={`slides.${index}.title`} />
                                  </FormGroup>
                                </Colxx>
                                <Colxx sm={6}>
                                  <FormGroup className="has-float-label">
                                    <Label for={`slides.${index}.subtitle`}>Subtitle</Label>
                                    <Field
                                      className="form-control"
                                      type="text"
                                      id={`slides.${index}.subtitle`}
                                      name={`slides.${index}.subtitle`}
                                      validate={ (value) => value !== "" ? undefined : "Subtitle is required" }
                                    />
                                    <ErrorMessage name={`slides.${index}.subtitle`} />
                                  </FormGroup>
                                </Colxx>
                                <Colxx sm={6}>
                                  <FormGroup className="has-float-label">
                                    <Label for={`slides.${index}.button_content`}>Button Content</Label>
                                    <Field
                                      className="form-control"
                                      type="text"
                                      id={`slides.${index}.button_content`}
                                      name={`slides.${index}.button_content`}
                                      validate={ (value) => value !== "" ? undefined : "Button Content is required" }
                                    />
                                    <ErrorMessage name={`slides.${index}.button_content`} />
                                  </FormGroup>
                                </Colxx>
                                <Colxx sm={6}>
                                  <FormGroup className="has-float-label">
                                    <Label for={`slides.${index}.button_link`}>Button Link</Label>
                                    <Field
                                      className="form-control"
                                      type="text"
                                      id={`slides.${index}.button_link`}
                                      name={`slides.${index}.button_link`}
                                      validate={ (value) => value !== "" ? undefined : "Button Link is required" }
                                    />
                                    <ErrorMessage name={`slides.${index}.button_link`} />
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


export default SlidesEditor;