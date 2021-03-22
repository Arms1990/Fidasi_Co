const { menuItemStatuses } = require('../enums');

exports.seed = async function(knex) {
  const oauth_client = await knex.withSchema('bo').from('oauth_clients').first();
  const administratorRole = await knex.withSchema('bo').from('roles').where('name', 'administrator').first();
  const operatorRole = await knex.withSchema('bo').from('roles').where('name', 'operator').first();
  const agentRole = await knex.withSchema('bo').from('roles').where('name', 'agent').first();

  
  const dashboardPage = await knex.withSchema('bo').from('pages').where('slug', 'dashboard').first();

  const crmPage = await knex.withSchema('bo').from('pages').where('slug', 'crm').first();
  const entriesPage = await knex.withSchema('bo').from('pages').where('slug', 'entries').first();

  const profilePage = await knex.withSchema('bo').from('pages').where('slug', 'profile').first();

  const usersManagementPage = await knex.withSchema('bo').from('pages').where('slug', 'users').first();
  const uiManagementPage = await knex.withSchema('bo').from('pages').where('slug', 'ui').first();
  
  
  const backOfficeManagementPage = await knex.withSchema('bo').from('pages').where('slug', 'back-office').first();

  const detailsPage = await knex.withSchema('bo').from('pages').where('slug', 'details').first();
  const componentsPage = await knex.withSchema('bo').from('pages').where('slug', 'components').first();

  await knex.withSchema('bo')
    .from('menu_items')
    .del();

  await knex.withSchema('bo')
    .from('menu_items')
    .insert({
      name: 'Dashboard',
      image: 'iconsminds-dashboard',
      priority: 1,
      status: menuItemStatuses.A,
      page_id: dashboardPage.id,
      role_id: administratorRole.id,
      client_id: oauth_client.id
    });

  let uiManagementMenuItem = await knex.withSchema('bo')
  .from('menu_items')
  .insert({
    name: 'UI Management',
    image: 'iconsminds-line-chart-1',
    priority: 2,
    status: menuItemStatuses.A,
    page_id: uiManagementPage.id,
    role_id: administratorRole.id,
    client_id: oauth_client.id
  }).returning('*');
  uiManagementMenuItem = uiManagementMenuItem[0];

  let usersManagementMenuItem = await knex.withSchema('bo')
    .from('menu_items')
    .insert({
      name: 'Users Management',
      image: 'iconsminds-mens',
      priority: 3,
      status: menuItemStatuses.A,
      page_id: usersManagementPage.id,
      role_id: administratorRole.id,
      client_id: oauth_client.id
    }).returning('*');
    usersManagementMenuItem = usersManagementMenuItem[0];
    
  return await knex.withSchema('bo')
    .from('menu_items')
    .insert([
   
      
      {
        name: 'CRM',
        image: 'simple-icon-people',
        priority: 1,
        status: menuItemStatuses.A,
        page_id: crmPage.id,
        role_id: administratorRole.id,
        client_id: oauth_client.id
      },

      {
        name: 'CRM',
        image: 'simple-icon-people',
        priority: 1,
        status: menuItemStatuses.A,
        page_id: crmPage.id,
        role_id: operatorRole.id,
        client_id: oauth_client.id
      },

      

      {
        name: 'Entries',
        image: 'simple-icon-docs',
        priority: 1,
        status: menuItemStatuses.A,
        page_id: entriesPage.id,
        role_id: agentRole.id,
        client_id: oauth_client.id
      },

      {
        name: 'Profilo',
        image: 'iconsminds-profile',
        priority: 1,
        status: menuItemStatuses.A,
        page_id: profilePage.id,
        role_id: administratorRole.id,
        client_id: oauth_client.id
      },

      {
        name: 'Profilo',
        image: 'iconsminds-profile',
        priority: 1,
        status: menuItemStatuses.A,
        page_id: profilePage.id,
        role_id: operatorRole.id,
        client_id: oauth_client.id
      },

      {
        name: 'Profilo',
        image: 'iconsminds-profile',
        priority: 1,
        status: menuItemStatuses.A,
        page_id: profilePage.id,
        role_id: agentRole.id,
        client_id: oauth_client.id
      },


      {
        name: 'Back Office Management',
        image: 'iconsminds-building',
        priority: 1,
        status: menuItemStatuses.A,
        page_id: backOfficeManagementPage.id,
        parent_id: uiManagementMenuItem.id,
        role_id: administratorRole.id,
        client_id: oauth_client.id
      },
 
      {
        name: 'Details',
        image: 'iconsminds-tag-3',
        priority: 1,
        status: menuItemStatuses.N,
        page_id: detailsPage.id,
        role_id: administratorRole.id,
        client_id: oauth_client.id
      },
      {
        name: 'Components',
        image: 'iconsminds-coding',
        priority: 1,
        status: menuItemStatuses.N,
        page_id: componentsPage.id,
        role_id: administratorRole.id,
        client_id: oauth_client.id
      }
    ]);
};
