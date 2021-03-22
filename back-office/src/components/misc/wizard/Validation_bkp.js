import React, { Component } from "react";
import { Card, CardBody, FormGroup, Label } from "reactstrap";
import { Wizard, Steps, Step } from 'react-albus';
import { injectIntl } from 'react-intl';
import { BottomNavigation } from "./BottomNavigation";
import { TopNavigation } from "./TopNavigation";
import { NotificationManager } from "../../common/react-notifications";
import { Formik, Form, Field } from "formik";
import MultiSelect from "../MultiSelect";
import SearchableMultiSelect from "../SearchableMultiSelect";
import SingleSelect from "../SingleSelect";
import CustomDatePicker from "../CustomDatePicker";
import { withRouter } from "react-router-dom";
import { ProductList, ProductCardList } from '../index';

import classNames from 'classnames';
import { fetch } from "../../../helpers/Utils";

class Validation extends Component {

    currentStepData = {};

    constructor(props) {
        super(props);
        const { component } = this.props;
        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        component.steps.forEach( step => this[`form${step.id}`] = React.createRef() );
        const fields = component.steps.map( step => step.elements.map( element => ({ form: this[`form${step.id}`], valid: false, name: element.name, value: "" }) ) ).flat();
        this.state = {
            bottomNavHidden: false,
            topNavDisabled: false,
            loading: true,
            processing: false,
            currentStepData: {},
            redirect: null,
            fields
        };
    }

    async componentDidMount() {
        return await this.initialization();
    }

    async initialization() {
        const { baseURL, clientID, token, customData, component: { initialAction } } = this.props;
        if(initialAction && customData) {
            return await fetch(`${baseURL}/api/validateWizardStep`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    'data': customData,
                    'action': initialAction,
                    'client_id': clientID
                })
            })
            .then( response => response.json() )
            .then( response => {
                if(response.data) {
                    this.setState({
                        loading: false,
                        currentStepData: {
                            ...this.state.currentStepData,
                            ...response.data
                        }
                    });
                    return this.forceUpdate();
                }
            })
            .catch( error => {
                return NotificationManager.warning(error.message, "Oops! We got a problem.", 3000, null, null, '');
            });
        }
        return this.setState({
            loading: false
        });
    }

    validate(elementName, value, validationRules) {        
        let error;
        validationRules.forEach( rule => {
            let splittedRule = rule.split(":");
            if(splittedRule[0] === "required") {
                if(Array.isArray(value)) {
                    if (value.length === 0) {
                        error = `Please enter ${elementName}`;
                    }
                } else {
                    if (!value) {
                        error = `Please enter ${elementName}`;
                    }
                }
            }
            if(splittedRule[0] === "maxLength") {
                if (value.length > splittedRule[1]) {
                    error = `${elementName} cannot be longer than ${splittedRule[1]} characters.`;
                }
            }
        });
        return error;
    }

    hideNavigation() {
        this.setState({ bottomNavHidden: true, topNavDisabled: true });
    }

    asyncLoading () {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false });
        }, 3000);
    }

    onClickNext(goToNext, steps, step) {
        const { baseURL, token, clientID, callback } = this.props;
        const { fields, redirect } = this.state;
        let form = this[`form${step.id}`].current;
        let currentStepFormFields = fields.filter( field => field.form === this[`form${step.id}`] );
        form.submitForm().then( async () => {
            currentStepFormFields.forEach( currentField => {
                let name = currentField.name;
                form.validateField(name)
                    .then( errorMessage => {
                        if(errorMessage !== undefined) {
                            return form.setFieldTouched(name, true, true);
                        }
                    })
                    .catch( error => console.trace(error) );                
                currentField.value = form.state.values[name];
                currentField.valid = form.state.errors[name] ? false : true;
                this.setState({
                    fields: [ ...new Set([ ...fields, currentField ]) ]
                });
            });
            let currentStepFormFieldsStatus = currentStepFormFields.map( field => field.valid );
            if (!currentStepFormFieldsStatus.includes(false)) {
                const data = currentStepFormFields.map( field => ([ field.name, field.value ]) );
                if (steps.length - 1 <= steps.indexOf(step)) {
                    if(redirect || step.redirect) {
                        let url = redirect || step.redirect;
                        let modifiedData = Object.fromEntries(data);
                        Object.keys(modifiedData).forEach( key => {
                            if(modifiedData.hasOwnProperty(key)) {
                                url = url.replace(new RegExp(key, 'g'), modifiedData[key]);
                            }
                        });
                        return this.props.history.push(`/app${url}`);
                    }
                }
                if(!step.action) {
                    if(steps.indexOf(step) === (steps.length - 1)) {
                        if(callback) {
                            return callback();
                        }
                    }
                }
                try {
                    this.setState({
                        processing: true
                    });
                    const request = await fetch(`${baseURL}/api/validateWizardStep`, {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            'data': Object.fromEntries(data),
                            'action': step.action,
                            'client_id': clientID
                        })
                    });
                    const response = await request.json();
                    if (!request.ok) {
                        this.setState({
                            processing: false
                        });
                        throw response;
                    }
                    if(response.outcome !== "OK") {
                        this.setState({
                            processing: false
                        });
                        return NotificationManager.warning(response.message, "Oops! We got a problem.", 3000, null, null, '');
                    }
                    if(response.redirectIsExternal) {
                        return window.location = response.redirect;
                    }
                    this.setState({
                        currentStepData: response.data || {},
                        redirect: response.redirect || null,
                        processing: false
                    });
                    step.isDone = true;
                    goToNext();
                } catch(error) {
                    return NotificationManager.error(error.message, "Oops! We got a problem.", 3000, null, null, '');
                }
            }
            if(steps.indexOf(step) === (steps.length - 1)) {
                if(callback) {
                    return callback();
                }
            }
        });
    }

    async onClickPrev(goToPrev, steps, step) {
        await goToPrev();
        step = steps[steps.indexOf(step) - 1];
        const { fields } = this.state;
        let form = this[`form${step.id}`].current;
        let currentStepFormFields = fields.filter( field => field.form === this[`form${step.id}`] );
        let updatedFields = currentStepFormFields.map( currentField => {
            let name = currentField.name;
            // currentField.value = form.state.values[name];
            currentField.valid = form.state.errors[name] ? false : true;
            return currentField;
        });
        return this.setState({
            fields: [ ...new Set([ ...fields, ...updatedFields ]) ]
        });
    }

    getSteps(steps, currentStepData) {
        const { baseURL, token, clientID } = this.props;
        const { processing } = this.state;
        return (
            <Steps>
                {
                    steps.map( (step, index) => {
                        return (
                            <Step key={index} id={step.id} redirect={step.redirect} action={step.action} name={step.title} desc={step.description}>
                                <div className="wizard-basic-step">
                                    <Formik
                                        ref={this[`form${step.id}`]}
                                        initialValues={currentStepData}
                                        onSubmit={ (e, v) => { console.log(e, v) }}>
                                        {({ errors, touched }) => (
                                            <Form handleSubmit={ (e, v) => { console.log(e, v); } } className="av-tooltip tooltip-label-right">
                                                { processing ? 
                                                <div className="loading-backdrop">
                                                    <div className="loading position-static"></div>
                                                </div>
                                                : null }
                                                { step.elements.map( (element, index) => {
                                                    const { type, component, isHidden } = element;

                                                    if(type === "textContent") {
                                                        return (
                                                            <h2 key={index} className="py-2 text-center">{currentStepData[element.name] || element.value}</h2>
                                                        );
                                                    }

                                                    if(type === "component") {
                                                        const { id, functions, type: componentType } = component;
                                                        if(componentType === "productList") {
                                                            return (
                                                                <FormGroup key={index}>
                                                                    <Field
                                                                        className="form-control"
                                                                        id={id}
                                                                        baseURL={baseURL}
                                                                        token={token}
                                                                        clientID={clientID}
                                                                        name={element.name}
                                                                        hidden={isHidden}
                                                                        // placeholder={element.label}
                                                                        component={ProductList}
                                                                        dynamicComponent={component}
                                                                        functions={functions}
                                                                        data={currentStepData[element.name]}
                                                                        onChange={ (value) => this.validate(element.label, value, element.validationRules) } 
                                                                        validate={ (value) => this.validate(element.label, value, element.validationRules) }
                                                                    />
                                                                    {errors[element.name] && touched[element.name] && (
                                                                        <div className="invalid-feedback d-block">
                                                                            {errors[element.name]}
                                                                        </div>
                                                                    )}
                                                                </FormGroup>
                                                            );
                                                        }

                                                        if(componentType === "productCardList") {
                                                            return (
                                                                <FormGroup key={index}>
                                                                    <Field
                                                                        className="form-control"
                                                                        id={id}
                                                                        baseURL={baseURL}
                                                                        token={token}
                                                                        clientID={clientID}
                                                                        name={element.name}
                                                                        hidden={isHidden}
                                                                        // placeholder={element.label}
                                                                        component={ProductCardList}
                                                                        inWizard={true}
                                                                        hideShadow={true}
                                                                        dynamicComponent={component}
                                                                        functions={functions}
                                                                        data={currentStepData[element.name]}
                                                                        onChange={ (value) => this.validate(element.label, value, element.validationRules) } 
                                                                        validate={ (value) => this.validate(element.label, value, element.validationRules) }
                                                                    />
                                                                    {errors[element.name] && touched[element.name] && (
                                                                        <div className="invalid-feedback d-block">
                                                                            {errors[element.name]}
                                                                        </div>
                                                                    )}
                                                                </FormGroup>
                                                            );
                                                        }


                                                    }

                                                    

                                                    if(type === "searchableDDL") {
                                                        let optionLabel = element.ddl.label;
                                                        let optionValue = element.ddl.value;
                                                        let options = element.data.map( (dataItem, index) => ({ key: index, label: dataItem[optionLabel], value: dataItem[optionValue] }) );
                                                        return (
                                                            <FormGroup className="has-float-label" key={index}>
                                                                { !isHidden ? <Label for={element.name}>{element.label}</Label> : null }
                                                                <Field
                                                                    className="form-control"
                                                                    name={element.name}
                                                                    id={element.name}
                                                                    element={element}
                                                                    hidden={isHidden}
                                                                    // placeholder={element.label}
                                                                    component={SearchableMultiSelect}
                                                                    baseURL={baseURL}
                                                                    token={token}
                                                                    clientID={clientID}
                                                                    options={options}
                                                                    onChange={ (value) => this.validate(element.label, value, element.validationRules) } 
                                                                    validate={ (value) => this.validate(element.label, value, element.validationRules)}
                                                                />
                                                                {errors[element.name] && touched[element.name] && (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors[element.name]}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
                                                        );
                                                    }

                                                    if(type === "staticDDL") {
                                                        let optionLabel = element.ddl.label;
                                                        let optionValue = element.ddl.value;
                                                        let options = element.data.map( (dataItem, index) => ({ key: index, label: dataItem[optionLabel], value: dataItem[optionValue] }) );
                                                        return (
                                                            <FormGroup className="has-float-label" key={index}>
                                                                { !isHidden ? <Label for={element.name}>{element.label}</Label> : null }
                                                                <Field
                                                                    className="form-control"
                                                                    name={element.name}
                                                                    id={element.name}
                                                                    hidden={isHidden}
                                                                    // placeholder={element.label}
                                                                    component={MultiSelect}
                                                                    options={options}
                                                                    onChange={ (value) => this.validate(element.label, value, element.validationRules) } 
                                                                    validate={ (value) => this.validate(element.label, value, element.validationRules)}
                                                                />
                                                                {errors[element.name] && touched[element.name] && (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors[element.name]}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
                                                        );
                                                    }

                                                    if(type === "predefinedDDL") {
                                                        let optionLabel = element.ddl.label;
                                                        let optionValue = element.ddl.value;
                                                        let options = element.data.map( (dataItem, index) => ({ key: index, label: dataItem[optionLabel], value: dataItem[optionValue] }) );
                                                        return (
                                                            <FormGroup className="has-float-label" key={index}>
                                                                { !isHidden ? <Label for={element.name}>{element.label}</Label> : null }
                                                                <Field
                                                                    className="form-control"
                                                                    name={element.name}
                                                                    id={element.name}
                                                                    hidden={isHidden}
                                                                    // placeholder={element.label}
                                                                    component={SingleSelect}
                                                                    options={options}
                                                                    onChange={ (value) => this.validate(element.label, value, element.validationRules) } 
                                                                    validate={ (value) => this.validate(element.label, value, element.validationRules)}
                                                                />
                                                                {errors[element.name] && touched[element.name] && (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors[element.name]}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
                                                        );
                                                    }

                                                    if(type === "ddl") {
                                                        let options = [
                                                            ...(currentStepData.hasOwnProperty(element.name) ? currentStepData[element.name] : [])
                                                        ];
                                                        return (
                                                            <FormGroup className="has-float-label" key={index}>
                                                                { !isHidden ? <Label for={element.name}>{element.label}</Label> : null }
                                                                <Field
                                                                    className="form-control"
                                                                    name={element.name}
                                                                    id={element.name}
                                                                    hidden={isHidden}
                                                                    // placeholder={element.label}
                                                                    component={MultiSelect}
                                                                    options={options}
                                                                    onChange={ (value) => this.validate(element.label, value, element.validationRules) } 
                                                                    validate={ (value) => this.validate(element.label, value, element.validationRules)}
                                                                />
                                                                {errors[element.name] && touched[element.name] && (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors[element.name]}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
                                                        );
                                                    }

                                                    if(type === "textarea") {
                                                        return (
                                                            <FormGroup className="has-float-label" key={index}>
                                                                { !isHidden ? <Label for={element.name}>{element.label}</Label> : null }
                                                                <Field
                                                                    className={ classNames('form-control', { 'd-none': isHidden }) }
                                                                    name={element.name}
                                                                    id={element.name}
                                                                    component="textarea"
                                                                    rows={3}
                                                                    // placeholder={element.label}
                                                                    validate={ (value) => this.validate(element.label, value, element.validationRules)}
                                                                />
                                                                {errors[element.name] && touched[element.name] && (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors[element.name]}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
                                                        );
                                                    }

                                                    if(type === "password") {
                                                        return (
                                                            <FormGroup className="has-float-label" key={index}>
                                                                { !isHidden ? <Label for={element.name}>{element.label}</Label> : null }
                                                                <Field
                                                                    className="form-control"
                                                                    name={element.name}
                                                                    id={element.name}
                                                                    type={isHidden ? 'hidden' : 'password'}
                                                                    // placeholder={element.label}
                                                                    validate={ (value) => this.validate(element.label, value, element.validationRules)}
                                                                />
                                                                {errors[element.name] && touched[element.name] && (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors[element.name]}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
                                                        );
                                                    }

                                                    if(type === "date") {
                                                        return (
                                                            <FormGroup className="has-float-label" key={index}>
                                                                { !isHidden ? <Label for={element.name}>{element.label}</Label> : null }
                                                                <Field
                                                                    className="form-control"
                                                                    name={element.name}
                                                                    id={element.name}
                                                                    hidden={isHidden}
                                                                    component={CustomDatePicker}
                                                                    // placeholder={element.label}
                                                                    onChange={ (value) => this.validate(element.label, value, element.validationRules) }
                                                                    validate={ (value) => this.validate(element.label, value, element.validationRules)}
                                                                />
                                                                {errors[element.name] && touched[element.name] && (
                                                                    <div className="invalid-feedback d-block">
                                                                        {errors[element.name]}
                                                                    </div>
                                                                )}
                                                            </FormGroup>
                                                        );
                                                    }


                                                    return (
                                                        <FormGroup className="has-float-label" key={index}>
                                                                { !isHidden ? <Label for={element.name}>{element.label}</Label> : null }
                                                            <Field
                                                                className="form-control"
                                                                name={element.name}
                                                                id={element.name}
                                                                type={isHidden ? 'hidden' : 'text'}
                                                                // placeholder={element.label}
                                                                validate={ (value) => this.validate(element.label, value, element.validationRules)}
                                                            />
                                                            {errors[element.name] && touched[element.name] && (
                                                                <div className="invalid-feedback d-block">
                                                                    {errors[element.name]}
                                                                </div>
                                                            )}
                                                        </FormGroup>
                                                    );


                                                }) }
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </Step>
                        );
                    } )
                }
            </Steps>
        );
    }

    render() {
        const { customData, component: { steps } } = this.props;
        let { loading, processing, currentStepData: activeData } = this.state;
        if(loading) {
            return (
                <div className="loading"></div>
            );
        }
        let currentStepData;
        if(customData) {
            currentStepData = {
                ...activeData,
                ...customData
            };
        } else {
            currentStepData = {
                ...activeData
            };
        }
        return (
            <Card>
                <CardBody className="wizard wizard-default">
                    <Wizard>
                        <TopNavigation className="justify-content-center" disableNav={true} />
                        { this.getSteps(steps, currentStepData) }
                        <BottomNavigation processing={processing} onClickNext={this.onClickNext} onClickPrev={this.onClickPrev} className={"justify-content-center " + (this.state.bottomNavHidden && "invisible")} prevLabel="Back" nextLabel="Next" />
                    </Wizard>
                </CardBody>
            </Card>
        );
    }
}

export default withRouter(
    injectIntl(Validation)
);
  