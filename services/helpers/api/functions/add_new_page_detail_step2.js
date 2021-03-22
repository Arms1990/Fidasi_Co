const { PageDetail } = require('../../../database/models');

function isJSON(str) {
    if(Array.isArray(str)) return true;
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]' 
            || type === '[object Array]';
    } catch (err) {
        return false;
    }
}

module.exports = add_new_page_detail_step2 = async (body) => {
    const { page, role, function: functionName, details, status } = body.data;

    const jsonCheck = isJSON(details);

    if(!jsonCheck) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'The page details are not valid. Please check the syntax.'
        };
    }

    const pageDetail = await PageDetail.query()
        .insert({
            function: functionName,
            details,
            status,
            page_id: page,
            role_id: role
        });

    if(!pageDetail) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'An error occurred while creating page details.'
        };
    }

    return {
        status: 200,
        outcome: 'OK',
        data: body.data
    }
}
