
import React, { Component } from "react";

import { Wizard, Steps, Step } from 'react-albus';
import { TopNavigation } from "./TopNavigation";
import { BottomNavigation } from "./BottomNavigation";
import MultiSelect from "../MultiSelect";

import { Formik, Form, Field } from 'formik';

import classNames from 'classnames';
import { fetch } from "../../../helpers/Utils";

class ValidationWizard extends Component {

    wizard = null;

    state = {
        valid: false,
        processing: false,
        hasError: false,
        errorMessage: ""
    };
    
    validate(value, validationRules) {
        if(validationRules.includes("required")) {
            let error = false;
            if(Array.isArray(value) && value.length === 0) {
                error = true;
                this.setState({
                    valid: false
                });
            } else {
                if (value === null || value === "") {
                    error = true;
                    this.setState({
                        valid: false
                    });
                } else {
                    this.setState({
                        valid: true
                    });
                }
            }
            return error;
        }
    }

    next(next, steps, step) {
        const { valid } = this.state;
        if(valid) {
            return next();
        }
    }

    previous(previous, steps, step) {
        return previous();
    }

    topNavClick(step, push) {
        const { valid } = this.state;
        if(valid) {
            return push(step.id);
        }
    }

    async handleSubmit(values, action) {
        const { baseURL, token } = this.props;
        this.setState({
            processing: true
        });
        return await fetch(`${baseURL}${action.endpoint}`, {
            method: action.method,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(values)
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
                .catch( error => this.setState({
                    processing: false,
                    hasError: true,
                    errorMessage: error.message
                }) );
            } else {
                this.setState({
                    processing: false
                });
            }
        });
    }

    handleEnterPress(event) {
        const { valid } = this.state;
        if(event.keyCode === 13) {
            if(valid) {
                return this.wizard.next();
            }
        }
    }

    getWizardField(step, errors, touched) {
        const { type } = step;
        if(type === "text") {
            return (
                <div className="form-group">
                    <label className="">{step.label}</label>
                    <Field className="form-control" onKeyUp={ (event) => this.handleEnterPress(event) } name={step.name} validate={ (value) => this.validate(value, step.validationRules) } />
                    {errors[step.name] && touched[step.name] && <div className="invalid-feedback d-block">Please enter your {step.name}.</div>}
                </div>
            );
        }

        if(type === "ddl") {
            const { data, ddl } = step;
            let options = data.map( (option, index) => ({ key: index, label: option[ddl.label], value: option[ddl.value] }) );
            return (
                <div>
                    <Field load={ (values) => this.validate(values, step.validationRules) } onChange={ (values) => this.validate(values, step.validationRules) } name={step.name} onKeyUp={ (event) => this.handleEnterPress(event) } component={MultiSelect} options={options} />
                    {errors[step.name] && touched[step.name] && <div className="invalid-feedback d-block">Please enter your {step.name}.</div>}
                </div>
            );
        }
        
    }

    getSteps(steps, errors, touched) {
        const { processing, hasError, errorMessage } = this.state;
        steps = steps.map( step => {
            if(step.last) {
                return (
                    <Step hideTopNav key={step.id} id={step.id} render={ () => {
                        return (
                            <div className="wizard-basic-step text-center position-relative">
                                { processing ? (<div className="loading" />) : hasError ? 
                                (
                                    <div>
                                        <h2>Oops! We got a problem!</h2>
                                        <p>{errorMessage}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h2>{step.finishing.title}</h2>
                                        <p>{step.finishing.description}</p>
                                    </div>
                                ) }
                            </div>
                        );
                    }} />
                );
            }
            return (
                <Step key={step.id} id={step.id} name={step.title} desc={step.description} render={ () => {
                    return (
                        <div className="wizard-basic-step">
                            { this.getWizardField(step, errors, touched) }
                        </div>
                    );
                }} />
            );
        });
        return (
            <Steps>
                {steps}
            </Steps>
        );
        
    }

    render() {
        const { component: { action, steps } } = this.props;
        const initialValues = steps.filter( step => !step.last ).map( step => ([ [step.name], step.type === "ddl" ? [] : '' ]) );
        return (
            <div className={classNames('card', this.props.className)}>
                <div className="card-body">
                    <div className="wizard wizard-default">
                        <Formik
                            initialValues={{ ...Object.fromEntries(initialValues) }}
                            onSubmit={ (values) => this.handleSubmit(values, action) }
                            >
                            {({ errors, touched, isValidating }) => (
                                <Form onKeyDown={ (event) => (event.keyCode === 13 ? event.preventDefault() : null) } className="av-tooltip tooltip-label-right">
                                    <Wizard ref={ ref => this.wizard = ref }>
                                        <TopNavigation topNavClick={ (step, push) => this.topNavClick(step, push) } className="justify-content-center" />
                                            { this.getSteps(steps, errors, touched) }
                                        <BottomNavigation onClickPrev={ (previous, steps, step) => this.previous(previous, steps, step) } onClickNext={ (next, steps, step) => this.next(next, steps, step) } className="justify-content-center" prevLabel="Back" nextLabel="Next" />
                                    </Wizard>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        );
    }
}

export default ValidationWizard;
  