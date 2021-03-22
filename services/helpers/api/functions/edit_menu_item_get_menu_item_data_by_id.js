const { MenuItem, Role } = require('../../../database/models');

module.exports = edit_menu_item_get_menu_item_data_by_id = async (body) => {
    const { data } = body;
    
    const menuItemId = data[`M.id`];

    const menuItem = await MenuItem.query()
        .findById(menuItemId);

    if(!menuItem) {
        return {
            status: 200,
            outcome: 'KO',
            message: `The specified menu item doesn't exist`
        };
    }

    const menuItemRole = await Role.query()
        .findById(menuItem.role_id);

    return {
        status: 200,
        outcome: 'OK',
        data: {
            id: menuItemId,
            client: menuItem.client_id,
            roles: menuItemRole.id
        }
    };

}
