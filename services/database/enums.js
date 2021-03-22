
const userStatuses = {
    A: "A",
    N: "N"
};

const productEditorStatuses = {
    A: "A",
    N: "N"
};

const orderStatuses = {
    A: "A",
    N: "N"
};


const roleStatuses = {
    A: "A",
    N: "N"
};

const ruleStatuses = {
    A: "A",
    N: "N"
};

const menuItemStatuses = {
    A: "A",
    N: "N"
};

const pageStatuses = {
    A: "A",
    N: "N"
};

const pageDetailStatuses = {
    A: "A",
    N: "N"
};

const productStatuses = {
    A: "A",
    N: "N"
};

const couponStatuses = {
    A: "A",
    N: "N"
};


const attachmentTypes = {
    URL: "URL",
    Icon: "Icon",
    Other: "Other"
};

const elaborationTypes = {
    N: "Normal",
    R: "Restart"
};

const findKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value);


module.exports = {
    userStatuses,
    roleStatuses,
    ruleStatuses,
    menuItemStatuses,
    pageStatuses,
    pageDetailStatuses,
    productStatuses,
    couponStatuses,
    orderStatuses,
    attachmentTypes,
    elaborationTypes,
    productEditorStatuses,
    findKeyByValue
};