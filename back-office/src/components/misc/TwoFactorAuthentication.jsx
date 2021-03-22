import React from 'react';
import Switch from 'rc-switch';
import { connect } from 'react-redux';
import { NotificationManager } from "../common/react-notifications";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class TwoFactorAuthentication extends React.Component {

    state = {
        processing: false,
        isOpen: false,
        qrcode: ''
    }

    async checkTwoFactor(checked) {
        let { form, field, authenticationServer, token } = this.props;
        if(checked) {
            this.setState({
                processing: true
            });
            return await fetch(`${authenticationServer}/tfa/setup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then( async (response) => {
                this.setState({
                    processing: false
                  });
                if(!response.ok) {
                    response.json()
                    .then( response => {
                        throw new Error(response.message);
                    } )
                    .catch( error => {
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
                    response = await response.text();
                    this.setState({
                        isOpen: true,
                        qrcode: response
                    });
                }
            });
        } else {
            this.setState({
                processing: true
            });
            return await fetch(`${authenticationServer}/tfa/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then( async (response) => {
                this.setState({
                    processing: false
                  });
                if(!response.ok) {
                    response.json()
                    .then( response => {
                        throw new Error(response.message);
                    } )
                    .catch( error => {
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
                    form.setFieldValue(field.name, false);
                    NotificationManager.success(
                        "Two Factor Authentication has been turned off successfully.",
                        "Success",
                        3000,
                        null,
                        null,
                        ''
                    );
                }
            });


        }
    }

    async scanSuccess() {
        this.setState({
            processing: true
        });
        const { authenticationServer, token } = this.props;
        return await fetch(`${authenticationServer}/tfa/scan-success`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then( async (response) => {
            this.setState({
                processing: false
              });
            if(!response.ok) {
                response.json()
                .then( response => {
                    throw new Error(response.message);
                } )
                .catch( error => {
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
                NotificationManager.success(
                    "Two Factor Authentication has been turned on successfully.",
                    "Success",
                    3000,
                    null,
                    null,
                    ''
                );
            }
        });
    }

    toggleModal() {
        const { isOpen } = this.state;
        return this.setState({
            isOpen: !isOpen
        });
    }

    cancel() {
        const { form, field } = this.props;
        form.setFieldValue(field.name, false);
        return this.toggleModal();
    }

    async scanned() {
        const { processing } = this.state;
        let { form, field, user } = this.props;
        if(!processing) {
            await this.scanSuccess();
            form.setFieldValue(field.name, true);
            user = JSON.parse(user);
            let updatedUser = Object.assign(user, {
                tfaEnabled: true
            });
            localStorage.setItem('user', JSON.stringify(updatedUser));
            this.toggleModal();
            window.location.reload();
        }
    }

    render() {
        let { field, onKeyUp, hidden } = this.props;
        const { isOpen, qrcode, processing } = this.state;
        return !hidden ? (
            <div>
                <Modal backdrop="static" centered isOpen={isOpen} toggle={ () => this.toggleModal() }>
                    <ModalHeader>Scan QR Code</ModalHeader>
                    <ModalBody>
                        <div className="text-center" dangerouslySetInnerHTML={{ __html: qrcode }} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="button" onClick={ () => this.cancel() } outline>Cancel</Button>
                        <Button color="primary" type="button" onClick={ () => this.scanned() }>{processing ? 'Processing...' : 'Scanned!'}</Button>
                    </ModalFooter>
                </Modal>
                <Switch
                    name={field.name}
                    value={field.value}
                    onBlur={field.onBlur}
                    onKeyUp={ (event) => onKeyUp(event) }
                    checked={field.value}
                    onChange={ (checked) => {
                        return this.checkTwoFactor(checked);
                    } }
                />
            </div>
        ) : null;
    }

}

const mapStateToProps = ({ authUser }) => {
    const { authenticationServer, token, user } = authUser;
    return { authenticationServer, token, user };
};

export default connect(mapStateToProps, {})(TwoFactorAuthentication)