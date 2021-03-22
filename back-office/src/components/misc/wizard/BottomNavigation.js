import React, { Component } from "react";
import { WithWizard } from 'react-albus';
import { Button } from "reactstrap";

export class BottomNavigation extends Component {
    render() {
        const { processing } = this.props;
        return (
            <WithWizard render={({ next, previous, step, steps }) => (
                <div className={"wizard-buttons " + this.props.className}>
                    {
                    steps.indexOf(step) > 0 ? 
                        <Button color="primary"
                            disabled={(steps.indexOf(step) <= 0) || processing}
                            className={"mr-1 " + ((steps.indexOf(step) <= 0) || processing ? "disabled" : "")}
                            onClick={() => { this.props.onClickPrev(previous, steps, step) }}>
                            {this.props.prevLabel}
                        </Button>
                    : null }
                    <Button color="primary"
                        disabled={processing}
                        type="submit"
                        // type={steps.indexOf(step) >= steps.length - 1 ? "submit" : "button"}
                        className={(processing ? "disabled" : "")}
                        onClick={() => { this.props.onClickNext(next, steps, step) }}>
                        { steps.indexOf(step) >= steps.length - 1 ? "Submit" : this.props.nextLabel}
                    </Button>
                </div>
            )} />
        )
    }
}
