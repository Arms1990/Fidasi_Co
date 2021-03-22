const { pageDetailStatuses, pageStatuses } = require('../enums');


exports.seed = async function(knex) {

  const componentsPage = await knex.withSchema('bo').from('pages').where('slug', 'components').first();
  const dashboardPage = await knex.withSchema('bo').from('pages').where('slug', 'dashboard').first();
  const detailsPage = await knex.withSchema('bo').from('pages').where('slug', 'details').first();
  const usersManagementPage = await knex.withSchema('bo').from('pages').where('slug', 'users').first();
  const backOfficeManagementPage = await knex.withSchema('bo').from('pages').where('slug', 'back-office').first();

  const crmPage = await knex.withSchema('bo').from('pages').where('slug', 'crm').first();

  const entriesPage = await knex.withSchema('bo').from('pages').where('slug', 'entries').first();



  const profilePage = await knex.withSchema('bo').from('pages').where('slug', 'profile').first();
  
  const testPage = await knex.withSchema('bo').from('pages').where('slug', 'test').first();


  const administratorRole = await knex.withSchema('bo').from('roles').where('name', 'administrator').first();
  const operatorRole = await knex.withSchema('bo').from('roles').where('name', 'operator').first();
  const agentRole = await knex.withSchema('bo').from('roles').where('name', 'agent').first();

  return await knex.withSchema('bo')
    .from('page_details')
    .del()
    .insert([
      {
        function: 'search',
        details: `{
          "id":"utenti_loggati_search",
          "type":"search",
          "title":"Utenti Loggati",
          "isSmall": true,
          "sql": "SELECT id, concat(first_name, ' ', last_name) as title, concat('@', user_id) as description, image, to_char(created_at, \'YYYY.mm.dd\') as date FROM bo.users ORDER BY created_at DESC LIMIT 5"
        }`,
        status: pageDetailStatuses.A,
        page_id: dashboardPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'dataTable',
        details: `{
          "id":"example_datatable",
          "type":"dataTable",
          "tables":[
            {
              "identifier": "users",
              "table": "bo.users",
              "isActual":true
            },
            {
              "identifier":"userRoles",
              "table": "bo.user_roles"
            },
            {
              "identifier":"roles",
              "table": "bo.roles",
              "isActualLast":true
            }
          ],
          "legend":"DataTable",
          "sql":"SELECT |columns| FROM **users** JOIN **userRoles** ON **userRoles**.user_id=**users**.id JOIN **roles** ON **roles**.id=**userRoles**.user_id",
          "buttons":[
            {
              "label":"Add User",
              "action":"add",
              "element":"add_new_user_wizard1"
            }
          ],
          "columns":[
            {
              "label":"ID",
              "identifier":"**users**.id",
              "as":"**users**.id",
              "attributes":{
                "excluded":true
              }
            },
            {
              "label":"First Name",
              "identifier":"**users**.first_name",
              "as":"**users**.first_name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Last Name",
              "identifier":"**users**.last_name",
              "as":"**users**.last_name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Company",
              "identifier":"**users**.company",
              "as":"**users**.company",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Email Address",
              "identifier":"**users**.email_address",
              "as":"**users**.email_address",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Password",
              "identifier":"**users**.password",
              "as":"**users**.password",
              "attributes":{
                "required":true,
                "type":"password"
              }
            },
            {
              "label":"User ID",
              "identifier":"**users**.user_id",
              "as":"**users**.user_id",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Role",
              "identifier":"**roles**.name",
              "as":"**roles**.name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'ddl',
        details: `{
          "id":"example_ddl",
          "type":"ddl",
          "tables":[
            {
              "identifier":"users",
              "table":"bo.users",
              "isActual":true
            }
          ],
          "legend":"DDL",
          "sql":"SELECT |columns| FROM **users**",
          "columns":[
            {
              "label":"ID",
              "identifier":"**users**.id",
              "as":"**users**.id",
              "attributes":{
                "excluded":true
              },
              "inDrillDown":true,
              "rel":"example_ddl_roles_by_user"
            },
            {
              "label":"First Name",
              "identifier":"**users**.first_name",
              "as":"**users**.first_name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Last Name",
              "identifier":"**users**.last_name",
              "as":"**users**.last_name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Email Address",
              "identifier":"**users**.email_address",
              "as":"**users**.email_address",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"User ID",
              "identifier":"**users**.user_id",
              "as":"**users**.user_id",
              "attributes":{
                "required":true,
                "type":"text"
              }
            }
          ],
          "children":[
            {
              "id":"example_ddl_roles_by_user",
              "type":"ddl",
              "tables":[
                {
                  "identifier":"userRoles",
                  "table":"bo.user_roles"
                },
                {
                  "identifier":"users",
                  "table":"bo.users"
                },
                {
                  "identifier":"roles",
                  "table":"bo.roles"
                }
              ],
              "legend":"User Roles",
              "sql":"SELECT |columns| FROM **roles** JOIN **userRoles** ON **userRoles**.role_id=**roles**.id JOIN **users** ON **users**.id=\'@**users**.id@\'",
              "columns":[
                {
                  "label":"ID",
                  "identifier":"**userRoles**.id",
                  "as":"**userRoles**.id",
                  "attributes":{
                    "required":true
                  }
                },
                {
                  "label":"Role",
                  "identifier":"**roles**.name",
                  "as":"**roles**.name",
                  "attributes":{
                    "required":true
                  }
                },
                {
                  "label":"Manage",
                  "type":"action",
                  "key":"managed_data",
                  "identifier":[
                    {
                      "identifier": "**roles**.id",
                      "as": "**roles**.id"
                    }
                  ],
                  "attributes":{
                    "excluded":"true"
                  },
                  "inModal":true,
                  "rel":"example_ddl_deep_roles_usage"
                }
              ],
              "children":[
                {
                  "id":"example_ddl_deep_roles_usage",
                  "type":"dataTable",
                  "tables":[
                    {
                      "identifier":"menuItems",
                      "table":"bo.menu_items"
                    },
                    {
                      "identifier":"roles",
                      "table":"bo.roles"
                    }
                  ],
                  "legend":"Menu Items Allowed To This Scope",
                  "sql":"SELECT |columns| FROM **menuItems** WHERE role_id=\'@**roles**.id@\'",
                  "columns":[
                    {
                      "label":"ID",
                      "identifier":"**menuItems**.id",
                      "as":"**menuItems**.id",
                      "attributes":{
                        "required":true
                      }
                    },
                    {
                      "label":"Name",
                      "identifier":"**menuItems**.name",
                      "as":"**menuItems**.name",
                      "attributes":{
                        "required":true
                      }
                    },
                    {
                      "label":"Priority",
                      "identifier":"**menuItems**.priority",
                      "as":"**menuItems**.priority",
                      "attributes":{
                        "required":true
                      }
                    },
                    {
                      "label":"Status",
                      "identifier":"**menuItems**.status",
                      "as":"**menuItems**.status",
                      "attributes":{
                        "required":true
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      }, {
        function: 'chart',
        details: `[
          {
            "render": false,
            "id":"example_pie_chart_not_individual",
            "type":"chart",
            "legend":"Pie Chart",
            "kind":"pie",
            "elements":[
              "example_carousel"
            ],
            "datasets":[
              {
                "table":"sample_data",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_sales",
                "label":"Sales",
                "columns":[
                  {
                    "label":"Sales",
                    "identifier":"value as number_of_sales"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              },
              {
                "table":"bo.users",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_users",
                "label":"Users",
                "columns":[
                  {
                    "label":"Users",
                    "identifier":"id as number_of_users"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              }
            ]
          },
          {
            "render":false,
            "id":"example_bar_chart_not_individual",
            "type":"chart",
            "legend":"Bar Chart",
            "kind":"bar",
            "elements":[
              "example_carousel"
            ],
            "datasets":[
              {
                "table":"sample_data",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_sales",
                "label":"Sales",
                "columns":[
                  {
                    "label":"Sales",
                    "identifier":"value as number_of_sales"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              },
              {
                "table":"bo.users",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_users",
                "label":"Users",
                "columns":[
                  {
                    "label":"Users",
                    "identifier":"id as number_of_users"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              }
            ]
          },
          {
            "id":"example_card_graphs2",
            "type":"card",
            "transparent":true,
            "title":"Card title",
            "image":"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.freecreatives.com%2Fwp-content%2Fuploads%2F2015%2F04%2Flogo033.png&f=1&nofb=1",
            "description":"Card subtitle",
            "children":[
              "example_doughnut_chart_not_individual",
              "example_line_chart_not_individual"
            ]
          },
          {
            "render":false,
            "id":"example_doughnut_chart_not_individual",
            "type":"chart",
            "elements":[
              "example_carousel"
            ],
            "legend":"Doughnut Chart",
            "kind":"doughnut",
            "datasets":[
              {
                "table":"sample_data",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_sales",
                "label":"Sales",
                "columns":[
                  {
                    "label":"Sales",
                    "identifier":"value as number_of_sales"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              },
              {
                "table":"bo.users",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_users",
                "label":"Users",
                "columns":[
                  {
                    "label":"Users",
                    "identifier":"id as number_of_users"
                  },
                  {
                    "label":"Month",
                    "identifier":"to_char(created_at, \'YYYY-mm\') as month"
                  }
                ]
              }
            ]
          },
          {
            "render":false,
            "id":"example_line_chart_not_individual",
            "type":"chart",
            "elements":[
              "example_carousel"
            ],
            "legend":"Line Chart",
            "kind":"line",
            "datasets":[
              {
                "table":"sample_data",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_sales",
                "label":"Sales",
                "columns":[
                  {
                    "label":"Sales",
                    "identifier":"value as number_of_sales"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              },
              {
                "table":"bo.users",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_users",
                "label":"Users",
                "columns":[
                  {
                    "label":"Users",
                    "identifier":"id as number_of_users"
                  },
                  {
                    "label":"Month",
                    "identifier":"to_char(created_at, \'YYYY-mm\') as month"
                  }
                ]
              }
            ]
          },
          {
            "render":false,
            "id":"example_area_chart_not_individual",
            "type":"chart",
            "elements":[
              "example_carousel"
            ],
            "legend":"Area Chart",
            "kind":"area",
            "datasets":[
              {
                "table":"sample_data",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_sales",
                "label":"Sales",
                "columns":[
                  {
                    "label":"Sales",
                    "identifier":"value as number_of_sales"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              },
              {
                "table":"bo.users",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_users",
                "label":"Users",
                "columns":[
                  {
                    "label":"Users",
                    "identifier":"id as number_of_users"
                  },
                  {
                    "label":"Month",
                    "identifier":"to_char(created_at, \'YYYY-mm\') as month"
                  }
                ]
              }
            ]
          },
          {
            "render":true,
            "id":"example_pie_chart",
            "type":"chart",
            "legend":"Pie Chart Individual",
            "kind":"pie",
            "datasets":[
              {
                "table":"sample_data",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_sales",
                "label":"Sales",
                "columns":[
                  {
                    "label":"Sales",
                    "identifier":"value as number_of_sales"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              },
              {
                "table":"bo.users",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_users",
                "label":"Users",
                "columns":[
                  {
                    "label":"Users",
                    "identifier":"id as number_of_users"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              }
            ]
          },
          {
            "render":true,
            "id":"example_bar_chart",
            "type":"chart",
            "legend":"Bar Chart Individual",
            "kind":"bar",
            "datasets":[
              {
                "table":"sample_data",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_sales",
                "label":"Sales",
                "columns":[
                  {
                    "label":"Sales",
                    "identifier":"value as number_of_sales"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              },
              {
                "table":"bo.users",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_users",
                "label":"Users",
                "columns":[
                  {
                    "label":"Users",
                    "identifier":"id as number_of_users"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              }
            ]
          },
          {
            "render":true,
            "id":"example_doughnut_chart",
            "type":"chart",
            "legend":"Doughnut Chart Individual",
            "kind":"doughnut",
            "datasets":[
              {
                "table":"sample_data",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_sales",
                "label":"Sales",
                "columns":[
                  {
                    "label":"Sales",
                    "identifier":"value as number_of_sales"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              },
              {
                "table":"bo.users",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_users",
                "label":"Users",
                "columns":[
                  {
                    "label":"Users",
                    "identifier":"id as number_of_users"
                  },
                  {
                    "label":"Month",
                    "identifier":"to_char(created_at, \'YYYY-mm\') as month"
                  }
                ]
              }
            ]
          },
          {
            "render":true,
            "id":"example_line_chart",
            "type":"chart",
            "legend":"Line Chart Individual",
            "kind":"line",
            "datasets":[
              {
                "table":"sample_data",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_sales",
                "label":"Sales",
                "columns":[
                  {
                    "label":"Sales",
                    "identifier":"value as number_of_sales"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              },
              {
                "table":"bo.users",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_users",
                "label":"Users",
                "columns":[
                  {
                    "label":"Users",
                    "identifier":"id as number_of_users"
                  },
                  {
                    "label":"Month",
                    "identifier":"to_char(created_at, \'YYYY-mm\') as month"
                  }
                ]
              }
            ]
          },
          {
            "render":true,
            "id":"example_area_chart",
            "type":"chart",
            "legend":"Area Chart Individual",
            "kind":"area",
            "datasets":[
              {
                "table":"sample_data",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_sales",
                "label":"Sales",
                "columns":[
                  {
                    "label":"Sales",
                    "identifier":"value as number_of_sales"
                  },
                  {
                    "label":"Month",
                    "identifier":"created_at as month"
                  }
                ]
              },
              {
                "table":"bo.users",
                "sql":"SELECT |columns| FROM |table| ORDER BY month",
                "xColumn":"month",
                "yColumn":"number_of_users",
                "label":"Users",
                "columns":[
                  {
                    "label":"Users",
                    "identifier":"id as number_of_users"
                  },
                  {
                    "label":"Month",
                    "identifier":"to_char(created_at, \'YYYY-mm\') as month"
                  }
                ]
              }
            ]
          }
        ]`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'calendar',
        details: `{
          "render": false,
          "id":"example_calendar",
          "type":"calendar",
          "title":"Calendar",
          "description":"Upcoming Events",
          "events": []
        }`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'table',
        details: `{
          "render":false,
          "id":"example_table",
          "type":"table",
          "table":"bo.users",
          "legend":"Example Table",
          "sql":"SELECT |columns| FROM |table|",
          "columns":[
            {
              "label":"ID",
              "identifier":"id"
            },
            {
              "label":"First Name",
              "identifier":"first_name"
            },
            {
              "label":"E-mail Address",
              "identifier":"email_address"
            },
            {
              "label":"User ID",
              "identifier":"user_id"
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      }, {
        function: 'userCard',
        details: `[
          {
            "id":"user_action_cards",
            "type":"userCard",
            "title":"Categorie",
            "items":[
              {
                "title":"Ricariche",
                "image":"../assets/img/Ricariche.png",
                "elements":[
                  "example_carousel"
                ]
              },
              {
                "title":"Pagamenti",
                "image":"https://images.vexels.com/media/users/3/157499/isolated/preview/28270a7978a84ce182f39d36d6a595d8-online-payment-icon-by-vexels.png",
                "redirect":"/servizi?id=1"
              },
              {
                "title":"Visure",
                "image":"../assets/img/Visure.png"
              },
              {
                "title":"Spedizioni",
                "image":"https://img.icons8.com/cotton/2x/free-shipping.png"
              }
            ]
          },
            {
                "render":false,
                "id":"example_user_cards",
                "type":"userCard",
                "title":"Example User Cards",
                "sql":"SELECT CONCAT_WS('', first_name, ' ', last_name) AS title, company AS subtitle, image as image FROM bo.users LIMIT 9"
            }
        ]`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'profileCard',
        details: `{
          "render": false,
          "id": "example_profile_card",
          "type": "profileCard",
          "title": "Example Profile Card"
        }`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'productList',
        details: `{
          "render": false,
          "id": "example_product_list",
          "type": "productList",
          "title": "Example Product List",
          "sql": "SELECT id, description as title, to_char(created_at, \'YYYY.mm.dd\') as date, image as img from public.service_categories",
          "condition": "WHERE id in (|list|)",
          "list": []
        }`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'card',
        details: `[
          {
            "id":"example_card_graphs1",
            "type":"card",
            "transparent":true,
            "title":"Card title",
            "image":"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.freecreatives.com%2Fwp-content%2Fuploads%2F2015%2F04%2Flogo033.png&f=1&nofb=1",
            "description":"Card subtitle",
            "children":[
              "example_pie_chart_not_individual",
              "example_bar_chart_not_individual"
            ],
            "functions":[
              
            ]
          },
          {
            "id":"example_card_graph_n_component",
            "type":"card",
            "transparent":true,
            "title":"Card title",
            "image":"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.freecreatives.com%2Fwp-content%2Fuploads%2F2015%2F04%2Flogo033.png&f=1&nofb=1",
            "description":"Card subtitle",
            "children":[
              "example_area_chart_not_individual",
              "example_calendar"
            ]
          },
          {
            "id":"example_card_table",
            "type":"card",
            "transparent":true,
            "title":"Card title",
            "image":"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.freecreatives.com%2Fwp-content%2Fuploads%2F2015%2F04%2Flogo033.png&f=1&nofb=1",
            "description":"Card subtitle",
            "children":[
              "example_table"
            ]
          },
          {
            "id":"example_card_product_list",
            "type":"card",
            "transparent":true,
            "title":"Card title",
            "image":"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.freecreatives.com%2Fwp-content%2Fuploads%2F2015%2F04%2Flogo033.png&f=1&nofb=1",
            "description":"Card subtitle",
            "children":[
              "example_product_list"
            ]
          },
          {
            "id":"example_card_user_card",
            "type":"card",
            "transparent":true,
            "title":"Card title",
            "image":"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.freecreatives.com%2Fwp-content%2Fuploads%2F2015%2F04%2Flogo033.png&f=1&nofb=1",
            "description":"Card subtitle",
            "children":[
              "example_user_cards"
            ]
          },
          {
            "id":"example_card_profile_card",
            "type":"card",
            "transparent":true,
            "title":"Card title",
            "image":"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.freecreatives.com%2Fwp-content%2Fuploads%2F2015%2F04%2Flogo033.png&f=1&nofb=1",
            "description":"Card subtitle",
            "children":[
              "example_profile_card"
            ]
          },
          {
            "id":"example_card_wizard_validation",
            "type":"card",
            "transparent":true,
            "title":"Card title",
            "image":"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.freecreatives.com%2Fwp-content%2Fuploads%2F2015%2F04%2Flogo033.png&f=1&nofb=1",
            "description":"Card subtitle",
            "children":[
              "example_validation_wizard"
            ]
          },
          {
            "id":"example_card_carousel",
            "type":"card",
            "transparent":false,
            "title":"Card title",
            "image":"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.freecreatives.com%2Fwp-content%2Fuploads%2F2015%2F04%2Flogo033.png&f=1&nofb=1",
            "description":"Card subtitle",
            "children":[
              "example_carousel",
              "example_search"
            ]
          }
        ]`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'wizard',
        details: `[
          {
            "render":false,
            "id":"add_new_user_wizard1",
            "type":"wizard",
            "steps":[
              {
                "id":"user_roles_details",
                "title":"Scopes",
                "description":"Access Control for User",
                "elements": [
                  {
                    "label":"Scopes",
                    "name":"scopes",
                    "type":"staticDDL",
                    "ddl":{
                      "label":"name",
                      "value":"id"
                    },
                    "sql": "SELECT id, name from bo.user_roles",
                    "validationRules":[
                      "required"
                    ]
                  }
                ],
                "action":"user_details_step1",
                "previousStep":null,
                "nextStep":"user_details",
                "redirect":null,
                "message":null
              },
              {
                "id":"user_details",
                "title":"User Information",
                "description":"Information that help in identifying user",
                "elements":[
                  {
                    "label":"Scopes",
                    "name":"scopes",
                    "type":"staticDDL",
                    "isHidden":true,
                    "ddl":{
                      "label":"name",
                      "value":"id"
                    },
                    "sql":"SELECT id, name from bo.user_roles",
                    "validationRules":[
                      "required"
                    ]
                  },
                  {
                    "label":"First Name",
                    "name":"first_name",
                    "type":"text",
                    "validationRules":[
                      "required"
                    ]
                  },
                  {
                    "label":"Last Name",
                    "name":"last_name",
                    "type":"text",
                    "validationRules":[
                      "required"
                    ]
                  },
                  {
                    "label":"Company",
                    "name":"company",
                    "type":"text",
                    "validationRules":[
                      "required"
                    ]
                  },
                  {
                    "label":"E-mail Address",
                    "name":"email",
                    "type":"text",
                    "validationRules":[
                      "required"
                    ]
                  },
                  {
                    "label":"User ID",
                    "name":"user_id",
                    "type":"text",
                    "validationRules":[
                      "required"
                    ]
                  },
                  {
                    "label":"Password",
                    "name":"password",
                    "type":"password",
                    "validationRules":[
                      "required"
                    ]
                  }
                ],
                "action":"user_details_step2",
                "previousStep":null,
                "nextStep":null,
                "redirect":null,
                "message":null
              },
              {
                "id":"finalization",
                "title":"Finalization",
                "description":"Information about current status",
                "elements":[
                  {
                    "type":"textContent",
                    "value":"The user has been created successfully."
                  }
                ],
                "action":null,
                "previousStep":null,
                "nextStep":null,
                "redirect":null,
                "message":null
              }
            ]
          },
          {
            "render":false,
            "id":"example_validation_wizard",
            "type":"wizard",
            "steps":[
              {
                "id":"identity_data",
                "title":"Partita IVA",
                "description":"Inserisci P. IVA Cliente",
                "elements":[
                  {
                    "label":"P. IVA",
                    "name":"txt1",
                    "type":"text",
                    "validationRules":[
                      "required"
                    ]
                  }
                ],
                "action":"innolva_step1",
                "previousStep":null,
                "nextStep":"anagrafica",
                "redirect":null,
                "message":null
              },
              {
                "id":"anagrafica",
                "title":"Anagrafica",
                "description":"Inserisci dati cliente",
                "elements":[
                  {
                    "label":"Company Name",
                    "name":"company_name",
                    "type":"text",
                    "validationRules":[
                      "required"
                    ]
                  },
                  {
                    "label":"Vat No.",
                    "name":"vat_n",
                    "type":"text",
                    "validationRules":[
                      "required"
                    ]
                  },
                  {
                    "label":"Referent Name",
                    "name":"referent_name",
                    "type":"text",
                    "validationRules":[
                      "required"
                    ]
                  },
                  {
                    "label":"Phone No.",
                    "name":"phone_n",
                    "type":"ddl",
                    "validationRules":[
                      "required"
                    ]
                  }
                ],
                "action":"innolva_step2",
                "previousStep":"identity_data",
                "nextStep":"esito",
                "redirect":null,
                "message":null
              },
              {
                "id":"esito",
                "title":"Esito",
                "description":"Esito del processo",
                "elements":[
                  {
                    "label":"Phone No.",
                    "type":"ddl",
                    "name":"phone_n",
                    "isHidden":true,
                    "validationRules":[
                      "required"
                    ]
                  },
                  {
                    "type":"textContent",
                    "value":"Thank you"
                  }
                ],
                "action":null,
                "previousStep":"anagrafica",
                "nextStep":null,
                "redirect":"/servizi?id=phone_n"
              }
            ]
          }
        ]`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'search',
        details: `{
          "render":false,
          "id":"example_search",
          "type":"search",
          "title":"Search",
          "sql":"SELECT public.services.id as id, public.services.description as description, public.services.description as title, public.service_categories.description as category from public.services JOIN public.service_categories ON public.services.category_id=public.service_categories.id"
        }`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'tabs',
        details: `{
          "render":true,
          "id":"example_tab",
          "type":"tabs",
          "title":"Tabs",
          "tabs":[
            {
              "id":"tab1",
              "title":"Tab 1",
              "children":[
                "example_table",
                "example_calendar"
              ]
            },
            {
              "id":"tab2",
              "title":"Tab 2",
              "children":[
                "example_calendar",
                "example_table"
              ]
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'thumbCarousel',
        details: `{
          "render":false,
          "id":"example_carousel",
          "type":"thumbCarousel",
          "title":"Carousel",
          "sql":"SELECT id, description as title, img, price as badges, to_char(created_at, \'YYYY.mm.dd\') as date from public.services"
        }`,
        status: pageDetailStatuses.A,
        page_id: componentsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'wizard',
        details: `{
          "render": false,
          "id": "add_new_user",
          "type": "wizard",
          "steps": [
            {
              "id":"user_client_details",
              "title":"Client",
              "description":"User Relationship",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"user_details_step1",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"user_roles_details",
              "title":"Roles",
              "description":"Access Control for User",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "isHidden":true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Roles",
                  "name":"roles",
                  "type":"staticDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"user_details_step2",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"user_details",
              "title":"User Information",
              "description":"Information that help in identifying user",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "isHidden":true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Roles",
                  "name":"roles",
                  "type":"staticDDL",
                  "isHidden":true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"First Name",
                  "name":"first_name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Last Name",
                  "name":"last_name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"E-mail Address",
                  "name":"email",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"User ID",
                  "name":"user_id",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Company",
                  "name":"company",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Bio",
                  "name":"bio",
                  "type": "textarea",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Status",
                  "name":"status",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "options": [
                    {
                      "id": "A",
                      "name": "Active"
                    },
                    {
                      "id": "N",
                      "name": "Inactive"
                    }
                  ],
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"user_details_step3",
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The user has been created successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: usersManagementPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'wizard',
        details: `{
          "render": false,
          "id": "edit_user",
          "type": "wizard",
          "initialAction": "edit_user_get_user_data_by_id",
          "steps": [
            {
              "id":"user_client_details",
              "title":"Client",
              "description":"User Relationship",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Roles",
                  "name":"roles",
                  "type":"staticDDL",
                  "isHidden": true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"UserID",
                  "name":"id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"edit_user_step1",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"user_roles_details",
              "title":"Roles",
              "description":"Access Control for User",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "isHidden":true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Roles",
                  "name":"roles",
                  "type":"staticDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"UserID",
                  "name":"id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"edit_user_step2",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"user_details",
              "title":"User Information",
              "description":"Information that help in identifying user",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "isHidden":true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Roles",
                  "name":"roles",
                  "type":"staticDDL",
                  "isHidden":true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"UserID",
                  "name":"id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"First Name",
                  "name":"first_name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Last Name",
                  "name":"last_name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"E-mail Address",
                  "name":"email",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"User ID",
                  "name":"user_id",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Company",
                  "name":"company",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Bio",
                  "name":"bio",
                  "type": "textarea",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Status",
                  "name":"status",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "options": [
                    {
                      "id": "A",
                      "name": "Active"
                    },
                    {
                      "id": "N",
                      "name": "Inactive"
                    }
                  ],
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"edit_user_step3",
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The user has been updated successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: usersManagementPage.id,
        role_id: administratorRole.id
      },












      {
        function: 'dataTable',
        details: `{
          "id":"users_list",
          "type":"dataTable",
          "tables":[
            {
              "identifier": "users",
              "table": "bo.users",
              "isActual":true
            },
            {
              "identifier":"userRoles",
              "table": "bo.user_roles"
            },
            {
              "identifier":"roles",
              "table": "bo.roles",
              "isActualLast":true
            }
          ],
          "legend":"Users",
          "sql":"SELECT |columns| FROM **users** JOIN **userRoles** ON **userRoles**.user_id=**users**.id JOIN **roles** ON **roles**.id=**userRoles**.role_id",
          "buttons":[
            {
              "label":"Add User",
              "action":"add",
              "element":"add_new_user"
            },
            {
              "label":"Edit User",
              "action":"edit",
              "element":"edit_user"
            }
          ],
          "columns":[
            {
              "label":"ID",
              "identifier":"**users**.id",
              "as":"**users**.id",
              "attributes":{
                "excluded":true
              }
            },
            {
              "label":"First Name",
              "identifier":"**users**.first_name",
              "as":"**users**.first_name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Last Name",
              "identifier":"**users**.last_name",
              "as":"**users**.last_name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Email Address",
              "identifier":"**users**.email_address",
              "as":"**users**.email_address",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Password",
              "identifier":"**users**.password",
              "as":"**users**.password",
              "attributes":{
                "required":true,
                "type":"password"
              }
            },
            {
              "label":"User ID",
              "identifier":"**users**.user_id",
              "as":"**users**.user_id",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Role",
              "identifier":"**roles**.name",
              "as":"**roles**.name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: usersManagementPage.id,
        role_id: administratorRole.id
      },










      {
        function: 'ddl',
        details: `{
          "id":"end_users_list",
          "type":"ddl",
          "tables":[
            {
              "identifier": "users",
              "table": "bo.end_users",
              "isActual":true
            },
            {
              "identifier": "statuses",
              "table": "bo.statuses"
            }
          ],
          "legend":"",
          "sql":"SELECT |columns| FROM **users** JOIN **statuses** ON **statuses**.id=**users**.status WHERE **users**.user_id_insert=@auth_id@",
          "buttons":[
            {
              "label":"Add Users",
              "action":"add",
              "element":"add_users"
            }
          ],
          "columns":[
            {
              "label":"ID",
              "identifier":"**users**.id",
              "as":"**users**.id",
              "attributes":{
                "excluded":true
              }
            },
            {
              "label":"Name",
              "identifier":"**users**.name",
              "as":"**users**.name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Surname",
              "identifier":"**users**.surname",
              "as":"**users**.surname",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"E-mail",
              "identifier":"**users**.email",
              "as":"**users**.email",
              "attributes":{
                "required":true,
                "type":"text"
              }
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: entriesPage.id,
        role_id: agentRole.id
      },


      {
        function: 'wizard',
        details: `{
          "render": false,
          "id": "add_users",
          "type": "wizard",
          "steps": [
            {
              "id":"add_users_step1",
              "title":"Upload File",
              "description":"Upload CSV to add users",
              "elements":[
                {
                  "label":"CSV",
                  "name":"csv",
                  "type":"media",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"add_users_step1",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The users have been added successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: entriesPage.id,
        role_id: agentRole.id
      },


      {
        function: 'ddl',
        details: `{
          "id":"end_users_list",
          "type":"ddl",
          "tables":[
            {
              "identifier": "users",
              "table": "bo.end_users",
              "isActual":true
            },
            {
              "identifier": "statuses",
              "table": "bo.statuses"
            }
          ],
          "legend":"Users",
          "sql":"SELECT |columns| FROM **users** JOIN **statuses** ON **statuses**.id=**users**.status WHERE **users**.user_id_insert=@auth_id@",
          "buttons":[
            {
              "label":"Add User",
              "action":"add",
              "element":"add_new_user"
            },
            {
              "label":"Edit User",
              "action":"edit",
              "element":"edit_user"
            },
            {
              "label":"Send SMS",
              "action":"edit",
              "element":"send_sms"
            }
          ],
          "columns":[
            {
              "label":"ID",
              "identifier":"**users**.id",
              "as":"**users**.id",
              "attributes":{
                "excluded":true
              }
            },
            {
              "label":"Name",
              "identifier":"**users**.name",
              "as":"**users**.name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Surname",
              "identifier":"**users**.surname",
              "as":"**users**.surname",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"E-mail",
              "identifier":"**users**.email",
              "as":"**users**.email",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"CF",
              "identifier":"**users**.cf",
              "as":"**users**.cf",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"POD",
              "identifier":"**users**.pod",
              "as":"**users**.pod",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Municipality of Activation",
              "identifier":"**users**.moa",
              "as":"**users**.moa",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"IP Address",
              "identifier":"**users**.ip_address",
              "as":"**users**.ip_address",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"TOS Accepted",
              "identifier":"CASE WHEN **users**.tos_accepted=true THEN 'Yes' ELSE 'No' END",
              "as":"**users**.tos_accepted",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Status",
              "identifier":"**statuses**.status",
              "as":"**statuses**.status",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Phone Numbers",
              "type":"action",
              "key":"managed_data",
              "identifier":[
                {
                  "identifier": "**users**.id",
                  "as": "**users**.id"
                }
              ],
              "attributes":{
                "excluded":"true"
              },
              "inModal":true,
              "rel": "end_users_related_phone_numbers"
            }
          ],
          "children": [
            {
              "id":"end_users_related_phone_numbers",
              "type":"dataTable",
              "tables":[
                {
                  "identifier":"phoneNumbers",
                  "table":"bo.end_users_phone_numbers"
                },
                {
                  "identifier":"users",
                  "table":"bo.end_users"
                }
              ],
              "buttons": [],
              "legend":"Phone Numbers",
              "sql":"SELECT |columns| FROM **phoneNumbers** WHERE **phoneNumbers**.user_id=\'@**users**.id@\'",
              "columns":[
                {
                  "label":"ID",
                  "identifier":"**phoneNumbers**.id",
                  "as":"**phoneNumbers**.id",
                  "attributes":{
                    "required":true
                  }
                },
                {
                  "label":"Phone Number",
                  "identifier":"**phoneNumbers**.phone_number",
                  "as":"**phoneNumbers**.phone_number",
                  "attributes":{
                    "required":true
                  }
                }
              ]
            },
            {
              "id":"end_users_related_addresses",
              "type":"dataTable",
              "tables":[
                {
                  "identifier":"addresses",
                  "table":"bo.end_users_addresses"
                },
                {
                  "identifier":"users",
                  "table":"bo.end_users"
                }
              ],
              "buttons": [],
              "legend":"Addresses",
              "sql":"SELECT |columns| FROM **addresses** WHERE **addresses**.user_id=\'@**users**.id@\'",
              "columns":[
                {
                  "label":"ID",
                  "identifier":"**addresses**.id",
                  "as":"**addresses**.id",
                  "attributes":{
                    "required":true
                  }
                },
                {
                  "label":"City",
                  "identifier":"**addresses**.city",
                  "as":"**addresses**.city",
                  "attributes":{
                    "required":true
                  }
                }
              ]
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: crmPage.id,
        role_id: operatorRole.id
      },


      {
        function: 'ddl',
        details: `{
          "id":"end_users_list",
          "type":"ddl",
          "tables":[
            {
              "identifier": "users",
              "table": "bo.end_users",
              "isActual":true
            },
            {
              "identifier": "admins",
              "table": "bo.users"
            },
            {
              "identifier": "statuses",
              "table": "bo.statuses"
            }
          ],
          "legend":"Users",
          "sql":"SELECT |columns| FROM **users** JOIN **statuses** ON **statuses**.id=**users**.status JOIN **admins** ON **admins**.id=**users**.user_id_insert WHERE **users**.created_at >= '@start_date@'::date AND **users**.created_at <= '@end_date@'::date AND (**users**.ip_address IS NOT NULL OR NOT @ip_check@::boolean)",
          "buttons":[
            {
              "label":"Add User",
              "action":"add",
              "element":"add_new_user"
            },
            {
              "label":"Edit User",
              "action":"edit",
              "element":"edit_user"
            },
            {
              "label":"Send SMS",
              "action":"edit",
              "element":"send_sms"
            },
            {
              "label":"Export to CSV",
              "action":"export",
              "format":"csv",
              "extension": "csv"
            }
          ],
          "columns":[
            {
              "label":"ID",
              "identifier":"**users**.id",
              "as":"**users**.id",
              "attributes":{
                "excluded":true
              }
            },
            {
              "label":"Name",
              "identifier":"**users**.name",
              "as":"**users**.name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Surname",
              "identifier":"**users**.surname",
              "as":"**users**.surname",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"E-mail",
              "identifier":"**users**.email",
              "as":"**users**.email",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"CF",
              "identifier":"**users**.cf",
              "as":"**users**.cf",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"POD",
              "identifier":"**users**.pod",
              "as":"**users**.pod",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Municipality of Activation",
              "identifier":"**users**.moa",
              "as":"**users**.moa",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Added By",
              "identifier":"concat(**admins**.first_name, ' ', **admins**.last_name)",
              "as":"**users**.name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"IP Address",
              "identifier":"**users**.ip_address",
              "as":"**users**.ip_address",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"TOS Accepted",
              "identifier":"CASE WHEN **users**.tos_accepted=true THEN 'Yes' ELSE 'No' END",
              "as":"**users**.tos_accepted",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Status",
              "identifier":"**statuses**.status",
              "as":"**statuses**.status",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Phone Numbers",
              "type":"action",
              "key":"managed_data",
              "identifier":[
                {
                  "identifier": "**users**.id",
                  "as": "**users**.id"
                }
              ],
              "attributes":{
                "excluded":"true"
              },
              "inModal":true,
              "rel": "end_users_related_phone_numbers"
            }
          ],
          "children": [
            {
              "id":"end_users_related_phone_numbers",
              "type":"dataTable",
              "tables":[
                {
                  "identifier":"phoneNumbers",
                  "table":"bo.end_users_phone_numbers"
                },
                {
                  "identifier":"users",
                  "table":"bo.end_users"
                }
              ],
              "buttons": [],
              "legend":"Phone Numbers",
              "sql":"SELECT |columns| FROM **phoneNumbers** WHERE **phoneNumbers**.user_id=\'@**users**.id@\'",
              "columns":[
                {
                  "label":"ID",
                  "identifier":"**phoneNumbers**.id",
                  "as":"**phoneNumbers**.id",
                  "attributes":{
                    "required":true
                  }
                },
                {
                  "label":"Phone Number",
                  "identifier":"**phoneNumbers**.phone_number",
                  "as":"**phoneNumbers**.phone_number",
                  "attributes":{
                    "required":true
                  }
                }
              ]
            },
            {
              "id":"end_users_related_addresses",
              "type":"dataTable",
              "tables":[
                {
                  "identifier":"addresses",
                  "table":"bo.end_users_addresses"
                },
                {
                  "identifier":"users",
                  "table":"bo.end_users"
                }
              ],
              "buttons": [],
              "legend":"Addresses",
              "sql":"SELECT |columns| FROM **addresses** WHERE **addresses**.user_id=\'@**users**.id@\'",
              "columns":[
                {
                  "label":"ID",
                  "identifier":"**addresses**.id",
                  "as":"**addresses**.id",
                  "attributes":{
                    "required":true
                  }
                },
                {
                  "label":"City",
                  "identifier":"**addresses**.city",
                  "as":"**addresses**.city",
                  "attributes":{
                    "required":true
                  }
                }
              ]
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: crmPage.id,
        role_id: administratorRole.id
      },









      {
        function: 'wizard',
        details: `{
          "render": false,
          "id": "send_sms",
          "type": "wizard",
          "initialAction": "get_end_user_details",
          "steps": [
            {
              "id":"sms_content",
              "title":"SMS",
              "description":"Content of SMS",
              "elements":[
                {
                  "label":"User ID",
                  "name":"user_id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Phone Numbers",
                  "name":"endUserPhoneNumbers",
                  "type":"staticDDL",
                  "ddl":{
                    "label":"phone_number",
                    "value":"id"
                  },
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"send_sms_step1",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The SMS has been sent successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: operatorRole.id,
        role_id: administratorRole.id
      },


      {
        function: 'wizard',
        details: `{
          "render": false,
          "id": "send_sms",
          "type": "wizard",
          "initialAction": "get_end_user_details",
          "steps": [
            {
              "id":"sms_content",
              "title":"SMS",
              "description":"Content of SMS",
              "elements":[
                {
                  "label":"User ID",
                  "name":"user_id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Phone Numbers",
                  "name":"endUserPhoneNumbers",
                  "type":"staticDDL",
                  "ddl":{
                    "label":"phone_number",
                    "value":"id"
                  },
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"send_sms_step1",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The SMS has been sent successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: crmPage.id,
        role_id: administratorRole.id
      },

      {
        function: 'wizard',
        details: `{
          "render":false,
          "id":"add_new_user",
          "type":"wizard",
          "steps":[
            {
              "id":"user_details",
              "title":"User Information",
              "description":"Information that helps in identifying user",
              "elements":[
                {
                  "label":"Nome",
                  "name":"name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Cognome",
                  "name":"surname",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"E-mail",
                  "name":"email",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Comune di attivazione",
                  "name":"moa",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Numero Telefono",
                  "name":"phone_numbers",
                  "type":"staticDDL",
                  "ddl":{
                    "label":"phone_number",
                    "value":"id"
                  },
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"POD",
                  "name":"pod",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Codice Fiscale",
                  "name":"cf",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Address",
                  "name":"address",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"City",
                  "name":"city",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Postal Code",
                  "name":"postal_code",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Country",
                  "name":"country",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"add_new_user_step1",
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The user has been added successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: operatorRole.id,
        role_id: administratorRole.id
      },
      {
        function: 'wizard',
        details: `{
          "render":false,
          "id":"add_new_user",
          "type":"wizard",
          "steps":[
            {
              "id":"user_details",
              "title":"User Information",
              "description":"Information that helps in identifying user",
              "elements":[
                {
                  "label":"Nome",
                  "name":"name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Cognome",
                  "name":"surname",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"E-mail",
                  "name":"email",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Comune di attivazione",
                  "name":"moa",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Numero Telefono",
                  "name":"phone_numbers",
                  "type":"staticDDL",
                  "ddl":{
                    "label":"phone_number",
                    "value":"id"
                  },
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"POD",
                  "name":"pod",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Codice Fiscale",
                  "name":"cf",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Address",
                  "name":"address",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"City",
                  "name":"city",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Postal Code",
                  "name":"postal_code",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Country",
                  "name":"country",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"add_new_user_step1",
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The user has been added successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: crmPage.id,
        role_id: administratorRole.id
      },

      {
        function: 'wizard',
        details: `{
          "render":false,
          "id":"edit_user",
          "type":"wizard",
          "initialAction": "edit_end_user_get_end_user_data_by_id",
          "steps":[
            {
              "id":"user_details",
              "title":"User Information",
              "description":"Information that helps in identifying user",
              "elements":[
                {
                  "label":"User ID",
                  "name":"id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Nome",
                  "name":"name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Cognome",
                  "name":"surname",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"E-mail",
                  "name":"email",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Comune di attivazione",
                  "name":"moa",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Numero Telefono",
                  "name":"phone_numbers",
                  "type":"staticDDL",
                  "ddl":{
                    "label":"phone_number",
                    "value":"id"
                  },
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"POD",
                  "name":"pod",
                  "type":"text",
                  "validationRules": [
                    "required"
                  ]
                },
                {
                  "label":"Codice Fiscale",
                  "name":"cf",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Address",
                  "name":"address",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"City",
                  "name":"city",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Postal Code",
                  "name":"postal_code",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Country",
                  "name":"country",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"edit_end_user_step1",
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The user has been updated successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: operatorRole.id,
        role_id: administratorRole.id
      },
      {
        function: 'wizard',
        details: `{
          "render":false,
          "id":"edit_user",
          "type":"wizard",
          "initialAction": "edit_end_user_get_end_user_data_by_id",
          "steps":[
            {
              "id":"user_details",
              "title":"User Information",
              "description":"Information that helps in identifying user",
              "elements":[
                {
                  "label":"User ID",
                  "name":"id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Nome",
                  "name":"name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Cognome",
                  "name":"surname",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"E-mail",
                  "name":"email",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Comune di attivazione",
                  "name":"moa",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Numero Telefono",
                  "name":"phone_numbers",
                  "type":"staticDDL",
                  "ddl":{
                    "label":"phone_number",
                    "value":"id"
                  },
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"POD",
                  "name":"pod",
                  "type":"text",
                  "validationRules": [
                    "required"
                  ]
                },
                {
                  "label":"Codice Fiscale",
                  "name":"cf",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Address",
                  "name":"address",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"City",
                  "name":"city",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Postal Code",
                  "name":"postal_code",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Country",
                  "name":"country",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"edit_end_user_step1",
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The user has been updated successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: crmPage.id,
        role_id: administratorRole.id
      },


      {
        function: 'wizard',
        details: `{
          "render": false,
          "id": "add_new_page_detail",
          "type": "wizard",
          "initialAction": "add_new_page_detail_get_page_detail_data_by_page_id",
          "steps": [
            {
              "id":"page_detail_role",
              "title":"Role",
              "description":"To which role this page detail belongs to",
              "elements":[
                {
                  "label":"Page",
                  "name":"page",
                  "type":"predefinedDDL",
                  "isHidden": true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.pages",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Role",
                  "name":"role",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"add_new_page_detail_step1",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"page_info",
              "title":"Identification",
              "description":"Data to identify the page",
              "elements":[
                {
                  "label":"Page",
                  "name":"page",
                  "type":"predefinedDDL",
                  "isHidden": true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.pages",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Role",
                  "name":"role",
                  "type":"predefinedDDL",
                  "isHidden": true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Function",
                  "name":"function",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Details",
                  "name":"details",
                  "hiddenLabel": true,
                  "type":"json",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Status",
                  "name":"status",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "options": [
                    {
                      "id": "A",
                      "name": "Active"
                    },
                    {
                      "id": "N",
                      "name": "Inactive"
                    }
                  ],
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"add_new_page_detail_step2",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The page details have been created successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: backOfficeManagementPage.id,
        role_id: administratorRole.id
      },




      {
        function: 'wizard',
        details: `{
          "render": false,
          "id": "edit_page_detail",
          "type": "wizard",
          "initialAction": "edit_page_detail_get_page_detail_data_by_page_detail_id",
          "steps": [
            {
              "id":"page_detail_role",
              "title":"Role",
              "description":"To which role this page detail belongs to",
              "elements":[
                {
                  "label":"Page",
                  "name":"page",
                  "type":"predefinedDDL",
                  "isHidden": true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.pages",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"PageDetailID",
                  "name":"id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Role",
                  "name":"role",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"edit_page_detail_step1",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"page_info",
              "title":"Identification",
              "description":"Data to identify the page",
              "elements":[
                {
                  "label":"Page",
                  "name":"page",
                  "type":"predefinedDDL",
                  "isHidden": true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.pages",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Role",
                  "name":"role",
                  "type":"predefinedDDL",
                  "isHidden": true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"PageDetailID",
                  "name":"id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Function",
                  "name":"function",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Details",
                  "name":"details",
                  "hiddenLabel": true,
                  "type":"json",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Status",
                  "name":"status",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "options": [
                    {
                      "id": "A",
                      "name": "Active"
                    },
                    {
                      "id": "N",
                      "name": "Inactive"
                    }
                  ],
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"edit_page_detail_step2",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The page details have been updated successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: backOfficeManagementPage.id,
        role_id: administratorRole.id
      },



      {
        function: 'wizard',
        details: `{
          "render": false,
          "id": "add_new_page",
          "type": "wizard",
          "steps": [
            {
              "id":"page_client",
              "title":"Client",
              "description":"To which client this page belongs to",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"add_new_page_step1",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"page_info",
              "title":"Identification",
              "description":"Data to identify the page",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "isHidden": true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Name",
                  "name":"name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Slug",
                  "name":"slug",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Allowed From",
                  "name":"allowed_from",
                  "type":"text",
                  "validationRules":[]
                },
                {
                  "label":"Description",
                  "name":"description",
                  "type":"textarea",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Status",
                  "name":"status",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "options": [
                    {
                      "id": "A",
                      "name": "Active"
                    },
                    {
                      "id": "N",
                      "name": "Inactive"
                    }
                  ],
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"add_new_page_step2",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The page has been created successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: backOfficeManagementPage.id,
        role_id: administratorRole.id
      },

      {
        function: 'wizard',
        details: `{
          "render": false,
          "id": "edit_page",
          "type": "wizard",
          "initialAction": "edit_page_get_page_data_by_id",
          "steps": [
            {
              "id":"page_client",
              "title":"Client",
              "description":"To which client this page belongs to",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"PageID",
                  "name":"id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"edit_page_step1",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"page_info",
              "title":"Identification",
              "description":"Data to identify the page",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "isHidden": true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"PageID",
                  "name":"id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Name",
                  "name":"name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Slug",
                  "name":"slug",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Allowed From",
                  "name":"allowed_from",
                  "type":"text",
                  "validationRules":[]
                },
                {
                  "label":"Description",
                  "name":"description",
                  "type":"textarea",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Status",
                  "name":"status",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "options": [
                    {
                      "id": "A",
                      "name": "Active"
                    },
                    {
                      "id": "N",
                      "name": "Inactive"
                    }
                  ],
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"edit_page_step2",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The page has been updated successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: backOfficeManagementPage.id,
        role_id: administratorRole.id
      },

      {
        function: 'wizard',
        details: `{
          "render": false,
          "id": "add_new_menu_item",
          "type": "wizard",
          "steps": [
            {
              "id":"menu_item_client_details",
              "title":"Client",
              "description":"Menu Item Relationship",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"add_new_menu_item_step1",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"menu_item_roles_details",
              "title":"Role",
              "description":"Access Control for Menu Item",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "isHidden":true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Role",
                  "name":"roles",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"add_new_menu_item_step2",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"menu_item_details",
              "title":"Menu Item Information",
              "description":"Information that help in identifying menu item",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "isHidden":true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Roles",
                  "name":"roles",
                  "type":"staticDDL",
                  "isHidden":true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Name",
                  "name":"name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Icon",
                  "name":"image",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Priority",
                  "name":"priority",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                    "label":"Page",
                    "name":"page",
                    "type":"predefinedDDL",
                    "ddl":{
                        "label":"name",
                        "value":"id"
                    },
                    "sql":"SELECT id, name from bo.pages",
                    "validationRules":[
                        "required"
                    ]
                },
                {
                    "label":"Parent",
                    "name":"parent",
                    "type":"predefinedDDL",
                    "ddl":{
                        "label":"name",
                        "value":"id"
                    },
                    "sql":"SELECT id, name from bo.menu_items",
                    "validationRules":[]
                },
                {
                  "label":"Status",
                  "name":"status",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "options": [
                    {
                      "id": "A",
                      "name": "Active"
                    },
                    {
                      "id": "N",
                      "name": "Inactive"
                    }
                  ],
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"add_new_menu_item_step3",
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The menu item has been created successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: backOfficeManagementPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'wizard',
        details: `{
          "render": false,
          "id": "edit_menu_item",
          "type": "wizard",
          "initialAction": "edit_menu_item_get_menu_item_data_by_id",
          "steps": [
            {
              "id":"menu_item_client_details",
              "title":"Client",
              "description":"Menu Item Relationship",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Roles",
                  "name":"roles",
                  "type":"staticDDL",
                  "isHidden": true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"MenuItemID",
                  "name":"id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"edit_menu_item_step1",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"menu_item_roles_details",
              "title":"Role",
              "description":"Access Control for Menu Item",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "isHidden":true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Role",
                  "name":"roles",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"MenuItemID",
                  "name":"id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"edit_menu_item_step2",
              "previousStep":null,
              "nextStep":"user_details",
              "redirect":null,
              "message":null
            },
            {
              "id":"menu_item_details",
              "title":"Menu Item Information",
              "description":"Information that help in identifying menu item",
              "elements":[
                {
                  "label":"Client",
                  "name":"client",
                  "type":"predefinedDDL",
                  "isHidden":true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.oauth_clients",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Roles",
                  "name":"roles",
                  "type":"staticDDL",
                  "isHidden":true,
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "sql":"SELECT id, name from bo.roles",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"MenuItemID",
                  "name":"id",
                  "type":"text",
                  "isHidden": true,
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Name",
                  "name":"name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Icon",
                  "name":"image",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Priority",
                  "name":"priority",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                    "label":"Page",
                    "name":"page",
                    "type":"predefinedDDL",
                    "ddl":{
                        "label":"name",
                        "value":"id"
                    },
                    "sql":"SELECT id, name from bo.pages",
                    "validationRules":[
                        "required"
                    ]
                },
                {
                    "label":"Parent",
                    "name":"parent",
                    "type":"predefinedDDL",
                    "ddl":{
                        "label":"name",
                        "value":"id"
                    },
                    "sql":"SELECT id, name from bo.menu_items",
                    "validationRules":[]
                },
                {
                  "label":"Status",
                  "name":"status",
                  "type":"predefinedDDL",
                  "ddl":{
                    "label":"name",
                    "value":"id"
                  },
                  "options": [
                    {
                      "id": "A",
                      "name": "Active"
                    },
                    {
                      "id": "N",
                      "name": "Inactive"
                    }
                  ],
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"edit_menu_item_step3",
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The menu item has been updated successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: backOfficeManagementPage.id,
        role_id: administratorRole.id
      },
    
    
    
      {
        function: 'ddl',
        details: `{
          "id":"ui_details_list",
          "type":"ddl",
          "tables":[
            {
              "identifier": "pages",
              "table": "bo.pages",
              "isActual":true
            }
          ],
          "legend":"Pages",
          "sql":"SELECT |columns| FROM **pages**",
          "buttons":[
            {
              "label":"Add Page",
              "action":"add",
              "element":"add_new_page"
            },
            {
              "label":"Edit Page",
              "action":"edit",
              "element":"edit_page"
            }
          ],
          "columns":[
            {
              "label":"ID",
              "identifier":"**pages**.id",
              "as":"**pages**.id",
              "attributes":{
                "excluded":true
              },
              "inDrillDown": true,
              "rel": "related_menu_items_ddl"
            },
            {
              "label":"Name",
              "identifier":"**pages**.name",
              "as":"**pages**.name",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Slug",
              "identifier":"**pages**.slug",
              "as":"**pages**.slug",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },
            {
              "label":"Status",
              "identifier":"**pages**.status",
              "as":"**pages**.status",
              "attributes":{
                "required":true,
                "type":"text"
              }
            },

            {
              "label":"Manage Details",
              "type":"action",
              "key":"managed_data",
              "identifier":[
                {
                  "identifier": "**pages**.id",
                  "as": "**pages**.id"
                }
              ],
              "attributes":{
                "excluded":"true"
              },
              "inModal":true,
              "rel":"related_page_details_datatable"
            }
          ],
          "children": [
            {
              "id":"related_page_details_datatable",
              "type":"dataTable",
              "tables":[
                {
                  "identifier":"pageDetails",
                  "table":"bo.page_details"
                },
                {
                  "identifier":"pages",
                  "table":"bo.pages"
                },
                {
                  "identifier":"roles",
                  "table":"bo.roles"
                }
              ],
              "buttons":[
                {
                  "label":"Add New Details",
                  "action":"add",
                  "element":"add_new_page_detail"
                },
                {
                  "label": "Edit Details",
                  "action": "edit",
                  "element": "edit_page_detail"
                }
              ],
              "legend":"Page Details",
              "sql":"SELECT |columns| FROM **pageDetails** JOIN **roles** ON **roles**.id=**pageDetails**.role_id WHERE page_id=\'@**pages**.id@\'",
              "columns":[
                {
                  "label":"ID",
                  "identifier":"**pageDetails**.id",
                  "as":"**pageDetails**.id",
                  "attributes":{
                    "required":true
                  }
                },
                {
                  "label":"Function",
                  "identifier":"**pageDetails**.function",
                  "as":"**pageDetails**.function",
                  "attributes":{
                    "required":true
                  }
                },
                {
                  "label":"Details",
                  "identifier":"**pageDetails**.details #>> '{}'",
                  "as":"**pageDetails**.details",
                  "attributes":{
                    "required":true
                  }
                },
                {
                  "label":"Status",
                  "identifier":"**pageDetails**.status",
                  "as":"**pageDetails**.status",
                  "attributes":{
                    "required":true
                  }
                },
                {
                  "label":"Role",
                  "identifier":"**roles**.name",
                  "as":"**roles**.name",
                  "attributes":{
                    "required":true
                  }
                }
              ]
            },
            {
              "id":"related_menu_items_ddl",
              "type":"ddl",
              "tables":[
                {
                  "identifier": "menuItems",
                  "table": "bo.menu_items",
                  "isActual":true
                },
                {
                  "identifier": "pages",
                  "table": "bo.pages"
                }
              ],
              "legend":"Menu Items",
              "sql":"SELECT |columns| FROM **menuItems** M WHERE M.page_id=\'@**pages**.id@\'",
              "buttons":[
                {
                  "label":"Add Menu Item",
                  "action": "add",
                  "element": "add_new_menu_item"
                },
                {
                  "label":"Edit Menu Item",
                  "action": "edit",
                  "element": "edit_menu_item"
                }
              ],
              "columns":[
                {
                  "label":"ID",
                  "identifier":"M.id",
                  "as":"M.id",
                  "attributes":{
                    "excluded":true
                  }
                },
                {
                  "label":"Name",
                  "identifier":"M.name",
                  "as":"M.name",
                  "attributes":{
                    "required":true,
                    "type":"text"
                  }
                },
                {
                  "label":"Icon",
                  "identifier":"M.image",
                  "as":"M.image",
                  "attributes":{
                    "required":true,
                    "type":"text"
                  }
                },
                {
                  "label":"Priority",
                  "identifier":"M.priority",
                  "as":"M.priority",
                  "attributes":{
                    "required":true,
                    "type":"text"
                  }
                },
                {
                  "label":"Status",
                  "identifier":"M.status",
                  "as":"M.status",
                  "attributes":{
                    "required":true,
                    "type":"text"
                  }
                }
              ]
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: backOfficeManagementPage.id,
        role_id: administratorRole.id
      },
      

   





      {
        function: 'card',
        details: `{
          "id":"product_images_carousel_card",
          "type":"card",
          "transparent": true,
          "title":"Card title",
          "image":"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.freecreatives.com%2Fwp-content%2Fuploads%2F2015%2F04%2Flogo033.png&f=1&nofb=1",
          "description":"Card subtitle",
          "children":[
            "product_images_carousel",
            "products_details_tab"
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: detailsPage.id,
        role_id: administratorRole.id
      },

  

      {
        function: 'calendar',
        details: `{
          "render": false,
          "id":"example_calendar",
          "type":"calendar",
          "title":"Calendar",
          "description":"Upcoming Events",
          "events": []
        }`,
        status: pageDetailStatuses.A,
        page_id: detailsPage.id,
        role_id: administratorRole.id
      },
      

      {
        function: 'thumbCarousel',
        details: `{
          "render": false,
          "id":"product_images_carousel",
          "type":"thumbCarousel",
          "title":"Carousel",
          "queries": {
            "products": {
              "sql":"SELECT product_id as id, name as title, url as img from dropshop.product_images WHERE product_id=**p**"
            },
            "categories": {
              "sql":"SELECT category_id as id, image as img from dropshop.categories_image WHERE category_id=**p**"
            },
            "manufacturers": {
              "sql":"SELECT distributor_id as id, image as img from dropshop.distributors WHERE distributor_id=**p**"
            }
          }
        }`,
        status: pageDetailStatuses.A,
        page_id: detailsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'productDescriptionText',
        details: `{
          "render": false,
          "id":"product_details_description_text",
          "type":"productDescriptionText",
          "queries": {
            "products": {
              "column": "description",
              "sql":"SELECT |column| from dropshop.products WHERE product_id=**p**"
            },
            "categories": {
              "column": "name",
              "sql":"SELECT |column| from dropshop.categories WHERE category_id=**p**"
            },
            "manufacturers": {
              "column": "name",
              "sql":"SELECT |column| from dropshop.distributors WHERE distributor_id=**p**"
            }
          }
        }`,
        status: pageDetailStatuses.A,
        page_id: detailsPage.id,
        role_id: administratorRole.id
      },
      {
        function: 'tabs',
        details: `{
          "render": false,
          "id":"products_details_tab",
          "type":"tabs",
          "title":"Tabs",
          "tabs":[
            {
              "id":"details_tab",
              "title":"Details",
              "children":[
                "product_details_description_text"
              ]
            },
            {
              "id":"analytics_tab",
              "title":"Dates",
              "children":[
                "example_calendar"
              ]
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: detailsPage.id,
        role_id: administratorRole.id
      },



      {
        function: 'profileCard',
        details: `{
          "id": "profile_card",
          "type": "profileCard",
          "title": ""
        }`,
        status: pageDetailStatuses.A,
        page_id: profilePage.id,
        role_id: administratorRole.id
      },


      {
        function: 'profileCard',
        details: `{
          "id": "profile_card",
          "type": "profileCard",
          "title": ""
        }`,
        status: pageDetailStatuses.A,
        page_id: profilePage.id,
        role_id: agentRole.id
      },

      {
        function: 'profileCard',
        details: `{
          "id": "profile_card",
          "type": "profileCard",
          "title": ""
        }`,
        status: pageDetailStatuses.A,
        page_id: profilePage.id,
        role_id: operatorRole.id
      },

      {
        function: 'wizard',
        details: `{
          "id":"aaaa_test",
          "type":"wizard",
          "steps":[
            {
              "id":"user_details",
              "title":"User Information",
              "description":"Information that helps in identifying user",
              "elements":[
                {
                  "label":"Nome",
                  "name":"name",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Cognome",
                  "name":"surname",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"E-mail",
                  "name":"email",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Numero Telefono",
                  "name":"phone_numbers",
                  "type":"staticDDL",
                  "ddl":{
                    "label":"phone_number",
                    "value":"id"
                  },
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"POD",
                  "name":"pod",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Codice Fiscale",
                  "name":"cf",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Address",
                  "name":"address",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"City",
                  "name":"city",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Postal Code",
                  "name":"postal_code",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Country",
                  "name":"country",
                  "type":"text",
                  "validationRules":[
                    "required"
                  ]
                },
                {
                  "label":"Profile Picture",
                  "name":"profile_picture",
                  "type":"media",
                  "validationRules":[
                    "required"
                  ]
                }
              ],
              "action":"add_new_user_step1",
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            },
            {
              "id":"finalization",
              "title":"Finalization",
              "description":"Information about current status",
              "elements":[
                {
                  "type":"textContent",
                  "value":"The user has been added successfully."
                }
              ],
              "action":null,
              "previousStep":null,
              "nextStep":null,
              "redirect":null,
              "message":null
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: testPage.id,
        role_id: administratorRole.id
      },


      {
        function: 'filters',
        details: `{
          "type":"filters",
          "filters":[
            {
              "id": "start_date",
              "type": "datetime_picker",
              "placeholder": "From",
              "value": "2020-01-01 00:00:00.413147+00"
            },
            {
              "id": "end_date",
              "type": "datetime_picker",
              "placeholder": "To",
              "value": "2030-01-01 00:00:00.413147+00"
            },
            {
              "id": "ip_check",
              "type": "boolean",
              "placeholder": "Has IP Address",
              "value": false
            }
          ]
        }`,
        status: pageDetailStatuses.A,
        page_id: crmPage.id,
        role_id: administratorRole.id
      }


      
      
    ]);
};
