const _ = require('lodash');
const { getQueries, getSpecificQuery, paginateCollection, getPageFromElement } = require('./query');

const { PageNotFoundException, PageDetailNotFoundException } = require('../../errors');

const { UIPage, UIPageDetail } = require('../../../database/models');
const { pageStatuses, pageDetailStatuses } = require('../../../database/enums');

const components = require('./components');


const uiLayout = () => {

    return async (req, res, next) => {
        try {
            const query = {
                ...req.body,
                ...req.query
            };
            const user = req.user;
            const page_slug = query.slug;

            const otherParameters = {
                user,
                ...query
            };

            const elementType = query.elementType;
            const elementID = query.elementID;


            const page = await UIPage.query()
                .where('slug', page_slug)
                .where('status', pageStatuses.A)
                .first();
            if(!page) {
                throw new PageNotFoundException(`Sorry, the page you requested doesn't exist.`);
            }
            const details = await UIPageDetail.query()
                .select('function')
                .where('page_id', page.id)
                .where('status', pageDetailStatuses.A)
                .orderBy('priority');
            if(details.length === 0) {
                throw new PageDetailNotFoundException(`Sorry, this page doesn't have any detail.`);
            }


            let data = [];

            if(elementType && elementID) {
                const page_id = await getPageFromElement(elementID);
                if(!page_id) {
                    throw new Error(`Specified element does not exist for ${page.slug}.`);
                }

                otherParameters.componentIsSingle = true;

                const query = await getSpecificQuery(page.id, elementID);
                if(!query) {
                    throw new Error(`Specified element does not exist in the system.`);
                }

                data = await components[elementType](query, otherParameters, page.id);
                
                return res.status(200).json(data);
            }


            //Default Response
            const queries = _.uniq(await getQueries(page.id), 'id');
        
            const queryComponents = queries.map( (query) => {
                if(!components[query.name]) {
                    throw new Error(`Component function *${query.name}* doesn't exist.`);
                }
                return components[query.name](query.details, otherParameters, page.id);
            });
            data = await Promise.all(queryComponents);
            return res.status(200).json({
                details: data
            });
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = {
    uiLayout
}




