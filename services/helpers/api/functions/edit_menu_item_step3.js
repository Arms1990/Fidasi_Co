const { Page, MenuItem } = require('../../../database/models');

module.exports = edit_menu_item_step3 = async (body) => {

    const { roles, client, id, name, image, priority, page, parent, status } = body.data;

    const menuItemPage = await Page.query()
        .findById(page);
        
    if(!menuItemPage) {
        return {
            status: 200,
            outcome: 'KO',
            message: `The specified page doesn't exist.`
        };
    }

    if(parent) {
        const menuItemParent = await MenuItem.query()
            .findById(parent);
        if(!menuItemParent) {
            return {
                status: 200,
                outcome: 'KO',
                message: `The specified parent menu item doesn't exist.`
            };
        }
    }

    const menuItem = await MenuItem.query()
        .where('id', id)
        .update({
            name,
            image,
            priority,
            page_id: page,
            parent_id: parent ? parent : null,
            role_id: roles,
            status,
            client_id: client
        });  

    if(!menuItem) {
        return {
            status: 200,
            outcome: 'KO',
            message: 'An error occurred while updating the menu item.'
        };
    }

    return {
        status: 200,
        outcome: 'OK',
        data: body.data
    };
}