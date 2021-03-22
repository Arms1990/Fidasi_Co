
const { validate } = require('../helpers/validation/index');
const { layout } = require('../helpers/ui/index');
const { logger } = require('./logs');



let baseURL = `https://api.sandbox.bigbuy.eu`;


if(process.env.NODE_ENV === "production") {
	baseURL = `https://api.bigbuy.eu`;
}

const availablePaymentMethods = [
    "moneybox",
    "paypal",
    "bankwire"
];


const {
    addElaboration,
    endElaboration,
    getElaboration,
    getElaborationByProcedure
} = require('./elaboration');

module.exports = {
    validate,
    layout,
    logger,
    addElaboration,
    endElaboration,
    getElaboration,
    getElaborationByProcedure,
    baseURL,
    availablePaymentMethods
};