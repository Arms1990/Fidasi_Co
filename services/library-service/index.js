const _ = require('lodash');
const express = require('express');
const cors = require("cors");
const multer = require('multer');
const bodyParser = require("body-parser");
const path = require('path');
const fs = require('fs')
const { promisify } = require('util');
const { authenticate } = require('../identity-server/server');
const unlinkAsync = promisify(fs.unlink);
const mime = require('mime-types');
const thumbnail = require('../helpers/avatar/thumbnail');
const { FileUpload } = require('../database/models');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*' //`${process.env.APPLICATION_PROTOCOL}://${process.env.APPLICATION_HOST}:${process.env.BACK_OFFICE_PORT}`
  })
);

const uploadsDirectory = path.join(__dirname, '../', 'storage', 'uploads');
const timestamp = Date.now();

const attachmentUploader = multer({
    storage: multer.diskStorage({
        destination: uploadsDirectory,
        filename: function (req, file, cb) {
            cb(null, 
             file.originalname);
        }
    })
});

const attachmentUploadHandler = attachmentUploader.any();

const getMimeType = (file) => {
    return mime.lookup(file);
}

const isImage = (file) => {
    const mimeType = getMimeType(file);
    const imageMimeTypes = [ 'image/jpg', 'image/jpeg', 'image/png' ];
    return imageMimeTypes.includes(mimeType);
}

const generateThumbnail = async (file) => {
    const mimeType = getMimeType(file);
    const extension = mime.extension(mimeType);
    const image = await thumbnail({
        text: `.${extension}`,
        width: 512,
        height: 512,
        fontSize: 90
    });
    return image;
}


const paginateCollection = async (items, pageSize, page) => {
    let pg = parseInt(page, 10) || 1,
        pgSize = parseInt(pageSize, 10) || 12,
        offset = (pg - 1) * pgSize,
        pagedItems = _.drop(items, offset).slice(0, pgSize);
    return {
        totalItem: items.length,
        totalPage: Math.ceil(items.length / pgSize),
        data: pagedItems
    };
}

app.use('/uploads', express.static(uploadsDirectory));

app.get('/', authenticate(), async (req, res) => {
    const { pageSize, currentPage, orderBy } = req.query;
    //AC add section to manage the csv with correct user
    const recfiles = await FileUpload.query()
       .where('user_id', req.user.id);

    var recfile = recfiles.map(async obj =>{
        let thumbnail;
        const fileIsImage = isImage(obj.file_name);
        const url = `${process.env.APPLICATION_PROTOCOL}://${process.env.APPLICATION_HOST}:${process.env.LIBRARY_SERVICE_PORT}/uploads/${obj.file_name}`;
        if(!fileIsImage) {
            thumbnail = await generateThumbnail(obj.file_name);
        }
        return {
            id: obj.id,
            title: obj.file_name,
            thumbnail: fileIsImage ? url : thumbnail,
            url
        };
     });

/*
    const uploadedFilesMapped = fs.readdirSync(uploadsDirectory)
        .map( async (file, index) => {
            let thumbnail;
            const fileIsImage = isImage(file);
            const url = `${process.env.APPLICATION_PROTOCOL}://${process.env.APPLICATION_HOST}:${process.env.LIBRARY_SERVICE_PORT}/uploads/${file}`;
            if(!fileIsImage) {
                thumbnail = await generateThumbnail(file);
            }
            return {
                id: index,
                title: file,
                thumbnail: fileIsImage ? url : thumbnail,
                url
            };
        });
  */  
    //let uploadedFiles = await Promise.all(uploadedFilesMapped);
    let uploadedFiles = await Promise.all(recfile);
    if(orderBy) {
        if(orderBy === "name_asc") {
            uploadedFiles = _.orderBy(uploadedFiles, ['title'], ['asc']);
        }
        if(orderBy === "name_desc") {
            uploadedFiles = _.orderBy(uploadedFiles, ['title'], ['desc']);
        }
    }
    const pagination = await paginateCollection(uploadedFiles, pageSize, currentPage);
    return res.json(pagination);
});

app.post('/', authenticate(), async (req, res) => {
    return attachmentUploadHandler(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: err.message });
        } else if (err) {
            return res.status(500).json({ message: err.message });
        }
        return res.status(200).json({
            files: req.files.map( file => {
                //AC INC: to create correct file name
                //return ({ ...file, url: `${process.env.APPLICATION_PROTOCOL}://${process.env.APPLICATION_HOST}:${process.env.LIBRARY_SERVICE_PORT}/uploads/${file.filename}` });
                return ({ ...file, url:`${file.filename}` });
             } )
        });
    });
});

app.delete('/remove', authenticate(), async (req, res) => {
    try {
        await unlinkAsync(path.join(__dirname, '../', 'storage', 'uploads', req.body.name))
        return res.status(201).send();
    } catch(e) {
        return res.status(500).json({
            message: e.message
        });
    }
});

app.listen(process.env.LIBRARY_SERVICE_PORT, () => {
    console.log(`Library Service listening on *:${process.env.LIBRARY_SERVICE_PORT}`);
});