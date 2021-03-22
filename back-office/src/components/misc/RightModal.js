import React from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import { fetch } from '../../helpers/Utils';

class RightModal extends React.Component {

    state = {
        isOpen: false
    }
    
    toggle = () => this.setState({ isOpen: !this.state.isOpen });

    generateReport() {
        const { token, baseURL } = this.props;
        return fetch(`${baseURL}/api/generateReport`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .catch(error => console.error(error));
    }

    generateNotificationWithExternalNotification() {
        const { token, baseURL } = this.props;
        return fetch(`${baseURL}/api/generateNotificationWithExternalNotification`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .catch(error => console.error(error));
    }

    generateFileSavingNotification() {
        const { token, baseURL } = this.props;
        return fetch(`${baseURL}/api/generateFileSavingNotification`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .catch(error => console.error(error));
    }

    render() {
        const { className } = this.props;
        const { isOpen } = this.state;
        const externalCloseBtn = <button className="close right-modal-external-close-button" onClick={ () => this.toggle() }>&times;</button>;
        return (
            <div>
                <Button color="primary" className="right-modal-toggler" onClick={ () => this.toggle() }><span className="layer"></span></Button>
                <Modal isOpen={isOpen} fade={false} toggle={ () => this.toggle() } modalClassName={className} external={externalCloseBtn}>
                    <ModalBody>
                        <p><b>Look at the top right of the page/viewport!</b><br />
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <Button onClick={ () => this.generateReport() } color="primary">Generate Data</Button>
                        <Button className="my-2" onClick={ () => this.generateNotificationWithExternalNotification() } color="primary">Generate Notification With External Link</Button>
                        <Button onClick={ () => this.generateFileSavingNotification() } color="primary">Generate File Saving Notification</Button>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}


export default RightModal;