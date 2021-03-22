const _ = require('lodash');
const { getQueries, getSpecificQuery, paginateCollection, getFilters } = require('./query');


const { Page, PageDetail } = require('../../database/models');
const { pageStatuses, pageDetailStatuses } = require('../../database/enums');

const components = require('./components');

const { PageNotFoundException, PageDetailNotFoundException } = require('../errors');


const layout = () => {
    return async (req, res, next) => {
        try {

            const query = {
                ...req.body,
                ...req.query
            };
            const user = req.user;
            const client_id = query.client_id;
            const page_slug = query.page_slug;
            const queryString = query.queryString;
            const elementType = query.elementType;
            const elementID = query.elementID;
            const userRoles = user.roles.map( role => role.id );
            const page = await Page.query()
                .where('slug', page_slug)
                .where('status', pageStatuses.A)
                .first();
            if(!page) {
                throw new PageNotFoundException(`Sorry, the page you requested doesn't exist.`);
            }
            const details = await PageDetail.query()
                .select('function')
                .where('page_id', page.id)
                .where('status', pageDetailStatuses.A)
                .whereIn('role_id', userRoles)
                .orderBy('priority', 'DESC');

            if(details.length === 0) {
                throw new PageDetailNotFoundException(`Sorry, this page doesn't have any detail.`);
            }

            let filters = await getFilters(page.id, userRoles);
            // console.log('Filters', filters);
            const hasButtons = true; //getbtn($page->id);

            // Component Specific Response
            if(elementType) {

                if(elementType === "modal") {
                    const filteredPairs = query.filters || [];
                    filters = filteredPairs.map( filteredPairsFilter => {
                        const filterObject = filters.find( filter => filter.id === filteredPairsFilter.name );
                        if(!filterObject) {
                            filteredPairsFilter.id = filteredPairsFilter.name;
                        } else {
                            filteredPairsFilter.id = filteredPairsFilter.name;
                            filteredPairsFilter.type = filterObject.type;
                            if(filteredPairsFilter.type === "ddl") {
                                filteredPairsFilter.values = filterObject.values;
                                filteredPairsFilter.placeholder = filterObject.placeholder;
                            }
                            if(filteredPairsFilter.type === "boolean") {
                                filteredPairsFilter.placeholder = filterObject.placeholder;
                            }
                        }
                        return filteredPairsFilter;
                    });
                    const otherParameters = { user };
                    const specificQuery = await getSpecificQuery(page.id, elementID);
                    const performedQuery = await components[specificQuery.type](specificQuery, filters, otherParameters, hasButtons, page.id );

                    return res.status(200).json({
                        components: [ performedQuery ]
                    });
                }

                if(elementType === "dataTable") {
                    const draw = query.draw;
                    const start = query.start;
                    const length = query.length;
                    const search = query.search;
                    const filteredPairs = query.filters || [];
                    filters = filteredPairs.map( filteredPairsFilter => {
                        const filterObject = filters.find( filter => filter.id === filteredPairsFilter.name );
                        if(!filterObject) {
                            filteredPairsFilter.id = filteredPairsFilter.name;
                        } else {
                            filteredPairsFilter.id = filteredPairsFilter.name;
                            filteredPairsFilter.type = filterObject.type;
                            if(filteredPairsFilter.type === "ddl") {
                                filteredPairsFilter.values = filterObject.values;
                                filteredPairsFilter.placeholder = filterObject.placeholder;
                            }
                            if(filteredPairsFilter.type === "boolean") {
                                filteredPairsFilter.placeholder = filterObject.placeholder;
                            }
                        }
                        return filteredPairsFilter;
                    });
                    const otherParameters = {
                        start,
                        length,
                        search: search ? search.value : null,
                        user
                    };
                    const specificQuery = await getSpecificQuery(page.id, elementID);
                    const performedQuery = await components[specificQuery.type](specificQuery, filters, otherParameters, hasButtons, page.id );
                 

                    return res.status(200).json({
                        draw: draw || 1,
                        recordsTotal: performedQuery.data.length,
                        recordsFiltered: performedQuery.total,
                        data: performedQuery.data,
                        rowData: {
                            id: performedQuery.id,
                            columns: performedQuery.columns,
                            buttons: performedQuery.buttons,
                            entityNames: performedQuery.entityNames,
                            legend: performedQuery.legend
                        }
                    });

                }


                if(elementType === "ddl") {
                    const draw = query.draw;
                    const start = query.start;
                    const length = query.length;
                    const search = query.search;
                    const filteredPairs = query.filters || [];
                    filters = filteredPairs.map( filteredPairsFilter => {
                        const filterObject = filters.find( filter => filter.id === filteredPairsFilter.name );
                        if(!filterObject) {
                            filteredPairsFilter.id = filteredPairsFilter.name;
                        } else {
                            filteredPairsFilter.id = filteredPairsFilter.name;
                            filteredPairsFilter.type = filterObject.type;
                            if(filteredPairsFilter.type === "ddl") {
                                filteredPairsFilter.values = filterObject.values;
                                filteredPairsFilter.placeholder = filterObject.placeholder;
                            }
                            if(filteredPairsFilter.type === "boolean") {
                                filteredPairsFilter.placeholder = filterObject.placeholder;
                            }
                        }
                        return filteredPairsFilter;
                    });
                    const otherParameters = {
                        start,
                        length,
                        search: search ? search.value : null,
                        user
                    };

                    const specificQuery = await getSpecificQuery(page.id, elementID, userRoles);
                    const performedQuery = await components[specificQuery.type](specificQuery, filters, otherParameters, hasButtons, page.id );                
                   
                    return res.status(200).json({
                        draw: draw || 1,
                        recordsTotal: performedQuery.data.length,
                        recordsFiltered: performedQuery.total,
                        data: performedQuery.data,
                        rowData: {
                            id: performedQuery.id,
                            columns: performedQuery.columns,
                            buttons: performedQuery.buttons,
                            entityName: performedQuery.entityName,
                            legend: performedQuery.legend
                        }
                    });


                    
                }

                if(elementType === "productList") {
                    const otherParameters = {
                        currentPage: query.currentPage,
                        perPage: query.perPage,
                        filters: query.filters
                    };
                    if(query.data) {
                        otherParameters.data = query.data;
                    }
                    if(queryString) {
                        otherParameters.queryString = queryString;
                    }
                    const specificQuery = await getSpecificQuery(page.id, elementID);
                    const performedQuery = await components[specificQuery.type](specificQuery, filters, otherParameters, hasButtons, page.id );
                    // return performedQuery;

                    return res.status(200).json(performedQuery);



                    // return res.status(200).send(performedQuery);
                }

                if(elementType === "search") {
                    const currentPage = query.currentPage;
                    const specificQuery = await getSpecificQuery(page.id, elementID);
                    const performedQuery = await components[specificQuery.type](specificQuery, filters, [], hasButtons, page.id );
                    return res.status(200).json({
                        ...await paginateCollection(performedQuery.data, 10, currentPage)
                    });
                }

                if(elementType === "directory") {
                    const otherParameters = {};
                    if(queryString) {
                        otherParameters.queryString = queryString;
                    }
                    const specificQuery = await getSpecificQuery(page.id, elementID);
                    const performedQuery = await components[specificQuery.type](specificQuery, filters, otherParameters, hasButtons, page.id );
                    return res.status(200).json(performedQuery);
                    // ...await paginateCollection(performedQuery.data, 10, currentPage)
                }
                
                if(elementType == "filters") {
                    
                    const filteredPairs = query.filters || [];
                    const modifiedFilters = filteredPairs.map( filteredPairsFilter => {
                        const filterObject = filters.find( filter => filter.id === filteredPairsFilter.name );
                        if(!filterObject) {
                            filteredPairsFilter.id = filteredPairsFilter.name;
                        } else {
                            filteredPairsFilter.id = filteredPairsFilter.name;
                            filteredPairsFilter.type = filterObject.type;
                            if(filteredPairsFilter.type === "ddl") {
                                filteredPairsFilter.values = filterObject.values;
                                filteredPairsFilter.placeholder = filterObject.placeholder;
                            }
                            if(filteredPairsFilter.type === "boolean") {
                                filteredPairsFilter.placeholder = filterObject.placeholder;
                            }
                        }
                        return filteredPairsFilter;
                    });

                    filters = filters.map( filter => {
                        const trace = modifiedFilters.find( modifiedFilter => modifiedFilter.id === filter.id );
                        if(!trace) {
                            return filter;
                        } else {
                            return trace;
                        }
                    });
                    let data = {
                        title: page.name,
                        description: page.description,
                        filters
                    };
                    const otherParameters = {
                        queryString,
                        user
                    };
                    const queries = _.uniq(await getQueries(page.id, true, userRoles), 'id');
                    const queryComponents = queries.filter( q => q.type !== "filters" ).map( (query) => {
                        if(!components[query.type]) {
                            throw new Error(`Component function *${query.type}* doesn't exist.`);
                        }
                        return components[query.type](query, filters, otherParameters, hasButtons, page.id );
                    });
                    data.components = await Promise.all(queryComponents);
                    return res.status(200).json({
                        details: data
                    });
                }

            }

            //     // if(elementType === "wizard") {
            //     //     const stepElementName = query.stepElementName;
            //     //     const searchInput = query.searchInput;
            //     //     const specificQuery = await getSpecificQuery(page.id, elementID);
            //     //     // const performedQuery = await components[specificQuery.type](specificQuery, filters, [], hasButtons, page.id );


            //     //     const stepElements = query.steps.map( step => step.elements )
            //     //         .flat(Infinity)
            //     //         .filter( element => {
            //     //             return element.name ? element.name === stepElementName : false;
            //     //         });
            //     // }


            //     // if($elementType == "wizard") {
            //     //     $stepElementName = $request->input('stepElementName');
            //     //     $searchInput = $request->input('searchInput');
            //     //     $query = get_specific_query($page->id, $elementID);
            //  catch(error) {
            // console.log(error);
            //     $stepElements = collect($query["steps"])
            //     //         ->map(function($step) use ($stepElementName) {
            //     //             return collect($step["elements"]);
            //     //         })
            //     //         ->flatten(1)
            //     //         ->filter(function($element) use ($stepElementName) {
            //     //             return isset($element['name']) ? $element['name'] === $stepElementName : false;
            //     //         })
            //     //         ->values()
            //     //         ->first();
            //     //     $sql = $stepElement["sql"];
            //     //     $searchColumn = $stepElement["searchColumn"];
            //     //     $sql .= " WHERE " . $searchColumn . " LIKE '%" . $searchInput . "%'";
            //     //     $results = DB::select($sql);
            //     //     return response()->json([
            //     //         "data" => $results
            //     //     ], 200);
            //     // }




            // }



            // Default Response


            let data = {
                title: page.name,
                description: page.description,
                filters,
                components: []
            };
            if(page.allowed_from) {
                const allowedFrom = page.allowed_from.split(",")
                    .map( allowedFromSlug => allowedFromSlug.trim() )
                    .filter( allowedFromSlug => allowedFromSlug.length > 0 );
                data.allowedFrom = allowedFrom;
            }
            const queries = _.uniq(await getQueries(page.id, true, userRoles), 'id');
            const otherParameters = {
                queryString,
                user
            };
            const queryComponents = queries.filter( q => q.type !== "filters" ).map( (query) => {
                if(!components[query.type]) {
                    throw new Error(`Component function *${query.type}* doesn't exist.`);
                }
                return components[query.type](query, filters, otherParameters, hasButtons, page.id );
            });
            data.components = await Promise.all(queryComponents);
            return res.status(200).json({
                details: data
            });
        } catch(error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = {
    layout
};