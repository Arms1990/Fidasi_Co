const _ = require('lodash');
const { UIPageDetail } = require('../../../database/models');
const { pageDetailStatuses } = require('../../../database/enums');

const getQueries = async (page_id, filterRenderable = true) => {
    let queries = [];
    const details = await UIPageDetail.query()
        .select('function', 'details')
        .where('page_id', page_id)
        .where('status', pageDetailStatuses.A);

    const detailsFiltered = details
    // .map( detail => detail.details )
    .filter( detail => _.size(detail.details) > 0 );
    // console.log('Details', detailsFiltered);
    // function
    detailsFiltered.forEach( detailFiltered => {
        if(Array.isArray(detailFiltered.details)) {
            detailFiltered.details.forEach( detailFilteredFurther => queries.push({ name: detailFiltered.function, details: detailFilteredFurther }) );
        } else {
            queries.push({ name: detailFiltered.function, details: detailFiltered.details });
        }
    });

    if(filterRenderable) {
        const totalQueries = queries.filter( query => {
            if(query.render !== undefined) {
                return query.render;       
            }
            return true;
        });
        return totalQueries;
    }
    return queries;
}

const getObject = (entireObj, keyToFind, valToFind) => {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind] === valToFind) {
        foundObj = nestedValue;
        }
        return nestedValue;
    });
    return foundObj;
}

const getSpecificQuery = async (pageID, elementID) => {
    const queries = await getQueries(pageID, false);
    const query = getObject(queries, 'id', elementID);
    return query;
}


const getPageFromElement = async (elementID) => {
    let page_id = null;
    let details = await UIPageDetail.query()
        .select('page_id', 'details')
        .where('status', pageDetailStatuses.A);
    details = details.filter( detail => _.size(detail.details) > 0 );

    details.forEach( detail => {
        if(!Array.isArray(detail.details)) {
            if(detail.details.id === elementID) {
                page_id = detail.page_id;
            }
        } else {
            detail.details.every( component => {
                if(component.id === elementID) {
                    page_id = detail.page_id;
                    return false;
                }
            });
        }
    });
    return page_id;
}

const paginateCollection = async (items = [], pageSize = 15, page = 1) => {
    let pg = page || 1,
        pgSize = pageSize || 100,
        offset = (pg - 1) * pgSize,
        pagedItems = _.drop(items, offset).slice(0, pgSize);
        
    return {
        currentPage: parseInt(pg, 10),
        perPage: parseInt(pgSize, 10),
        totalResults: items.length,
        totalPages: Math.ceil(items.length / pgSize),
        data: pagedItems
    };
}

const getProductVariations = async (productId, productsPrimaryKey, variationPrimaryKey, variantRelationColumn, variationValuesColumns, variantTable, variantValueTable, knex) => {
    let variants = await knex.raw(`SELECT ${variantRelationColumn} FROM ${variantTable} WHERE ${productsPrimaryKey}=${productId}`);
    variants = variants.rows.map( async (variant) => {
        let variantValues = await getProductVariationValues(productId, productsPrimaryKey, variationPrimaryKey, variationValuesColumns, variant[variantRelationColumn], variantValueTable, knex);
        return variantValues;
    });
    return await Promise.all(variants);
}

const getProductVariationValues = async (productId, productsPrimaryKey, variationPrimaryKey, variationValuesColumns, variantId, variantValueTable, knex) => {
    let variantValues = await knex.raw(`SELECT ${variationValuesColumns.key}, ${variationValuesColumns.value} FROM ${variantValueTable} WHERE ${productsPrimaryKey}=${productId} AND ${variationPrimaryKey}=${variantId}`);
    variantValues = variantValues.rows.map( variantValue => ([ variantValue[variationValuesColumns.key], variantValue[variationValuesColumns.value] ]) )
    return Object.fromEntries(variantValues);
}

const getProductCategories = async (productId, productsTable, productRelationColumn, productCategoryRelationColumn, categoriesTable, categoryRelationColumn, parentCategoryColumn, categoryStatusColumn, otherColumns, knex) => {
    let productCategories = await knex.raw(`SELECT ${productCategoryRelationColumn} FROM ${productsTable} WHERE ${productRelationColumn}=${productId}`);
    productCategories = productCategories.rows;
    if(productCategories.length === 0) {
        return [];
    }
    const productCategoryIds = productCategories.map( productCategory => productCategory[productCategoryRelationColumn] )
    const categories = await getCategories(productCategoryIds, categoriesTable, categoryRelationColumn, parentCategoryColumn, categoryStatusColumn, otherColumns, knex);
    const categoriesResolved = await Promise.all(categories);
    return categoriesResolved.flat();
}

const getCategories = async (categoryIds, categoriesTable, categoryRelationColumn, parentCategoryColumn, categoryStatusColumn, otherColumns, knex) => {
    let categories = await knex.raw(`SELECT ${categoryRelationColumn.name} as ${categoryRelationColumn.alias}, ${parentCategoryColumn}, ${categoryStatusColumn} ${otherColumns.length > 0 ? "," : ""} ${otherColumns.join(",")} FROM ${categoriesTable} C WHERE ${categoryRelationColumn.name} IN (${categoryIds.join(",")})`);
    categories = categories.rows;
    if(categories.length === 0) {
        return [];
    }
    return categories.map( async (category) => {
        const parentCategories = await getCategories( [category[parentCategoryColumn] ], categoriesTable, categoryRelationColumn, parentCategoryColumn, categoryStatusColumn, otherColumns, knex);
        const parentCategoriesResolved = await Promise.all(parentCategories);
        const { [parentCategoryColumn]: extraColumn, ...restCategoryData } = category;
        return [
            restCategoryData,
            ...parentCategoriesResolved.flat()
        ];
    });
}

const getProductImages = async (productId, productImagesTable, productImageRelationColumn, otherColumns, knex) => {
    let images = await knex.raw(`SELECT ${productImageRelationColumn} ${otherColumns.length > 0 ? "," : ""} ${otherColumns.join(",")} FROM ${productImagesTable} WHERE ${productImageRelationColumn}=${productId}`);
    images = images.rows;
    if(images.length === 0) {
        return [];
    }
    return images.map( image => {
        const { [productImageRelationColumn]: extraColumn, ...restImageData } = image;
        return restImageData;
    });
}

const getProductTags = async (productId, productTagsTable, productTagRelationColumn, otherColumns, knex) => {
    let tags = await knex.raw(`SELECT ${productTagRelationColumn} ${otherColumns.length > 0 ? "," : ""} ${otherColumns.join(",")} FROM ${productTagsTable} WHERE ${productTagRelationColumn}=${productId}`);
    tags = tags.rows;
    if(tags.length === 0) {
        return [];
    }
    return tags.map( tag => {
        const { [productTagRelationColumn]: extraColumn, ...restTagData } = tag;
        return restTagData;
    });
}


const getProduct = async (productId, productsTable, productRelationColumn, otherColumns, knex) => {
    let products = await knex.raw(`SELECT ${productRelationColumn} ${otherColumns.length > 0 ? "," : ""} ${otherColumns.join(",")} FROM ${productsTable} WHERE ${productRelationColumn}=${productId}`);
    products = products.rows;
    if(products.length === 0) {
        return null;
    }
    return _.last(products);
} 

const getCart = async (cartId, cartTable, otherColumns, knex) => {
    let carts = await knex.raw(`SELECT ${otherColumns.join(",")} FROM ${cartTable} WHERE ${query.cart.relationColumn}=${cartId}`);
    carts = carts.rows;
    if(carts.length === 0) {
        return null;
    }
    return _.last(carts);
}

const getUserCart = async (userId, cartsTable, cartUserRelationColumn, otherColumns, knex) => {
    let carts = await knex.raw(`SELECT ${cartUserRelationColumn} ${otherColumns.length > 0 ? "," : ""} ${otherColumns.join(",")} FROM ${cartsTable} WHERE ${cartUserRelationColumn}=${userId}`);
    carts = carts.rows;
    if(carts.length === 0) {
        carts = await knex.table(cartsTable)
            .insert({
                [cartUserRelationColumn]: userId
            })
            .returning([
                cartUserRelationColumn,
                ...otherColumns
            ]);
        return _.last(carts);
    }
    return _.last(carts);
}

module.exports = {
    getQueries,
    getSpecificQuery,
    getPageFromElement,
    paginateCollection,
    getProductVariations,
    getProductCategories,
    getProductImages,
    getProductTags,
    getProduct,
    getCart,
    getUserCart
};