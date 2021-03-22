const _ = require('lodash');
const { PageDetail } = require('../../database/models');
const { pageDetailStatuses } = require('../../database/enums');

const getQueries = async (page_id, filterRenderable = true, userRoles = false) => {
    let queries = [];
    let details = PageDetail.query()
        .select('details')
        .where('page_id', page_id)
        .where('status', pageDetailStatuses.A)
        //AC add priority
        .orderBy('priority', 'DESC');

    if(userRoles) {
        details.whereIn('role_id', userRoles);
    }

    details = await details;

    const detailsFiltered = details.map( detail => detail.details ).filter( detail => _.size(detail) > 0 );
    detailsFiltered.forEach( detailFiltered => {
        if(Array.isArray(detailFiltered)) {
            detailFiltered.forEach( detailFilteredFurther => queries.push(detailFilteredFurther) );
        } else {
            queries.push(detailFiltered);
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

const getObject = (array, key, value) => {
    let o;
    array.some(function iter(a) {
        if (a[key] === value) {
            o = a;
            return true;
        }
        return Array.isArray(a.children) && a.children.some(iter);
    });
    return o;
}

const getSpecificQuery = async (pageID, elementID, userRoles = false) => {
    const queries = await getQueries(pageID, false, userRoles);
    const query = getObject(queries, 'id', elementID);
    return query;
}


const getPageFromElement = async (elementID) => {
    let page_id = null;
    let details = await PageDetail.query()
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

const paginateCollection = async (items, pageSize, page) => {
    let pg = parseInt(page, 10) || 1,
        pgSize = parseInt(pageSize, 10) || 12,
        offset = (pg - 1) * pgSize,
        pagedItems = _.drop(items, offset).slice(0, pgSize);
        
    return {
        page: pg,
        pageSize: pgSize,
        total: items.length,
        total_pages: Math.ceil(items.length / pgSize),
        data: pagedItems
    };
}


function getPageList(totalPages, page, maxLength) {
    if (maxLength < 5) throw "maxLength must be at least 5";

    function range(start, end) {
        return Array.from(Array(end - start + 1), (_, i) => i + start); 
    }

    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth*2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth*2 - 2) >> 1;
    if (totalPages <= maxLength) {
        // no breaks in list
        return range(1, totalPages);
    }
    if (page <= maxLength - sideWidth - 1 - rightWidth) {
        // no break on left of page
        return range(1, maxLength - sideWidth - 1)
            .concat(0, range(totalPages - sideWidth + 1, totalPages));
    }
    if (page >= totalPages - sideWidth - 1 - rightWidth) {
        // no break on right of page
        return range(1, sideWidth)
            .concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }
    // Breaks on both sides
    return range(1, sideWidth)
        .concat(0, range(page - leftWidth, page + rightWidth),
                0, range(totalPages - sideWidth + 1, totalPages));
}

function findMatches(regex, str, matches = []) {
    const res = regex.exec(str)
    res && matches.push(res) && findMatches(regex, str, matches)
    return matches
}

async function getFilters(pageID, userRoles) {
    const queries = await getQueries(pageID, false, userRoles);
    const filtersQuery = queries.find( query => query.type === "filters" );
    if(!filtersQuery || !filtersQuery.filters) {
        return [];
    }
    const filters = filtersQuery.filters.map( filter => {
        const { columns, sql, id, type, placeholder, value } = filter;
        if(type === "ddl") {
            const data = {
                id,
                type,
                placeholder,
                value
            };

            // const columnsIdentifiers = columns.map( column => column.identifier );
            return data;
        }
        return filter;
    });
    return filters;
    // $page = collect(json_decode(file_get_contents(resource_path('views/layouts/queries.json')), true)['queries'])->firstWhere('id', $page_id);
    // if(isset($page["filters"])) {
    //     $filters = collect($page["filters"])->map(function($filter) {
    //         if($filter["type"] == "ddl") {
    
    //             $data = [
    //                 "id" => $filter["id"],
    //                 "type" => $filter["type"],
    //                 "placeholder" => $filter["placeholder"],
    //                 "value" => $filter["value"]
    //             ];
    
    //             $sql = $filter["sql"];
    //             $columns = collect($filter["columns"]);
    //             $columns_identifiers = $columns->pluck('identifier')->all();
    
    //             $sql = str_replace('|columns|', implode(",", $columns_identifiers), $sql);
    
    
    //             preg_match_all('/@(.+?)@/', $sql, $matches);
    //             foreach($matches[0] as $match) {
    //                 if(strpos($match, $filter["id"]) !== false) {
    //                     $sql = preg_replace('/' . $match . '/', $filter["value"], $sql);
    //                 }
    //             }
    
    //             $results = DB::select($sql);
    //             foreach($results as &$result) {
    //                 $result = (array) $result;
    //             }
    //             $data["values"] = $results;
    //             return $data;
    
    //         }
    //         return $filter;
    //     });
    
    //     return $filters;
    // }
    // return [];
}

module.exports = {
    getQueries,
    getSpecificQuery,
    getPageFromElement,
    paginateCollection,
    getPageList,
    findMatches,
    getFilters
}