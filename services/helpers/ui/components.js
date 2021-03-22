const _ = require('lodash');
const { getSpecificQuery, getPageFromElement, paginateCollection, getPageList, findMatches } = require('./query');

const databaseConnections = require('../../connections');

async function dataTable(query, filters, otherParameters = [], hasButtons) {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        let data = {};
        let sql = query.sql;
        const id = query.id;
        const tables = query.tables;
        const buttons = query.buttons || [];
        const legend = query.legend;
        let columns = query.columns;
        tables.forEach( table => {
            const identifier = table.identifier;
            const name = table.table;
            sql = _.replace(sql, new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name);
            columns = columns.map( (column, key) => {
                if(column.type) {
                    let customData = [];
                    column.identifier.forEach( (customIdentifier) => {
                        let newColumn = {
                            identifier: _.replace(customIdentifier.identifier, new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name),
                            as: _.replace(customIdentifier.as, new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name)
                        };
                        customData.push(newColumn);
                        // customData.push(_.replace(customIdentifier.identifier, new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name))
                    });
                    column.identifier = customData;
                    // columns[key]['identifier'] = customData;
                } else {
                    column.as = _.replace(columns[key]['as'], new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name);
                    column.identifier = _.replace(columns[key]['identifier'], new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name);
    
                    // columns[key]['as'] = _.replace(columns[key]['as'], new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name);
                    // columns[key]['identifier'] = _.replace(columns[key]['identifier'], new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name);
                }
                return column;
            });
        });
        let columnsLabels = columns.map( column => column.label );
        let columnsIdentifiers = [...columns].map( column => {
            let identifier;
            if(column.type) {
                identifier = column.identifier.map( customIdentifier => {
                    return `${customIdentifier.identifier} as "${customIdentifier.as}"`;
                });
            } else {
                identifier = `${column.identifier} as "${column.as}"`;
            }
            return {
                ...column,
                identifier
            };
        }).map( columnsIdentifier => columnsIdentifier.identifier );
        columnsIdentifiers = _.flatten(columnsIdentifiers);
        sql = _.replace(sql, /\|columns\|/i, columnsIdentifiers.join(','));
        sql = _.replace(sql, /\@auth_id\@/gi, otherParameters.user.id);
        const matches = [ ...sql.matchAll(/@(.+?)@/gi) ];
        filters.forEach( filter => {
            matches.map( match => match[0] ).forEach( match => {
                if(match.match(new RegExp(filter.id), 'gi')) {
                    sql = _.replace(sql, new RegExp(match, 'gi'), filter.value);
                }
            });
        });
        const filteredSQL = `${sql} LIMIT ${otherParameters.length && otherParameters.length != -1 ? otherParameters.length : 10} OFFSET ${otherParameters.start || 0}`;
        data.id = id;
        data.type = "datatable";
        data.entityNames = tables;
        if(hasButtons) {
            data.buttons = buttons;
        }
        data.columns = columns;
        data.legend = legend;
        let totalResults = await this.knex.raw(sql);
        if(otherParameters.search) {
            data.data = totalResults.rows.filter( totalResult => {
                let matches = _.filter(totalResult, obj => new RegExp(otherParameters.search, 'gi').test(obj));
                if(matches.length > 0) {
                    return totalResult;
                }
                return false;
            });
        } else {
            let filteredResults = await this.knex.raw(filteredSQL);
            data.data = filteredResults.rows;
        }
        data.total = totalResults.rowCount;
        return data;
    } catch(error) {
        console.log(`DataTable - #${query.id}`, error);
    }
}


const ddl = async (query, filters, otherParameters = [], hasButtons) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        let data = {};
        let sql = query.sql;
        const tables = query.tables;
        const legend = query.legend;
        const id = query.id;
        const buttons = query.buttons || [];
        let columns = query.columns;
        tables.forEach( table => {
            const identifier = table.identifier;
            const name = table.table;
            sql = _.replace(sql, new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name);
            columns = columns.map( (column, key) => {
                if(column.type) {
                    let customData = [];
                    column.identifier.forEach( (customIdentifier) => {
                        let newColumn = {
                            identifier: _.replace(customIdentifier.identifier, new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name),
                            as: _.replace(customIdentifier.as, new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name)
                        };
                        customData.push(newColumn);
                        // customData.push(_.replace(customIdentifier.identifier, new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name))
                    });
                    column.identifier = customData;
                    // columns[key]['identifier'] = customData;
                } else {
                    column.as = _.replace(columns[key]['as'], new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name);
                    column.identifier = _.replace(columns[key]['identifier'], new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name);

                    // columns[key]['as'] = _.replace(columns[key]['as'], new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name);
                    // columns[key]['identifier'] = _.replace(columns[key]['identifier'], new RegExp(`\\*{2}(${identifier})\\*{2}`, 'gi'), name);
                }
                return column;
            });
        });
        let columnsLabels = columns.map( column => column.label );
        let columnsIdentifiers = [...columns].map( column => {
            let identifier;
            if(column.type) {
                identifier = column.identifier.map( customIdentifier => {
                    return `${customIdentifier.identifier} as "${customIdentifier.as}"`;
                });
            } else {
                identifier = `${column.identifier} as "${column.as}"`;
            }
            return {
                ...column,
                identifier
            };
        }).map( columnsIdentifier => columnsIdentifier.identifier );
        columnsIdentifiers = _.flatten(columnsIdentifiers);
        sql = _.replace(sql, /\|columns\|/i, columnsIdentifiers.join(','));
        sql = _.replace(sql, /\@auth_id\@/gi, otherParameters.user.id);
        const matches = [ ...sql.matchAll(/@(.+?)@/gi) ];
        filters.forEach( filter => {
            matches.map( match => match[0] ).forEach( match => {
                if(match.match(new RegExp(filter.id), 'gi')) {
                    sql = _.replace(sql, new RegExp(match, 'gi'), filter.value);
                }
            });
        });
        const filteredSQL = `${sql} LIMIT ${otherParameters.length && otherParameters.length != -1 ? otherParameters.length : 10} OFFSET ${otherParameters.start || 0}`;
        data.id = id;
        data.type = "ddl";
        data.entityNames = tables;
        if(hasButtons) {
            data.buttons = buttons;
        }
        data.columns = columns;
        data.legend = legend;
        let totalResults = await this.knex.raw(sql);
        if(otherParameters.search) {
            let modifiedTotalResults = totalResults.rows.filter( totalResult => {
                let matches = _.filter(totalResult, obj => new RegExp(otherParameters.search, 'gi').test(obj));
                if(matches.length > 0) {
                    return totalResult;
                }
                return false;
            })
            .map(function(totalResult) {
                const actionColumns = columns.filter( column => column.type );
                actionColumns.forEach( actionColumn => {
                    let updatedData = {};
                    actionColumn.identifier.forEach( actionColumnIdentifier => {
                        updatedData[actionColumnIdentifier.as] = totalResult[actionColumnIdentifier.as];
                    });
                    totalResult[actionColumn.key] = updatedData;
                });
                let dataObject = {};
                const children = [];
                dataObject.children = [];
                dataObject.data = totalResult;
                dataObject.permissible = false;
                return dataObject;
            });
            data.data = _.slice(modifiedTotalResults, otherParameters.start, otherParameters.start + otherParameters.length);
        } else {
            let filteredResults = await this.knex.raw(filteredSQL);
            const filteredRows = filteredResults.rows.map( filteredResult => {
                const actionColumns = columns.filter( column => column.type );
                actionColumns.forEach( actionColumn => {
                    let updatedData = {};
                    actionColumn.identifier.forEach( actionColumnIdentifier => {
                        updatedData[actionColumnIdentifier.as] = filteredResult[actionColumnIdentifier.as];
                    });
                    filteredResult[actionColumn.key] = updatedData;
                });
                let dataObject = {};
                const children = [];
                dataObject.children = [];
                dataObject.data = filteredResult;
                dataObject.permissible = false;
                return dataObject;
            });
            data.data = filteredRows;
        }
        data.total = totalResults.rowCount;
        return data;
    } catch(error) {
        console.log(`DDL - #${query.id}`, error);
    }
}



const chart = async (query, filters, otherParameters, hasButtons, page_id) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const data = {};
        const kind = query.kind;
        const legend = query.legend;
        const datasets = query.datasets;
        const datasetsMapped = datasets.map( async (dataset) => {
            const columns = dataset.columns;
            const columnsLabels = columns.map( column => column.label );
            const columnsIdentifier = columns.map( column => column.identifier );
            let sql = dataset.sql;
            const xColumn = dataset.xColumn;
            const yColumn = dataset.yColumn;
            const timeIdentifier = dataset.timeIdentifier;
            const label = dataset.label;
            const table = dataset.table;
            sql = _.replace(sql, /\|columns\|/i, columnsIdentifier.join(','));
            sql = _.replace(sql, /\|table\|/gi, table);
            sql = _.replace(sql, /\@auth_id\@/gi, otherParameters.user.id);
            const set = {
                labels: columnsLabels,
                label,
                xColumn,
                timeIdentifier,
                yColumn,
                entityName: table,
                data: []
            };
            const results = await this.knex.raw(sql);
            set.data = results.rows;
            return set;
            // data.data.push(set);
        });
        const datasetsMappedResolved = await Promise.all(datasetsMapped);
        data.id = query.id;
        data.type = "chart";
        data.kind = kind;
        data.legend = legend;
        data.data = datasetsMappedResolved;
        if(query.elements) {
            const elements = query.elements.map( async (element) => {
                const subQuery = await getSpecificQuery(page_id, element);
                if(!subQuery) {
                    return false;
                }
                const performedQuery = await exportableFunctions[subQuery.type](subQuery, filters, otherParameters, hasButtons, page_id );
                return performedQuery;
            });
            const finalElements = await Promise.all(elements);
            data.elements = finalElements.filter( element => element );
        }
        if(query.functions) {
            data.functions = query.functions;
        }
        return data;
    } catch(error) {
        console.log(`Chart - #${query.id}`, error);
    }
}

const card = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    try {
        const id = query.id;
        const image = query.image;
        const transparent = query.transparent;
        let children = query.children;
        children = children.map( async (child) => {
            const subQuery = await getSpecificQuery(page_id, child);
            if(!subQuery) {
                return false;
            }
            const performedQuery = await exportableFunctions[subQuery.type](subQuery, filters, otherParameters, hasButtons, page_id );
            return performedQuery;
        });
        const finalData = await Promise.all(children);
        const data = {
            id,
            type: "card",
            image,
            transparent,
            children: finalData.filter( child => child )
        };
        if(query.title) {
            data.title = query.title;
        }
        if(query.description) {
            data.description = query.description;
        }
        if(query.fullWidth) {
            data.fullWidth = query.fullWidth;
        }
        return data;
    } catch(error) {
        console.log(`Card - #${query.id}`, error);
    }
}

const calendar = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    try {
        const id = query.id;
        const title = query.title;
        const description = query.description;
        const events = query.events;
        const data = {
            id,
            title,
            type: "calendar",
            description,
            events
        };
        if(query.functions) {
            data.functions = query.functions;
        }
        return data;
    } catch(error) {
        console.log(`Calendar - #${query.id}`, error);
    }
}

const table = async (query, filters, otherParameters = [], hasButtons) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const data = {};
        let sql = query.sql;
        const id = query.id;
        const table = query.table;
        const legend = query.legend;
        const columns = query.columns;
        const columnsLabels = columns.map( column => column.label );
        const columnsIdentifier = columns.map( column => column.identifier );
        sql = _.replace(sql, /\|columns\|/i, columnsIdentifier.join(','));
        sql = _.replace(sql, /\|table\|/gi, table);
        const matches = [ ...sql.matchAll(/@(.+?)@/gi) ];
        filters.forEach( filter => {
            matches.map( match => match[0] ).forEach( match => {
                if(match.match(new RegExp(filter.id), 'gi')) {
                    sql = _.replace(sql, new RegExp(match, 'gi'), filter.value);
                }
            });
        });
        const filteredSQL = `${sql} LIMIT ${otherParameters.length && otherParameters.length != -1 ? otherParameters.length : 10} OFFSET ${otherParameters.start || 0}`;
        data.id = id;
        data.type = "table";
        data.entityName = table;
        data.columns = columns;
        data.legend = legend;
        let totalResults = await this.knex.raw(sql);
        if(otherParameters.search) {
            data.data = totalResults.rows.filter( totalResult => {
                let matches = _.filter(totalResult, obj => new RegExp(otherParameters.search, 'gi').test(obj));
                if(matches.length > 0) {
                    return totalResult;
                }
                return false;
            });
        } else {
            let filteredResults = await this.knex.raw(filteredSQL);
            data.data = filteredResults.rows;
        }
        data.total = totalResults.rowCount;
        if(query.functions) {
            data.functions = query.functions;
        }
        return data;
    } catch(error) {
        console.log(`Table - #${query.id}`, error);
    }
}


const userCard = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const id = query.id;
        const title = query.title || "";
        let results = [];
        if(query.sql) {
            let sql = query.sql;
            sql = _.replace(sql, /\@auth_id\@/gi, otherParameters.user.id);
            let elements = [];
            if(query.elements) {
                elements = elements.map( async (element) => {
                    const subQuery = await getSpecificQuery(page_id, element);
                    if(!subQuery) {
                        return false;
                    }
                    const performedQuery = await exportableFunctions[subQuery.type](subQuery, filters, otherParameters, hasButtons, page_id );
                    return performedQuery;
                }).filter( element => element );
            }
            results = await this.knex.raw(sql);
            results = results.rows;
            // const elementsNormalized = await Promise.all(elements);
            // console.log('A', elementsNormalized);
            // if(elementsNormalized.length > 0) {
            //     results = results.rows.map( async (result) => {
            //         result.elements = elementsNormalized;
            //         return result;
            //     });
            // }
        } else {
            const items = query.items;
            results = items.map( async (item) => {
                const itemData = {};
                itemData.title = item.title;
                if(item.subtitle) {
                    itemData.subtitle = item.subtitle;
                }
                if(item.image) {
                    itemData.image = item.image;
                }
                if(item.redirect) {
                    itemData.redirect = item.redirect;
                }
                if(item.elements) {
                    let elements = item.elements.map( async (element) => {
                        const subQuery = await getSpecificQuery(page_id, element);
                        if(!subQuery) {
                            return false;
                        }
                        const performedQuery = await exportableFunctions[subQuery.type](subQuery, filters, otherParameters, hasButtons, page_id );
                        return performedQuery;
                    });
                    elements = await Promise.all(elements);
                    elements = elements.filter( element => element );
                    if(elements.length > 0) {
                        itemData.elements = elements
                    }
                }
                if(item.icon) {
                    itemData.icon = item.icon;
                }
                return itemData
            });
        }
        const data = {
            id,
            type: "userCard",
            title,
            data: await Promise.all(results)
        }
        if(query.functions) {
            data.functions = query.functions;
        }
        return data;
    } catch(error) {
        console.log(`userCard - #${query.id}`, error);
    }
}


const profileCard = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    try {
        const id = query.id;
        const title = query.title || "";
        const data = {
            id,
            type: "profileCard",
            title
        }
        if(query.functions) {
            data.functions = query.functions;
        }
        return data;
    } catch(error) {
        console.log(`profileCard - #${query.id}`, error);
    }
}


const productList = async (query, filters = [], otherParameters = [], hasButtons = false, page_id = null) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {

        let queryFilters = await query.filters.map( async (filter) => {
            if(filter.name.toLowerCase().indexOf("price") !== -1) {
                let maxPriceFilterValue = await this.knex.raw(`SELECT MAX(${query.columns.price}) as price FROM ${query.productsTable}`)
                maxPriceFilterValue = maxPriceFilterValue.rows[0].price;
                return {
                    ...filter,
                    attributes: {
                        min: 0,
                        max: Math.ceil(maxPriceFilterValue || filter.attributes.max)
                    }
                };
            }
            if(filter.type === "staticDDL") {
                const query = await this.knex.raw(filter.attributes.sql);
                const { sql: excludedAttribute, ...restAttributes } = filter.attributes;
                return {
                    ...filter,
                    attributes: restAttributes,
                    data: query.rows
                };
            }
            return filter;
        });
        queryFilters = await Promise.all(queryFilters);
        const data = {
            id: query.id,
            type: "productList",
            title: query.title,
            detailViewSlug: query.detailViewSlug,
            entityName: query.entityName,
            showExtendedFeatures: query.showExtendedFeatures,
            filters: queryFilters,
            actions: query.actions
        };
        const columns = query.columns;
        if(query.functions) {
            data.functions = query.functions;
        }
        let sql = query.sql;
        const condition = query.condition;
        const conditionRequired = query.conditionRequired || false;
        let list = query.list;
        if(otherParameters.data && otherParameters.data !== 'false') {
            list = otherParameters.data;
        } else {
            const queryParams = otherParameters.queryString || {};
            if(queryParams.id) {
                list = queryParams.id.split(",")
                    .map( idChunk => idChunk.trim() )
                    .filter( idChunk => idChunk.length > 0 );
            }
        }
        if(list.length > 0) {
            sql += ` ${condition}`;
            sql = _.replace(sql, /\|list\|/gi, list.join(","));
        } else if(!Array.isArray(list)) {
            sql += ` ${condition}`;
            sql = _.replace(sql, /\|list\|/gi, null);
        }



        if(otherParameters.filters) {
            let conditions = [];
            if(otherParameters.filters.price) {
                const price = otherParameters.filters.price.split(",");
                conditions.push(`${columns.price} BETWEEN ${price[0]} AND ${price[1]}`);
            }
            if(otherParameters.filters.name) {
                const name = otherParameters.filters.name;
                conditions.push(`${columns.name} ILIKE '%${name}%'`);
            }
            if(otherParameters.filters.status) {
                const status = otherParameters.filters.status;
                conditions.push(`${columns.status}='${status}'`);
            }
            if(otherParameters.filters.category) {
                const category = otherParameters.filters.category;
                conditions.push(`${columns.category} IN (${category})`);
            }
            if(otherParameters.filters.tag) {
                const tag = otherParameters.filters.tag;
                conditions.push(`${columns.tag} IN (${tag})`);
            }
            if(query.useWhere) {
                sql = _.replace(sql, new RegExp(`\\*{2}(CONDITIONS)\\*{2}`, 'gi'), "WHERE " + conditions.join(" AND "));
            } else {
                sql = _.replace(sql, new RegExp(`\\*{2}(CONDITIONS)\\*{2}`, 'gi'), "AND " + conditions.join(" AND "));
            }
        } else {
            sql = _.replace(sql, new RegExp(`\\*{2}(CONDITIONS)\\*{2}`, 'gi'), "");
        }



        const totalResults = await this.knex.raw(sql);
        const paginatedData = await paginateCollection(totalResults.rows, otherParameters.perPage, otherParameters.currentPage);
        const currentPage = otherParameters.currentPage || 1;
        const perPage = otherParameters.perPage || 12;



        const filteredSQL = `${sql} LIMIT ${perPage} OFFSET ${perPage * (currentPage == 1 ? 0 : currentPage - 1)}`;
        const filteredResults = await this.knex.raw(filteredSQL);
        data.data = {
            data: filteredResults.rows,
            currentPage: paginatedData.page,
            perPage: paginatedData.pageSize,
            pageList: getPageList(paginatedData.total_pages, paginatedData.page, paginatedData.pageSize)
        };
        return data;
    } catch(error) {
        console.log(`productList - #${query.id}`, error);
    }
}


const productCardList = async (query, filters = [], otherParameters = [], hasButtons = false, page_id = null) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const data = {
            id: query.id,
            type: "productList",
            title: query.title
        };
        if(query.functions) {
            data.functions = query.functions;
        }
        let sql = query.sql;
        const condition = query.condition;
        const conditionRequired = query.conditionRequired || false;
        let list = query.list;
        if(otherParameters.data && otherParameters.data !== 'false') {
            list = otherParameters.data;
        } else {
            const queryParams = otherParameters.queryString || {};
            if(queryParams.id) {
                list = queryParams.id.split(",")
                    .map( idChunk => idChunk.trim() )
                    .filter( idChunk => idChunk.length > 0 );
            }
        }
        if(list.length > 0) {
            sql += ` ${condition}`;
            sql = _.replace(sql, /\|list\|/gi, list.join(","));
        } else if(!Array.isArray(list)) {
            sql += ` ${condition}`;
            sql = _.replace(sql, /\|list\|/gi, null);
        }
        const results = await this.knex.raw(sql);
        data.data = results.rows;
        return data;
    } catch(error) {
        console.log(`productList - #${query.id}`, error);
    }
}


const wizard = async (query, filters = [], otherParameters = [], hasButtons = false, page_id = null) => {
    this.knex = databaseConnections.baseKnex;
    try {
        let data = {
            steps: []
        };
        data.id = query.id;
        data.type = "wizard";
        data.hideSteps = query.hideSteps;
        data.componentTitle = query.componentTitle;
        data.hideBottomNavigation = query.hideBottomNavigation;
        if(query.initialAction) {
            data.initialAction = query.initialAction;
        }
        if(query.functions) {
            data.functions = query.functions;
        }
        const steps = query.steps.map( async (step) => {
            let stepObject = {
                id: step.id
            };
            if(step.title) {
                stepObject.title = step.title;
            }
            if(step.description) {
                stepObject.description = step.description;
            }
            if(step.action) {
                stepObject.action = step.action;
            }
            if(step.actNatively) {
                stepObject.actNatively = step.actNatively;
            }
            if(step.redirect) {
                stepObject.redirect = step.redirect;
            }
            let elements = step.elements.map( async (element) => {
                let stepElement = {};
                if(element.label) {
                    stepElement.label = element.label;
                }
                if(element.name) {
                    stepElement.name = element.name;
                }
                if(element.validationRules) {
                    stepElement.validationRules = element.validationRules;
                }
                if(element.isHidden) {
                    stepElement.isHidden = element.isHidden;
                }
                if(element.hiddenLabel) {
                    stepElement.hiddenLabel = element.hiddenLabel;
                }
                if(element.type) {
                    stepElement.type = element.type;
                    if(stepElement.type === "searchableDDL") {
                        const databaseConnection = element.databaseConnection;
                        if(databaseConnection) {
                            this.knex = databaseConnections[databaseConnection];
                        }
                        let query = await this.knex.raw(element.sql);
                        stepElement.data = query.rows;
                        stepElement.ddl = element.ddl;
                        stepElement.elementID = data.id;
                    }
                    if(stepElement.type === "staticDDL") {
                        const databaseConnection = element.databaseConnection;
                        if(databaseConnection) {
                            this.knex = databaseConnections[databaseConnection];
                        }
                        if(element.sql) {
                            let query = await this.knex.raw(element.sql);
                            stepElement.data = query.rows;
                        } else {
                            stepElement.data = [];
                        }
                        stepElement.ddl = element.ddl;
                    }
                    if(stepElement.type === "predefinedDDL") {
                        if(element.sql) {
                            const databaseConnection = element.databaseConnection;
                            if(databaseConnection) {
                                this.knex = databaseConnections[databaseConnection];
                            }
                            let query = await this.knex.raw(element.sql);
                            stepElement.data = query.rows;
                            stepElement.ddl = element.ddl;
                        } else {
                            stepElement.data = element.options;
                            stepElement.ddl = element.ddl;
                        }
                    }
                    if(stepElement.type === "component") {
                        const page_id = await getPageFromElement(stepElement.name);
                        const component = await getSpecificQuery(page_id, stepElement.name);
                        const performedQuery = await exportableFunctions[component.type](component, filters, otherParameters, hasButtons, component.id );
                        stepElement.component = performedQuery;
                    }
                    if(element.value) {
                        if(stepElement.type === "textContent") {
                            stepElement.value = element.value;
                        }
                    }
                }
                return stepElement;
            });
            stepObject.elements = await Promise.all(elements);
            return stepObject;
        });
        data.steps = await Promise.all(steps);
        return data;
    } catch(error) {
        console.log(`Wizard - #${query.id}`, error);
    }
}


const search = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const id = query.id;
        const title = query.title || "";
        const isSmall = query.isSmall || false;
        const results = await this.knex.raw(query.sql);
        const data = {
            id,
            type: "search",
            title,
            isSmall: isSmall,
            data: results.rows
        };
        if(query.functions) {
            data.functions = query.functions;
        }
        return data;
    } catch(error) {
        console.log(`Search - #${query.id}`, error);
    }
}


const tabs = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    try {
        const id = query.id;
        const title = query.title || "";
        const tabs = query.tabs.map( async (tab) => {
            const tabID = tab.id;
            const tabTitle = tab.title;
            const tabChildren = tab.children;
            const children = tabChildren.map( async (child) => {
                const query = await getSpecificQuery(page_id, child);
                const performedQuery = await exportableFunctions[query.type](query, filters, otherParameters, hasButtons, page_id );
                return performedQuery;
            });
            return {
                id: tabID,
                title: tabTitle,
                children: await Promise.all(children)
            };
        });
        const data = {
            id,
            type: "tabs",
            title,
            tabs: await Promise.all(tabs)
        };
        if(query.functions) {
            data.functions = query.functions;
        }
        return data;
    } catch(error) {
        console.log(`Tabs - #${query.id}`, error);
    }
}




const thumbCarousel = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const id = query.id;
        const title = query.title || "";
        const queries = query.queries;
        const entityName = otherParameters.queryString.e;
        let sql = queries[entityName].sql;
        const sqlSplitted = findMatches(new RegExp(`\\*{2}(.*?)\\*{2}`, 'gi'), sql);
        const values = {};
        sqlSplitted.forEach( sS => values[sS[1]] = sS[0] );
        Object.entries(values).forEach( value => {
            sql = _.replace(sql, value[1], otherParameters.queryString[value[0]]);
        });
        let results = await this.knex.raw(sql);
        results = results.rows.map( result => {
            if(result.badges && typeof(result.badges) === "string" ) {
                result.badges = [
                    {
                        title: result.badges,
                        color: "primary"
                    }
                ];
            }
            return result;
        });
        const data = {
            id,
            type: "thumbCarousel",
            title,
            data: results
        };
        if(query.functions) {
            data.functions = query.functions;
        }
        return data;
    } catch(error) {
        console.log(`thumbCarousel - #${query.id}`, error);
    }
}


const productDescriptionText = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const id = query.id;
        const queries = query.queries;
        const entityName = otherParameters.queryString.e;
        let sql = queries[entityName].sql;
        const column = queries[entityName].column;

        const sqlSplitted = findMatches(new RegExp(`\\*{2}(.*?)\\*{2}`, 'gi'), sql);
        const values = {};
        sqlSplitted.forEach( sS => values[sS[1]] = sS[0] );
        Object.entries(values).forEach( value => {
            sql = _.replace(sql, value[1], otherParameters.queryString[value[0]]);
        });
        sql = _.replace(sql, /\|column\|/i, column);
        let results = await this.knex.raw(sql);
        results = results.rows;
        const data = {
            id,
            type: "productDescriptionText",
            data: results.map( result => result[column] ).join("<br />")
        };
        if(query.functions) {
            data.functions = query.functions;
        }
        return data;
    } catch(error) {
        console.log(`productDescriptionText - #${query.id}`, error);
    }
}


const iconCard = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const id = query.id;
        let items = query.items;
        items = items.map( async (item) => {

            const returningObject = {
                title: item.title,
                icon: item.icon,
                image: item.image,
                data: 0
            };

            if(item.sql) {
                const sql = item.sql;
                const query = await this.knex.raw(sql);
                returningObject.data = parseInt(query.rows[0][item.alias], 10);
            }

            return returningObject;
        });
        items = await Promise.all(items);
        const data = {
            id,
            type: "iconCard",
            data: items || []
        };
        if(query.functions) {
            data.functions = query.functions;
        }
        return data;
    } catch(error) {
        console.log(`iconCard - #${query.id}`, error);
    }
}


const slidesEditor = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const id = query.id;
        let slides = [];
        const leadCarouselQuery = await this.knex.withSchema(process.env.UI_SCHEMA_NAME)
            .table('page_details')
            .whereRaw('details->>? = ?', [ "id", "lead_carousel" ])
            .first();
        if(leadCarouselQuery) {
            slides = leadCarouselQuery.details.slides.map( (slide) => {
                return {
                    image: slide.image,
                    title: slide.title,
                    subtitle: slide.subtitle,
                    button_content: slide.button.content,
                    button_link: slide.button.href
                };
            })
        }
        const data = {
            id,
            type: "slidesEditor",
            title: query.title,
            action: query.action,
            imageEditorAttributes: query.imageEditorAttributes,
            slides
        };
        return data;
    } catch(error) {
        console.log(`slidesEditor - #${query.id}`, error);
    }
}



const featuresEditor = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const id = query.id;
        let features = [];
        const leadFeaturesQuery = await this.knex.withSchema(process.env.UI_SCHEMA_NAME)
            .table('page_details')
            .whereRaw('details->>? = ?', [ "id", "lead_features" ])
            .first();
        if(leadFeaturesQuery) {
            features = leadFeaturesQuery.details.features.map( (feature) => {
                return {
                    image: feature.image,
                    title: feature.title,
                    subtitle: feature.subtitle
                };
            })
        }
        const data = {
            id,
            type: "featuresEditor",
            title: query.title,
            action: query.action,
            imageEditorAttributes: query.imageEditorAttributes,
            features
        };
        return data;
    } catch(error) {
        console.log(`featuresEditor - #${query.id}`, error);
    }
}


const productSuggestionsEditor = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const id = query.id;
        let selectedOption, existingValues;
        const leadProductSuggestionsQuery = await this.knex.withSchema(process.env.UI_SCHEMA_NAME)
            .table('page_details')
            .whereRaw('details->>? = ?', [ "id", "lead_product_suggestions" ])
            .first();
        if(leadProductSuggestionsQuery) {
            selectedOption = leadProductSuggestionsQuery.details.selectedOption;
            existingValues = leadProductSuggestionsQuery.details.specifiedProducts;
        }
        const productsQuery = query.productsQuery.replace("**CONDITIONS**", "");
        const products = await this.knex.raw(productsQuery);
        if(existingValues) {
            existingValues = leadProductSuggestionsQuery.details.specifiedProducts;
            if(existingValues.length > 0) {
                existingValues = await this.knex.raw(query.productsQuery.replace("**CONDITIONS**", `WHERE P.product_id IN (${existingValues})`));
                existingValues = existingValues.rows;
            }
        }
        const data = {
            id,
            type: "productSuggestionsEditor",
            title: query.title,
            action: query.action,
            options: query.options,
            selectedOption: selectedOption || null,
            products: existingValues,
            defaultOptions: products.rows || []
        };
        return data;
    } catch(error) {
        console.log(`productSuggestionsEditor - #${query.id}`, error);
    }
}


const hotProductsEditor = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const id = query.id;
        let selectedOption, existingValues;
        const leadProductSuggestionsQuery = await this.knex.withSchema(process.env.UI_SCHEMA_NAME)
            .table('page_details')
            .whereRaw('details->>? = ?', [ "id", "lead_hot_products" ])
            .first();
        if(leadProductSuggestionsQuery) {
            selectedOption = leadProductSuggestionsQuery.details.selectedOption;
            existingValues = leadProductSuggestionsQuery.details.specifiedProducts;
        }
        const productsQuery = query.productsQuery.replace("**CONDITIONS**", "");
        const products = await this.knex.raw(productsQuery);
        if(existingValues) {
            existingValues = leadProductSuggestionsQuery.details.specifiedProducts;
            if(existingValues.length > 0) {
                existingValues = await this.knex.raw(query.productsQuery.replace("**CONDITIONS**", `WHERE P.product_id IN (${existingValues})`));
                existingValues = existingValues.rows;
            }
        }
        const data = {
            id,
            type: "hotProductsEditor",
            title: query.title,
            action: query.action,
            options: query.options,
            selectedOption: selectedOption || null,
            products: existingValues,
            defaultOptions: products.rows || []
        };
        return data;
    } catch(error) {
        console.log(`hotProductsEditor - #${query.id}`, error);
    }
}



const topCategoriesEditor = async (query, filters, otherParameters = [], hasButtons, page_id) => {
    this.knex = databaseConnections.baseKnex;
    const databaseConnection = query.databaseConnection;
    if(databaseConnection) {
        this.knex = databaseConnections[databaseConnection];
    }
    try {
        const id = query.id;
        let selectedOption, existingValues;
        const leadProductCategoriesQuery = await this.knex.withSchema(process.env.UI_SCHEMA_NAME)
            .table('page_details')
            .whereRaw('details->>? = ?', [ "id", "lead_products_categories" ])
            .first();
        if(leadProductCategoriesQuery) {
            selectedOption = leadProductCategoriesQuery.details.selectedOption;
            existingValues = leadProductCategoriesQuery.details.specifiedCategories;
        }
        const categoriesQuery = query.categoriesQuery.replace("**CONDITIONS**", "");
        const categories = await this.knex.raw(categoriesQuery);
        if(existingValues) {
            existingValues = leadProductCategoriesQuery.details.specifiedCategories;
            if(existingValues.length > 0) {
                existingValues = await this.knex.raw(query.categoriesQuery.replace("**CONDITIONS**", `WHERE C.category_id IN (${existingValues})`));
                existingValues = existingValues.rows;
            }
        }
        const data = {
            id,
            type: "topCategoriesEditor",
            title: query.title,
            action: query.action,
            options: query.options,
            selectedOption: selectedOption || null,
            categories: existingValues,
            defaultOptions: categories.rows || []
        };
        return data;
    } catch(error) {
        console.log(`topCategoriesEditor - #${query.id}`, error);
    }
}


const exportableFunctions = {
    dataTable,
    ddl,
    chart,
    card,
    iconCard,
    calendar,
    slidesEditor,
    featuresEditor,
    productSuggestionsEditor,
    hotProductsEditor,
    topCategoriesEditor,
    table,
    userCard,
    profileCard,
    productList,
    productCardList,
    wizard,
    search,
    tabs,
    thumbCarousel,
    productDescriptionText
};

module.exports = exportableFunctions;