const {
  getProductVariations,
  getProductCategories,
  getProductImages,
  getProductTags,
  getProduct,
  getUserCart,
} = require("./query");

const databaseConnections = require("../../../connections");
const { modifier } = require("../../listings/modifier");
const { getCategoriesRelatedToUserMacroCategories } = require("../../listings/functions");

const carousel = async (query, otherParameters = [], page_id) => {
  try {
    const id = query.id;
    const slides = query.slides;
    const data = {
      id,
      type: "carousel",
      data: slides,
    };
    return data;
  } catch (error) {
    console.log(`carousel - #${query.id}`, error);
  }
};

const features = async (query, otherParameters = [], page_id) => {
  try {
    const id = query.id;
    const features = query.features;
    const data = {
      id,
      type: "features",
      data: features,
    };
    return data;
  } catch (error) {
    console.log(`features - #${query.id}`, error);
  }
};

const productSuggestions = async (query, otherParameters = [], page_id) => {
  this.knex = databaseConnections.baseKnex;
  const databaseConnection = query.databaseConnection;
  if (databaseConnection) {
    this.knex = databaseConnections[databaseConnection];
  }
  try {
    let productQuery, condition = '';
    const id = query.id;
    const selectedOption = query.selectedOption;
    const specifiedProducts = query.specifiedProducts;

    if(selectedOption === "custom") {
      productQuery = `
        WITH RECURSIVE subcategories as (SELECT C.category_id, C.parent_id, C.status, P.product_id FROM dropshop.categories C, dropshop.products P WHERE C.category_id=P.category_id UNION SELECT E.category_id, E.parent_id, E.status, S.product_id FROM dropshop.categories E INNER JOIN subcategories S ON E.category_id = S.parent_id) SELECT P.product_id as id, P.name, P.price, json_agg(json_build_object('name', PI.name, 'url', PI.url )) as images FROM dropshop.products P JOIN dropshop.product_images PI ON PI.product_id=P.product_id LEFT JOIN dropshop.distributors D ON D.distributor_id=P.distributor_id LEFT JOIN (SELECT product_id, COUNT(status) FILTER (WHERE status='N') as disabled_categories_count FROM subcategories **CONDITION** GROUP BY product_id) S ON S.product_id=P.product_id AND disabled_categories_count = 0 WHERE S.product_id IS NOT NULL AND P.product_id IN (${specifiedProducts}) AND P.status='1' AND (CASE WHEN D.status IS NULL THEN TRUE WHEN D.status = 'A' THEN TRUE ELSE FALSE END) GROUP BY P.product_id ORDER BY P.product_id LIMIT 4`;
    }

    if(selectedOption === "latest_products") {
      productQuery = `WITH RECURSIVE subcategories as (SELECT C.category_id, C.parent_id, C.status, P.product_id FROM dropshop.categories C, dropshop.products P WHERE C.category_id=P.category_id UNION SELECT E.category_id, E.parent_id, E.status, S.product_id FROM dropshop.categories E INNER JOIN subcategories S ON E.category_id = S.parent_id) SELECT P.product_id as id, P.name, P.price, json_agg(json_build_object('name', PI.name, 'url', PI.url )) as images FROM dropshop.products P JOIN dropshop.product_images PI ON PI.product_id=P.product_id LEFT JOIN dropshop.distributors D ON D.distributor_id=P.distributor_id LEFT JOIN (SELECT product_id, COUNT(status) FILTER (WHERE status='N') as disabled_categories_count FROM subcategories **CONDITION** GROUP BY product_id) S ON S.product_id=P.product_id AND disabled_categories_count = 0 WHERE S.product_id IS NOT NULL AND P.status='1' AND (CASE WHEN D.status IS NULL THEN TRUE WHEN D.status = 'A' THEN TRUE ELSE FALSE END) GROUP BY P.product_id ORDER BY P.created_at DESC LIMIT 4`;
    }

    if(selectedOption === "most_sold_products") {
      productQuery = `WITH RECURSIVE subcategories as (SELECT C.category_id, C.parent_id, C.status, P.product_id FROM dropshop.categories C, dropshop.products P WHERE C.category_id=P.category_id UNION SELECT E.category_id, E.parent_id, E.status, S.product_id FROM dropshop.categories E INNER JOIN subcategories S ON E.category_id = S.parent_id) SELECT P.product_id as id, P.name, P.price, json_agg(json_build_object('name', PI.name, 'url', PI.url )) as images, (SELECT COUNT(id) FROM dropshop.order_items OI WHERE OI.product_id=P.product_id) as orders FROM dropshop.products P JOIN dropshop.product_images PI ON PI.product_id=P.product_id LEFT JOIN dropshop.distributors D ON D.distributor_id=P.distributor_id LEFT JOIN (SELECT product_id, COUNT(status) FILTER (WHERE status='N') as disabled_categories_count FROM subcategories **CONDITION** GROUP BY product_id) S ON S.product_id=P.product_id AND disabled_categories_count = 0 WHERE S.product_id IS NOT NULL AND P.status='1' AND (CASE WHEN D.status IS NULL THEN TRUE WHEN D.status = 'A' THEN TRUE ELSE FALSE END) GROUP BY P.product_id ORDER BY P.created_at DESC, orders DESC LIMIT 4`;
    }

    const userMacroCategories = await getCategoriesRelatedToUserMacroCategories(otherParameters.user.id, this.knex);
    if(userMacroCategories.length > 0) {
      condition = `WHERE category_id IN (${userMacroCategories})`;
    }
    productQuery = productQuery.replace(`**CONDITION**`, condition);

    const productsQuery = await this.knex.raw(productQuery);
    let products = productsQuery.rows;
    products = await modifier(products, otherParameters.user, this.knex);
    const data = {
      id,
      type: "productSuggestions",
      data: products
    };
    return data;
  } catch (error) {
    console.log(`productSuggestions - #${query.id}`, error);
  }
};

const hotProducts = async (query, otherParameters = [], page_id) => {
  this.knex = databaseConnections.baseKnex;
  const databaseConnection = query.databaseConnection;
  if (databaseConnection) {
    this.knex = databaseConnections[databaseConnection];
  }
  try {
    let productQuery, condition = '';
    const id = query.id;
    const selectedOption = query.selectedOption;
    const specifiedProducts = query.specifiedProducts;

    if(selectedOption === "custom") {
      productQuery = `WITH RECURSIVE subcategories as (SELECT C.category_id, C.parent_id, C.status, P.product_id FROM dropshop.categories C, dropshop.products P WHERE C.category_id=P.category_id UNION SELECT E.category_id, E.parent_id, E.status, S.product_id FROM dropshop.categories E INNER JOIN subcategories S ON E.category_id = S.parent_id) SELECT P.product_id as id, P.name, P.price, json_agg(json_build_object('name', PI.name, 'url', PI.url )) as images FROM dropshop.products P JOIN dropshop.product_images PI ON PI.product_id=P.product_id LEFT JOIN dropshop.distributors D ON D.distributor_id=P.distributor_id LEFT JOIN (SELECT product_id, COUNT(status) FILTER (WHERE status='N') as disabled_categories_count FROM subcategories **CONDITION** GROUP BY product_id) S ON S.product_id=P.product_id AND disabled_categories_count = 0 WHERE S.product_id IS NOT NULL AND P.product_id IN (${specifiedProducts}) AND P.status='1' AND (CASE WHEN D.status IS NULL THEN TRUE WHEN D.status = 'A' THEN TRUE ELSE FALSE END) GROUP BY P.product_id ORDER BY P.product_id LIMIT 8`;
    }

    if(selectedOption === "latest_products") {
      productQuery = `WITH RECURSIVE subcategories as (SELECT C.category_id, C.parent_id, C.status, P.product_id FROM dropshop.categories C, dropshop.products P WHERE C.category_id=P.category_id UNION SELECT E.category_id, E.parent_id, E.status, S.product_id FROM dropshop.categories E INNER JOIN subcategories S ON E.category_id = S.parent_id) SELECT P.product_id as id, P.name, P.price, json_agg(json_build_object('name', PI.name, 'url', PI.url )) as images FROM dropshop.products P JOIN dropshop.product_images PI ON PI.product_id=P.product_id LEFT JOIN dropshop.distributors D ON D.distributor_id=P.distributor_id LEFT JOIN (SELECT product_id, COUNT(status) FILTER (WHERE status='N') as disabled_categories_count FROM subcategories **CONDITION** GROUP BY product_id) S ON S.product_id=P.product_id AND disabled_categories_count = 0 WHERE S.product_id IS NOT NULL AND P.status='1' AND (CASE WHEN D.status IS NULL THEN TRUE WHEN D.status = 'A' THEN TRUE ELSE FALSE END) GROUP BY P.product_id ORDER BY P.created_at DESC LIMIT 8`;
    }

    if(selectedOption === "most_sold_products") {
      productQuery = `WITH RECURSIVE subcategories as (SELECT C.category_id, C.parent_id, C.status, P.product_id FROM dropshop.categories C, dropshop.products P WHERE C.category_id=P.category_id UNION SELECT E.category_id, E.parent_id, E.status, S.product_id FROM dropshop.categories E INNER JOIN subcategories S ON E.category_id = S.parent_id) SELECT P.product_id as id, P.name, P.price, json_agg(json_build_object('name', PI.name, 'url', PI.url )) as images, (SELECT COUNT(id) FROM dropshop.order_items OI WHERE OI.product_id=P.product_id) as orders FROM dropshop.products P JOIN dropshop.product_images PI ON PI.product_id=P.product_id LEFT JOIN dropshop.distributors D ON D.distributor_id=P.distributor_id LEFT JOIN (SELECT product_id, COUNT(status) FILTER (WHERE status='N') as disabled_categories_count FROM subcategories **CONDITION** GROUP BY product_id) S ON S.product_id=P.product_id AND disabled_categories_count = 0 WHERE S.product_id IS NOT NULL AND P.status='1' AND (CASE WHEN D.status IS NULL THEN TRUE WHEN D.status = 'A' THEN TRUE ELSE FALSE END) GROUP BY P.product_id ORDER BY P.created_at DESC, orders DESC LIMIT 8`;
    }

    const userMacroCategories = await getCategoriesRelatedToUserMacroCategories(otherParameters.user.id, this.knex);
    if(userMacroCategories.length > 0) {
      condition = `WHERE category_id IN (${userMacroCategories})`;
    }
    productQuery = productQuery.replace(`**CONDITION**`, condition);

    const productsQuery = await this.knex.raw(productQuery);
    let products = productsQuery.rows;
    products = await modifier(products, otherParameters.user, this.knex);
    const data = {
      id,
      type: "hotProducts",
      data: products
    };
    return data;
  } catch (error) {
    console.log(`hotProducts - #${query.id}`, error);
  }
};

const blogPosts = async (query, otherParameters = [], page_id) => {
  this.knex = databaseConnections.baseKnex;
  const databaseConnection = query.databaseConnection;
  if (databaseConnection) {
    this.knex = databaseConnections[databaseConnection];
  }
  try {
    const id = query.id;
    let data;
    if (query.usePredefinedData) {
      data = query.data;
    } else {
      const products = await this.knex.raw(query.sql);
      data = products.rows;
    }
    return {
      id,
      type: "blogPosts",
      data,
    };
  } catch (error) {
    console.log(`blogPosts - #${query.id}`, error);
  }
};

const productCategories = async (query, otherParameters = [], page_id) => {
  this.knex = databaseConnections.baseKnex;
  const databaseConnection = query.databaseConnection;
  if (databaseConnection) {
    this.knex = databaseConnections[databaseConnection];
  }
  try {
    let categoriesQuery;
    const id = query.id;
    const selectedOption = query.selectedOption;
    const specifiedCategories = query.specifiedCategories;

    if(selectedOption === "custom") {
      categoriesQuery = `SELECT C.category_id as id, C.name, json_agg(CI.image) as images FROM dropshop.categories C JOIN dropshop.categories_image CI ON CI.category_id=C.category_id WHERE C.status='A' AND C.category_id IN (${specifiedCategories}) GROUP BY C.name, C.category_id LIMIT 3`;
    }

    if(selectedOption === "latest_categories") {
      categoriesQuery = `SELECT C.category_id as id, C.name, json_agg(CI.image) as images FROM dropshop.categories C JOIN dropshop.categories_image CI ON CI.category_id=C.category_id WHERE C.status='A' GROUP BY C.name, C.category_id, C.created_at ORDER BY C.created_at DESC LIMIT 3`;
    }

    const categories = await this.knex.raw(categoriesQuery);
    const data = {
      id,
      type: "productCategories",
      data: categories.rows
    };
    return data;
  } catch (error) {
    console.log(`productCategories - #${query.id}`, error);
  }
};

const catalog = async (query, otherParameters = [], page_id) => {
  const defaults = {
    limit: 25,
    offset: 0,
    perPage: 15,
    currentPage: 1,
  };

  this.knex = databaseConnections.baseKnex;
  const databaseConnection = query.databaseConnection;
  if (databaseConnection) {
    this.knex = databaseConnections[databaseConnection];
  }
  try {
    let id = query.id, condition = '';
    let categories, tags;

    let dataQuery = query.sql;
    dataQuery = dataQuery.split("**COLUMNS**").join(
      query.columns.map((column) => {
        return column.split("||").join('"');
      })
    );
    dataQuery = dataQuery
      .split("**PRODUCTS_TABLE**")
      .join(query.tables.products);

    // if (otherParameters.offset) {
    //   dataQuery = _.replace(
    //     dataQuery,
    //     `**OFFSET**`,
    //     `OFFSET ${otherParameters.offset}`
    //   );
    // } else {
    //   dataQuery = _.replace(
    //     dataQuery,
    //     `**OFFSET**`,
    //     `OFFSET ${defaults.offset}`
    //   );
    // }

    // if (otherParameters.limit) {
    //   dataQuery = _.replace(
    //     dataQuery,
    //     `**LIMIT**`,
    //     `LIMIT ${otherParameters.limit}`
    //   );
    // } else {
    //   dataQuery = _.replace(dataQuery, `**LIMIT**`, `LIMIT ${defaults.limit}`);
    // }
    
    dataQuery = `${dataQuery} LEFT JOIN ${query.tables.distributors} D ON D.${query.product.distributor.relationColumn}=P.${query.product.distributor.relationColumn}`;


    if(query.category.enable) {
      dataQuery = `WITH RECURSIVE subcategories as (SELECT C.${query.category.relationColumn.name}, C.${query.category.parentCategoryColumn}, C.${query.category.statusColumn}, P.${query.product.relationColumn} FROM ${query.tables.categories} C, ${query.tables.products} WHERE C.${query.category.relationColumn.name}=P.${query.category.relationColumn.name} UNION SELECT E.${query.category.relationColumn.name}, E.${query.category.parentCategoryColumn}, E.${query.category.statusColumn}, S.${query.product.relationColumn} FROM ${query.tables.categories} E INNER JOIN subcategories S ON E.${query.category.relationColumn.name} = S.${query.category.parentCategoryColumn}) ${dataQuery}`;
      if(otherParameters.cat_filter) {
        const macroCategoriesCategoriesQuery = await this.knex.raw(`
          SELECT category_id FROM dropshop.macro_categories_details WHERE macro_category_id=${otherParameters.cat_filter}
        `);
        const macroCategoriesCategories = macroCategoriesCategoriesQuery.rows.map( category => category.category_id );
        dataQuery = `${dataQuery} LEFT JOIN (SELECT ${query.category.relationColumn.name}, ${query.product.relationColumn}, COUNT(${query.category.statusColumn}) FILTER (WHERE ${query.category.statusColumn}='N') as disabled_categories_count FROM subcategories GROUP BY ${query.product.relationColumn}, ${query.category.relationColumn.name} HAVING ${query.category.relationColumn.name} IN (${macroCategoriesCategories.length > 0 ? macroCategoriesCategories : 0})) S ON S.${query.product.relationColumn}=P.${query.product.relationColumn} AND disabled_categories_count = 0`;
      } else {
        dataQuery = `${dataQuery} LEFT JOIN (SELECT ${query.product.relationColumn}, COUNT(${query.category.statusColumn}) FILTER (WHERE ${query.category.statusColumn}='N') as disabled_categories_count FROM subcategories **CONDITION** GROUP BY ${query.product.relationColumn}) S ON S.${query.product.relationColumn}=P.${query.product.relationColumn} AND disabled_categories_count = 0`;
      }
    }



    if(query.tag.enable) {
        if(otherParameters.tag_filter) {
            dataQuery = `${dataQuery} JOIN ${query.tables.product_tags} ON ${query.tables.product_tags}.${query.product.relationColumn}=P.${query.product.relationColumn} WHERE ${query.tables.product_tags}.${query.tag.relationColumn.name} IN (${otherParameters.tag_filter})`;
        }
    }

    // if(query.category.enable) {
    //   if(otherParameters.cat_filter) {
    //     if(query.tag.enable && otherParameters.tag_filter) {
    //       dataQuery = `${dataQuery} AND `;
    //     } else {
    //       dataQuery = `${dataQuery} WHERE ${query.category.relationColumn.name}=${otherParameters.cat_filter}`;
    //     }
    //   }
    // }

    // if(query.category.enable) {
    //   if(otherParameters.cat_filter) {
    //     if(query.tag.enable && otherParameters.tag_filter) {
    //       // dataQuery = `${dataQuery} AND `;
    //     } else {
    //       dataQuery = `${dataQuery} WHERE `;
    //     }
    //     // dataQuery = `${dataQuery} S.${query.category.relationColumn.name}=${otherParameters.cat_filter}`;
    //   }
    // }

    if(otherParameters.search) {
      if((query.tag.enable && otherParameters.tag_filter) || (query.category.enable && otherParameters.cat_filter)) {
        dataQuery = `${dataQuery} AND `;
      } else {
        dataQuery = `${dataQuery} WHERE `;
      }
      dataQuery = `${dataQuery} P.name ILIKE '%${otherParameters.search}%'`;
    }

    if((query.tag.enable && otherParameters.tag_filter) || (otherParameters.search)) {
      dataQuery = `${dataQuery} AND S.${query.product.relationColumn} IS NOT NULL AND P.${query.product.statusColumn}='1' AND (CASE WHEN D.${query.product.distributor.statusColumn} IS NULL THEN TRUE WHEN D.${query.product.distributor.statusColumn} = 'A' THEN TRUE ELSE FALSE END)`;
    } else {
      dataQuery = `${dataQuery} WHERE S.${query.product.relationColumn} IS NOT NULL AND P.${query.product.statusColumn}='1' AND (CASE WHEN D.${query.product.distributor.statusColumn} IS NULL THEN TRUE WHEN D.${query.product.distributor.statusColumn} = 'A' THEN TRUE ELSE FALSE END)`;
    }



    const userMacroCategories = await getCategoriesRelatedToUserMacroCategories(otherParameters.user.id, this.knex);
    if(userMacroCategories.length > 0) {
      condition = `WHERE category_id IN (${userMacroCategories})`;
    }
    dataQuery = dataQuery.replace(`**CONDITION**`, condition);


    totalResultsQuery = `${dataQuery}`;
    let totalResults = await this.knex.raw(totalResultsQuery);
    totalResults = totalResults.rows;
    // console.log(totalResults.length);

    dataQuery = `${dataQuery} ORDER BY P.product_id`;

    // console.log(dataQuery);

    const limit = parseInt(otherParameters.length && otherParameters.length != -1 ? otherParameters.length : 12, 10);
    const offset = parseInt(otherParameters.start || 0, 10);
    dataQuery = `${dataQuery} LIMIT ${limit} OFFSET ${offset}`;

        // if(otherParameters.search) {
        //     data.data = totalResults.rows.filter( totalResult => {
        //         let matches = _.filter(totalResult, obj => new RegExp(otherParameters.search, 'gi').test(obj));
        //         if(matches.length > 0) {
        //             return totalResult;
        //         }
        //         return false;
        //     });
        // } else {
        //     let filteredResults = await this.knex.raw(filteredSQL);
        //     data.data = filteredResults.rows;
        // }


    const productQuery = await this.knex.raw(dataQuery);

    let products = productQuery.rows;

    // console.log(products.length);
    // if (query.variation.enable) {
      // const productsMappedWithVariations = products.map(async (product) => ({
      //   ...product,
      //   variations: await getProductVariations(
      //     product.id,
      //     query.product.defaultPrimaryKey,
      //     query.variation.defaultPrimaryKey,
      //     query.variation.relationColumn,
      //     query.variation.values,
      //     query.tables.variations,
      //     query.tables.variation_values,
      //     this.knex
      //   ),
      // }));
      // products = await Promise.all(productsMappedWithVariations);
    // }

    if (query.category.enable) {
      // let rawAllCategories = this.knex
      //   .select([
      //     `C.${query.category.relationColumn.name} as ${query.category.relationColumn.alias}`,
      //     ...query.category.otherColumns
      //   ]);
      //   query.category.rawColumns.forEach( rawColumn => {
      //     rawAllCategories._aggregate(rawColumn.function, `${rawColumn.column} as ${rawColumn.alias}`)
      //   });
      // rawAllCategories.from({ C: query.tables.categories })
      //   .join({ CI: query.tables.category_images }, `CI.${query.category.relationColumn.name}`, `C.${query.category.relationColumn.name}`)
      //   .where(`C.${query.category.statusColumn}`, 'A')
      //   .groupBy(`C.${query.category.relationColumn.name}`, ...query.category.groupingBy);
      // categories = await rawAllCategories;
      const macroCategoriesQuery = await this.knex.raw(`
        SELECT macro_category_id as id, name FROM dropshop.macro_categories
      `);
      const macroCategories = macroCategoriesQuery.rows;
      categories = macroCategories;
      // const productsMappedWithCategories = products.map(async (product) => {
      //   const categories = await getProductCategories(
      //     product.id,
      //     query.tables.products,
      //     query.product.relationColumn,
      //     query.product.category.relationColumn,
      //     query.tables.categories,
      //     query.category.relationColumn,
      //     query.category.parentCategoryColumn,
      //     query.category.statusColumn,
      //     query.category.otherColumns,
      //     this.knex
      //   );
        // if (otherParameters.cat_filter) {
        //   const filteredCategories = categories.filter(
        //     (category) =>
        //       category[query.category.relationColumn.alias] ===
        //       parseInt(otherParameters.cat_filter, 10)
        //   );
        //   if (filteredCategories.length === 0) {
        //     return false;
        //   }
        //   return {
        //     ...product,
        //     categories,
        //   };
        // }
      //   return {
      //     ...product,
      //     categories,
      //   };
      // });
      // products = await Promise.all(productsMappedWithCategories);
      // products = products.filter( product => product );
      // products = products.filter((product) => {
      //   const filteredCategories = product.categories.filter( category => category.status === 'N' );
      //   return filteredCategories.length > 0 ? false : true;
      // });
    }

    if (query.image.enable) {
      const productsMappedWithImages = products.map(async (product) => ({
        ...product,
        images: await getProductImages(
          product.id,
          query.tables.images,
          query.product.relationColumn,
          query.image.otherColumns,
          this.knex
        ),
      }));
      products = await Promise.all(productsMappedWithImages);
    }

    if (query.tag.enable) {
      const rawAllTags = this.knex
        .select([
          `${query.tag.relationColumn.name} as ${query.tag.relationColumn.alias}`,
          ...query.tag.otherColumns,
        ])
        .from(query.tables.tags);
      tags = await rawAllTags;
      // const productsMappedWithTags = products.map(async (product) => ({
      //   ...product,
      //   tags: await getProductTags(
      //     product.id,
      //     query.tables.product_tags,
      //     query.product.relationColumn,
      //     query.tag.otherColumns,
      //     this.knex
      //   ),
      // }));
      // products = await Promise.all(productsMappedWithTags);
    }

    products = await modifier(products, otherParameters.user, this.knex);

    // if (otherParameters.search) {
    //   products = products.filter((product) => {
    //     let matches = _.filter(product, (obj) =>
    //       new RegExp(otherParameters.search, "gi").test(obj)
    //     );
    //     if (matches.length > 0) {
    //       return product;
    //     }
    //     return false;
    //   });
    // }

    // const totalProductsAvailable = await this.knex
    //   .select(this.knex.raw("COUNT(product_id) as products"))
    //   .from(query.tables.products)
    //   .first();

    // let data = await paginateCollection(
    //   await Promise.all(products),
    //   otherParameters.perPage || defaults.perPage,
    //   otherParameters.currentPage || defaults.currentPage
    // );

    // data.totalPages = parseInt(totalProductsAvailable.products, 10) / data.perPage;

    const data = await Promise.all(products);

    if (otherParameters.componentIsSingle) {
      return {
        // totalProductsAvailable: parseInt(totalProductsAvailable.products, 10),
        totalResults: (offset === 0 && data.length === 0) ? 0 : totalResults.length,
        // totalPages: Math.floor(totalResults.length / limit),
        length: limit,
        start: offset,
        data,
      };
    }

    return {
      id,
      type: "catalog",
      data: {
        // totalProductsAvailable: parseInt(totalProductsAvailable.products, 10),
        totalResults: (offset === 0 && data.length === 0) ? 0 : totalResults.length,
        // totalPages: Math.floor(totalResults.length / limit),
        length: limit,
        start: offset,
        data,
      },
      categories,
      tags,
    };
  } catch (error) {
    console.log(`catalog - #${query.id}`, error);
    return {
      message: "An error occured. Please see logs.",
    };
  }
};

const cart = async (query, otherParameters = [], page_id) => {
  this.knex = databaseConnections.baseKnex;
  const databaseConnection = query.databaseConnection;
  if (databaseConnection) {
    this.knex = databaseConnections[databaseConnection];
  }
  try {
    const id = query.id;
    const cart = await getUserCart(
      otherParameters.user[query.user.relationColumn],
      query.tables.cart,
      query.cart.relationColumn,
      query.cart.otherColumns,
      this.knex
    );

    let cartItems = await this.knex.raw(
      `SELECT * FROM ${query.tables.cartItems} WHERE ${
        query.cart.defaultPrimaryKey
      }=${cart[query.cart.defaultPrimaryKey]}`
    );
    cartItems = cartItems.rows.map(async (cartItem) => {
      cartItem.product = await getProduct(
        cartItem[query.product.relationColumn],
        query.tables.products,
        query.product.relationColumn,
        query.product.otherColumns,
        this.knex
      );
      const {
        [query.product.relationColumn]: extraProductIdColumn,
        [query.cart.defaultPrimaryKey]: extraCartIdColumn,
        ...restCartItemData
      } = cartItem;
      return restCartItemData;
    });

    const data = await Promise.all(cartItems);

    return {
      id,
      type: "cart",
      cartId: cart[query.cart.defaultPrimaryKey],
      data,
    };
  } catch (error) {
    console.log(`cart - #${query.id}`, error);
  }
};

const exportableFunctions = {
  carousel,
  features,
  productSuggestions,
  hotProducts,
  blogPosts,
  catalog,
  productCategories,
  cart,
};

module.exports = exportableFunctions;
