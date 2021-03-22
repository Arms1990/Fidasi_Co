const { Page, MenuItem } = require('../../../database/models');

module.exports = add_new_menu_item_step3 = async (body) => {

    const { data } = body;
    const { client, roles, name, image, priority, page, parent, status } = data;

    const pageIdCheck = await Page.query()
        .findById(page);
    
    if(!pageIdCheck) {
        return {
            status: 200,
            outcome: 'KO',
            message: `The specified page doesn't exist.`
        };
    }

    if(parent) {
        const parentIdCheck = await MenuItem.query()
            .findById(parent);
        
        if(!parentIdCheck) {
            return {
                status: 200,
                outcome: 'KO',
                message: `The specified parent menu item doesn't exist.`
            };
        }
    }

    const menuItem = await MenuItem.query()
        .insert({
            name,
            image,
            priority,
            status,
            page_id: page,
            parent_id: parent ? parent : null,
            role_id: roles,
            client_id: client
        });

    if(!menuItem) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'An error occurred while creating menu item.'
        };
    }

    return {
        status: 200,
        outcome: 'OK',
        data: body.data
    };
}