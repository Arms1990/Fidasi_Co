import React from 'react';
import axios from 'axios';
import { Button, Modal, ModalBody } from 'reactstrap';
import DropzoneComponent from 'react-dropzone-component';
import { fetch } from '../../helpers/Utils';
import { connect } from 'react-redux';
import { NotificationManager } from '../common/react-notifications';
import ImageViewer from './FileLibrary/ImageViewer';
const ReactDOMServer = require('react-dom/server');
const mime = require('mime-types');


const dropzoneConfig = {
  thumbnailHeight: 160,
  previewTemplate: ReactDOMServer.renderToStaticMarkup(
    <div className="dz-preview dz-file-preview mb-3">
      <div className="d-flex flex-row ">
        <div className="p-0 w-30 position-relative">
          <div className="dz-error-mark">
            <span>
              <i />{" "}
            </span>
          </div>
          <div className="dz-success-mark">
            <span>
              <i />
            </span>
          </div>
          <div className="preview-container">
            {/*  eslint-disable-next-line jsx-a11y/alt-text */}
            <img data-dz-thumbnail className="img-thumbnail border-0" />
            <i className="simple-icon-doc preview-icon" />
          </div>
        </div>
        <div className="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
          <div>
            {" "}
            <span data-dz-name />{" "}
          </div>
          <div className="text-primary text-extra-small" data-dz-size />
          <div className="dz-progress">
            <span className="dz-upload" data-dz-uploadprogress />
          </div>
          <div className="dz-error-message">
            <span data-dz-errormessage />
          </div>
        </div>
      </div>
      <a href="#/" className="remove" data-dz-remove>
        {" "}
        <i className="glyph-icon simple-icon-trash" />{" "}
      </a>
    </div>
  )
};


class FileLibrary extends React.Component {

    fileLibraryURL = `${process.env.REACT_APP_APPLICATION_PROTOCOL}://${process.env.REACT_APP_APPLICATION_HOST}:${process.env.REACT_APP_LIBRARY_SERVICE_PORT}`;

    attributes = {
      multiple: true,
      dictDefaultMessage: 'Select a file'
    };

    state = {
        selectedItems: [],
        isOpen: false,
        fetchingUploads: false
    };
    
    toggle = async () => {
      const { isOpen } = this.state;
      this.setState({
        isOpen: !isOpen,
        fetchingUploads: !isOpen
      }, async () => {
        if(this.state.isOpen) {
          return await this.fetchUploads();
        }
      });
    }

    clear() {
        this.dropzone.removeAllFiles(true);
    }

    handleSelectedItems = async (selectedItems) => {
      const { form, field } = this.props;

      form.setFieldValue(field.name, selectedItems);


      if(this.dropzone) {

        selectedItems.forEach( (selectedItem) => {

          const mockFile = {
            name: selectedItem,
            // size: contentLengthRequest.headers["content-length"],
            upload: {
              filename: selectedItem
            }
          };
          this.dropzone.emit("addedfile", mockFile);


        });
      }
    }

    renderLibraryContent = () => {
      const { fetchingUploads } = this.state;
      if(fetchingUploads) {
        return (
          <div>Loading...</div>
        );
      }
      return (
        <ImageViewer
          fileLibraryURL={this.fileLibraryURL}
          toggleModal={ (state) => this.setState({ isOpen: state }) }
          returnValues={ (selectedItems) => this.handleSelectedItems(selectedItems) }
        />
      );
    }

    fetchUploads = async () => {
      try {
        const request = await fetch(this.fileLibraryURL, {
          headers: {
            Authorization: `Bearer ${this.props.token}`
          }
        });
        const response = await request.json();
        if(!request.ok) {
          throw new Error(response.message || `An error occurred while fetching uploads.`);
        }
        return this.setState({
          fetchingUploads: false,
          uploads: response.uploads
        });
      } catch(e) {
        NotificationManager.error(`Failed to fetch uploads.`, `Error`, 3000, null, 1, null);
      }
    }
    
   

    render() {
        let { name, field, form, initialImages, hidden } = this.props;
        const { isOpen } = this.state;
        const externalCloseBtn = <button className="close right-modal-external-close-button" onClick={ async () => await this.toggle() }>&times;</button>;
        
        return !hidden ? (
            <div>
              <DropzoneComponent
                className="mb-3"
                config={{
                    postUrl: this.fileLibraryURL
                }}
                djsConfig={{
                    ...dropzoneConfig,
                    headers: {
                      Authorization: `Bearer ${this.props.token}`
                    },
                    paramName: name,
                    renameFile: function(file) {
                        const extension = file.name.substr(file.name.indexOf('.'))
                        //ACito cambio del nome
                        const name = file.name.substr(0,file.name.indexOf('.'));
                        const GetFormattedDate = (date) => 
                        {
                          var month = ("0" + (date.getMonth() + 1)).slice(-2);
                          var day  = ("0" + (date.getDate())).slice(-2);
                          var year = date.getFullYear();
                          var hour =  ("0" + (date.getHours())).slice(-2);
                          var min =  ("0" + (date.getMinutes())).slice(-2);
                          var seg = ("0" + (date.getSeconds())).slice(-2);
                          return year + "_" + month + "_" + day + "_" + hour + "_" +  min + "_" + seg;
                      };
                    
                        var data_file=GetFormattedDate(new Date());
                        
                       // var d = new Date();
                       // var data_file = d.toLocaleString().replace(/ /gm,"").replace(/,/gm,"").replace(/\//gm,"").replace(/:/gm,"");
                        return name + "_" + data_file + extension;
                    },
                    uploadMultiple: this.attributes.multiple || false,
                    maxFilesize: this.attributes.maxFileSize || undefined,
                    maxFiles: this.attributes.maxFiles || undefined,
                    dictDefaultMessage: this.attributes.dictDefaultMessage || undefined,
                    acceptedFiles: this.attributes.allowedExtensions
                }}
                eventHandlers = {{
                    success: (file, response) => {
                      const { form, field } = this.props;
                      const newFiles = [
                        ...this.state.selectedItems,
                        ...response.files.map( file => file.url )
                      ];
                      form.setFieldValue(field.name, newFiles);
                      return this.setState({
                        selectedItems: newFiles
                      });
                    },
                    init: async (dropzone) => {
                        this.dropzone = dropzone;
                        if(initialImages !== "") {
                          const contentLengthRequest = await axios({
                            url: initialImages,
                            type: "GET"
                          });
                          if(contentLengthRequest.status === 200) {
                            const mockFile = {
                              name: initialImages,
                              size: contentLengthRequest.headers["content-length"],
                              upload: {
                                filename: initialImages
                              }
                            };
                            dropzone.emit("addedfile", mockFile);
                            dropzone.options.thumbnail.call(dropzone, mockFile, initialImages);
                          }
                        }
                        this.dropzone.on("removedfile", async (file) => {
                            const removalRequest = await axios({
                                method: 'DELETE',
                                url: this.fileLibraryURL,
                                data: {
                                    name: file.upload.filename
                                }
                            });
                            if(removalRequest.status !== 201) {
                                return console.error(removalRequest.data.message);
                            }
                        });
                        this.dropzone.on("removedfile", async (file) => {
                            const removalRequest = await axios({
                                method: 'DELETE',
                                url: this.fileLibraryURL,
                                data: {
                                    name: file.upload.filename
                                }
                            });
                            if(removalRequest.status !== 201) {
                                return console.error(removalRequest.data.message);
                            }
                        });
                    }
                }}
              />
              <hr />
              <div className="text-right">
                <Button color="primary" onClick={ () => this.toggle() }>Browse Files</Button>
              </div>
              <Modal isOpen={isOpen} fade={false} toggle={ () => this.toggle() } modalClassName="modal-right" external={externalCloseBtn}>
                  <ModalBody>
                    { this.renderLibraryContent() }
                  </ModalBody>
              </Modal>
            </div>
        ) : null;
    }  

}


const mapStateToProps = ({ authUser }) => {
  const { token } = authUser;
  return { token };
};

export default connect(
  mapStateToProps,
  {}
)(FileLibrary);


// export default FileLibrary;