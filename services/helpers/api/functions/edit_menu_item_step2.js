const { Role, Page, MenuItem } = require('../../../database/models');

module.exports = edit_menu_item_step2 = async (body) => {
    let parent;
    const { roles: rawRole, client, id } = body.data;
    const role = await Role.query()
        .findById(rawRole);

    const menuItem = await MenuItem.query()
        .findById(id);

    if(!menuItem) {
        return {
            status: 200,
            outcome: 'KO',
            message: `The specified menu item doesn't exist`
        };
    }

    const page = await Page.query()
        .findById(menuItem.page_id);


    if(menuItem.parent_id) {
        parent = await MenuItem.query()
            .findById(menuItem.parent_id);
    }
    

    if(role) {
        return {
            status: 200,
            outcome: 'OK',
            data: {
                roles: rawRole,
                client,
                id,
                name: menuItem.name,
                image: menuItem.image,
                priority: menuItem.priority,
                status: menuItem.status,
                page: page.id,
                parent: parent ? parent.id : null
            }
        };
    } else {
        return {
            status: 200,
            outcome: 'KO',
            message: 'No such role exists.'
        };
    }
}