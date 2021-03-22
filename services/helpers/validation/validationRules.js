const { userStatuses } = require('../../database/enums');

const validateUserScopes = (req) => req.user.scopes.length > 0;

const validateUserStatus = (req) => req.user.status === userStatuses.A;

module.exports = {
    validateUserScopes,
    validateUserStatus
};