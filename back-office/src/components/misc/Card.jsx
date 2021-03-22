import React from 'react';

import {
    AreaChart,
    LineChart,
    BarChart,
    PieChart,
    IconCard,
    DoughnutChart,
    Table,
    ProductCardList,
    ProductList,
    UserCardGroup,
    ProfileCard,
    Calendar,
    ThumbsCarousel,
    Search,
    Tabs,
    ProductDescriptionText
} from './index';
import Validation from './wizard/Validation';
import dynamicFunctions from './functions';

class Card extends React.Component {


    componentDidMount() {
        this.drawCard();
    }    

    drawCard() {
        // let { slug, token, user, baseURL, clientID, clientSecret, component, filters } = this.props;
        // user = (typeof(user) === "string") ? JSON.parse(user) : user;
    }

    renderFunctions() {
        let { component: { functions } } = this.props;
        
        if(functions) {
            functions = functions.map( functionName => {
                if(functionName in dynamicFunctions) {
                    return dynamicFunctions[functionName]();
                }
                return null;
            }).filter( functionName => functionName !== null );
        } else {
            functions = [];
        }
        return functions;
    }


    render() {
        const { component: { children, title, description, fullWidth, transparent, image } } = this.props;

        const components = children.map( (child, index) => {
            const { type } = child;
            if(type === "chart") {
                const { kind } = child;
                if(kind === "pie") {
                    return (
                        <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5")) } key={index}>
                            <PieChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={child} />
                        </div>
                    );
                }
    
                if(kind === "bar") {
                    return (
                        <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5")) } key={index}>
                            <BarChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={child} />
                        </div>
                    );
                }
    
                if(kind === "area") {
                    return (
                        <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5")) } key={index}>
                            <AreaChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={child} />
                        </div>
                    );
                }

                if(kind === "line") {
                    return (
                        <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5")) } key={index}>
                            <LineChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={child} />
                        </div>
                    );
                }

                if(kind === "doughnut") {
                    return (
                        <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5")) } key={index}>
                            <DoughnutChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={child} />
                        </div>
                    );
                }
            }

            if(type === "calendar") {
                return (
                    <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5")) } key={index}>
                        <Calendar component={child} />
                    </div>
                );
            }

            if(type === "table") {
                return (
                    <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5")) } key={index}>
                        <Table component={child} />
                    </div>
                );
            }

            if(type === "card") {
                return (
                    <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-7" : "col-md-7")) } key={index}>
                        <Card {...this.props} component={child} />
                    </div>
                );
              }

              
		  if(type === "productDescriptionText") {
			return (
                <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5")) } key={index}>
                    <ProductDescriptionText {...this.props} component={child} />
                </div>
			);
          }
          
          if(type === "iconCard") {
			return (
                <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-7" : "col-md-7")) } key={index}>
                    <IconCard {...this.props} component={child} />
                </div>
			);
		  }
    
              if(type === "wizard") {
                return (
                    <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5")) } key={index}>
                        <Validation {...this.props} component={child} />
                    </div>
                );
              }
    
              if(type === "productCardList") {
                return (
                    <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5")) } key={index}>
                        <ProductCardList inCard={true} {...this.props} component={child} />
                    </div>
                );
              }
    
              if(type === "productList") {
                return (
                    <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5")) } key={index}>
                        <ProductList inCard={true} {...this.props} dynamicComponent={child} />
                    </div>
                );
              }
    
              if(type === "userCard") {
                return (
                    <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5")) } key={index}>
                        <UserCardGroup inCard={true} {...this.props} component={child} />
                    </div>
                );
              }
    
              if(type === "profileCard") {
                return (
                    <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5")) } key={index}>
                        <ProfileCard {...this.props} component={child} />
                    </div>
                );
              }
              
              if(type === "thumbCarousel") {
                const data = child.data.map( dataItem => ({ id: dataItem.id, img: dataItem.img }) );
                  return (
                    <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5")) } key={index}>
                        <ThumbsCarousel {...this.props} data={data} transparent={transparent} component={child} />
                    </div>
                );
            }

            if(type === "search") {
                return (
                    <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5")) } key={index}>
                        <Search {...this.props} component={child} />
                    </div>
                );
          }

          
		if(type === "tabs") {
			return (
                <div className={ fullWidth ? "w-100" : (children.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5")) } key={index}>
                    <Tabs {...this.props} component={child} />
                </div>
			);
	  }
  
  


            return null;
        });

        if(transparent) {
            return (
                <div className="card bg-transparent shadow-none my-0">
                    <div className="card-body py-0">
                        <div className="row align-items-stretch justify-content-center">
                            { components }
                        </div>
                        {/* <div className="row justify-content-end mt-5 mx-5">
                            { this.renderFunctions() }
                        </div> */}
                    </div>
                </div>
            );
        }

        return (
            <div className="card rounded-lg my-5">
                <div className="card-body">
                    <div className="card-title text-muted mb-0">
                        <img className="img-fluid list-thumbnail small mr-3" src={image} alt={title} />
                        <span>{title ? title.charAt(0).toUpperCase() + title.slice(1) : null}</span>
                        { description ? <div className="d-inline"><span> &mdash; </span><span className="opacity-50">{description ? description.charAt(0).toUpperCase() + description.slice(1) : null}</span></div> : null }
                    </div>
                    {
                    fullWidth
                    ?
                    <div>
                        { components }
                    </div>
                    :
                    <div className="row align-items-stretch justify-content-center">
                        { components }
                    </div>
                    }
                    {/* <div className="row justify-content-end mt-5 mx-5">
                        { this.renderFunctions() }
                    </div>                   */}
                </div>
            </div>
        );
      }
  
  

}


export default Card;