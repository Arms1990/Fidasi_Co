const { pageStatuses } = require('../enums');

exports.seed = async function(knex) {
  const oauth_client = await knex.withSchema('bo').from('oauth_clients').first();
  return await knex.withSchema('bo')
    .from('pages')
    .del()
    .insert([
      {
        name: 'Dashboard',
        slug: 'dashboard',
        description: 'Dashboard is used to view the available UI components of the application.',
        client_id: oauth_client.id,
        status: pageStatuses.A
      },
      {
        name: 'CRM',
        slug: 'crm',
        description: 'CRM is used to view the available UI components of the application.',
        client_id: oauth_client.id,
        status: pageStatuses.A
      },
      {
        name: 'Entries',
        slug: 'entries',
        description: 'Entries is used to view the available UI components of the application.',
        client_id: oauth_client.id,
        status: pageStatuses.A
      },
      {
        name: 'Profile',
        slug: 'profile',
        description: 'Profile is used to view the available UI components of the application.',
        client_id: oauth_client.id,
        status: pageStatuses.A
      },
      {
        name: 'Users Management',
        slug: 'users',
        description: 'Users Management is used to view the available UI components of the application.',
        client_id: oauth_client.id,
        status: pageStatuses.A
      },
      {
        name: 'UI Management',
        slug: 'ui',
        description: 'UI Management is used to view the available UI components of the application.',
        client_id: oauth_client.id,
        status: pageStatuses.A
      },
      {
        name: 'Back Office',
        slug: 'back-office',
        description: 'Back Office is used to view the available UI components of the application.',
        client_id: oauth_client.id,
        status: pageStatuses.A
      },
      {
        name: 'Details',
        slug: 'details',
        description: 'Product Details is used to view the available UI components of the application.',
        client_id: oauth_client.id,
        status: pageStatuses.A
      },
      {
        name: 'Components',
        slug: 'components',
        description: 'Components is used to view the available UI components of the application.',
        client_id: oauth_client.id,
        status: pageStatuses.A
      },
      {
        name: 'Test',
        slug: 'test',
        description: 'Test is used to view the available UI components of the application.',
        client_id: oauth_client.id,
        status: pageStatuses.A
      },
    ]);
};
