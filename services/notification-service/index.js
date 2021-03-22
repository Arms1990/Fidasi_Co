const crypto = require("crypto");
const express = require("express");
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require("body-parser");
const cors = require("cors");
const { User, OAuthAccessToken, Notification } = require('../database/models');
const { authenticate } = require('../identity-server/server');
const { paginateCollection } = require("../helpers/ui/query");
const notificationsInternalFunctions = require('../helpers/notifications');


/*
 * To send the notification, use the following line of code:
 * io.sockets.emit('private.notifications.User.1', notification);
*/


const app = express();

const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: `*` //`${process.env.APPLICATION_PROTOCOL}://${process.env.APPLICATION_HOST}:${process.env.BACK_OFFICE_PORT}`
  })
);


const io = socketIO(server, {
  cors: {
    origin: `${process.env.APPLICATION_PROTOCOL}://${process.env.APPLICATION_HOST}:${process.env.BACK_OFFICE_PORT}`,
    credentials: true
  }
});

io.use( async (socket, next) => {
  try {
    const token = socket.handshake.headers['x-auth-token'];
    const accessToken = await OAuthAccessToken.query()
      .where('access_token', token)
      .first();
    if(!accessToken) {
      throw new Error(`Invalid token`);
    }
    const verificationHash = crypto
        .createHmac('sha256', process.env.SECRET_SIGNING_KEY)
        .update(accessToken.token)
        .digest('hex');
    if(accessToken.access_token !== verificationHash) {
      throw new Error(`Unauthorized`);
    }
    const user = await User.query()
        .findById(accessToken.user_id);
    if(!user) {
      throw new Error(`Unknown user`);
    }
    socket.user = user;
    next();
  } catch(e) {
    next(e);
  }
 
});

app.get('/notifications', authenticate(), async (req, res) => {
  const currentPage = parseInt(req.query.currentPage, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 8;
  const notifications = await Notification.query()
    .where('client_id', req.user.client_id)
    .where('notifiable_type', User.name)
    .where('notifiable_id', req.user.id)
    .where('visualize', 'S')
    .orderBy('created_at', 'DESC');
  const unreadNotificationsCount = await Notification.query()
    .where('client_id', req.user.client_id)
    .where('notifiable_type', User.name)
    .where('notifiable_id', req.user.id)
    .where('seen', 'N')
    .count('id');

  const pagination = await paginateCollection(notifications, pageSize, currentPage);
  return res.json({
    nextPageURL: pagination.total_pages === currentPage ? null : `${process.env.APPLICATION_PROTOCOL}://${process.env.APPLICATION_HOST}:${process.env.NOTIFICATION_SERVICE_PORT}/notifications?currentPage=${pagination.total_pages > 1 ? currentPage + 1 : currentPage }&pageSize=${pageSize}`,
    notifications: pagination.data,
    unreadNotificationsCount: unreadNotificationsCount[0] ? unreadNotificationsCount[0].count : 0
  });
});

app.post('/notification/:id', authenticate(), async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.query()
      .select('action', 'payload')
      .where('id', notificationId)
      .where('client_id', req.user.client_id)
      .where('notifiable_type', User.name)
      .where('notifiable_id', req.user.id)
      .first();
    if(!notification) {
      throw new Error(`Notification not found`);
    }
    await Notification.query()
      .where('id', notificationId)
      .update({
        seen: 'S'
      });
    if(!notification.action) {
      throw new Error( `No further processing available.`);
    }
    if(!notificationsInternalFunctions[notification.action]) {
      throw new Error( `The specified action wasn't found.`);
    }
    return await notificationsInternalFunctions[notification.action](req, res, notification.payload);
  } catch(e) {
    return res.status(400).json({
      message: e.message
    });
  }
});

app.post('/notifications', authenticate(), async (req, res) => {
  try {
    const notifications = await Notification.query()
      .patch({
        seen: 'S',
        data_visualitione: new Date()
      })
      .where('client_id', req.user.client_id)
      .where('notifiable_type', User.name)
      .where('notifiable_id', req.user.id)
      .where('visualize', 'S')
      .where('seen', 'N')
      .returning('*');
    if(!notifications) {
      throw new Error(`An error occurred while marking notifications as read.`);
    }
    return res.json({
      notifications: await notifications
    });
  } catch(e) {
    return res.status(400).json({
      message: e.message
    });
  }
});

app.post('/notification', authenticate(), async (req, res) => {
  try {
    const { message, image, visualize, type, payload, action, client_id, user_id } = req.body;
    const notification = await Notification.query()
      .insert({
        client_id,
        notifiable_id: user_id,
        notifiable_type: User.name,
        type,
        visualize,
        data_creation: new Date(),
        message,
        payload,
        action,
        image,
        seen: 'N',
        user_created: req.user.id
      });
    if(!notification) {
      throw new Error(`An error occurred while creating a notification.`);
    }
    io.sockets.emit(`private.notifications.User.${user_id}`, notification);
    return res.json({
      message: `The notification has been sent successfully.`
    });
  } catch(e) {
    return res.status(400).json({
      message: e.message
    });
  }
});


server.listen(process.env.NOTIFICATION_SERVICE_PORT, () => {
  console.log(`Notification Service listening on *:${process.env.NOTIFICATION_SERVICE_PORT}`);
});
