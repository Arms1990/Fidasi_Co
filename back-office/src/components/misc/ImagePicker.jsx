import React from 'react';
import axios from 'axios';
import DropzoneComponent from 'react-dropzone-component';
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


class ImagePicker extends React.Component {

    state = {
        uploadedImages: []
    };
    
    clear() {
        this.dropzone.removeAllFiles(true);
    }

    render() {
        let { name, onChange, attributes, initialImages, hidden } = this.props;
        return !hidden ? (
            <DropzoneComponent
            className="mb-3"
            config={{
                postUrl: attributes.action
            }}
            djsConfig={{
                ...dropzoneConfig,
                headers: {
                  Authorization: `Bearer ${this.props.token}`
                },
                paramName: name,
                renameFile: function(file) {
                    const extension = mime.extension(file.type);
                    return file.name.slice(0, 4) + Date.now() + "." + extension;
                },
                uploadMultiple: attributes.multiple || false,
                maxFilesize: attributes.maxFileSize || undefined,
                maxFiles: attributes.maxFiles || undefined,
                dictDefaultMessage: attributes.dictDefaultMessage || undefined,
                acceptedFiles: attributes.allowedExtensions.map( allowedExtension => allowedExtension.indexOf(".") === -1 ? `.${allowedExtension}` : allowedExtension ).join(",")
            }}
            eventHandlers = {{
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
                            url: attributes.removalAction,
                            data: {
                                name: file.upload.filename
                            }
                        });
                        if(removalRequest.status !== 201) {
                            return console.error(removalRequest.data.message);
                        }
                    });
                    this.dropzone.on("success", (file, response) => {
                        this.setState({
                            uploadedImages: [
                                ...this.state.uploadedImages,
                                ...response.files.map( file => file.url )
                            ]
                        }, () => {
                          return onChange(attributes.multiple ? this.state.uploadedImages : this.state.uploadedImages[0]);
                        });
                    });
                }
            }}
            />
        ) : null;
    }  

}


export default ImagePicker;