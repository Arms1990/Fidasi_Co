import React from 'react';
import { Card, CardBody } from 'reactstrap';

const productListPriceCalculator = ({ products }) => {
    let totalPrice = products.reduce( (accumulator, current) => accumulator + parseInt(current.price, 10), 0 );
    return (
        <div className="col-sm-6 col-lg-4 col-xl-3 mt-1 mb-3">
            <Card className="">
                <CardBody className="text-center">
                <i className="h1 text-primary iconsminds-shopping-cart" />
                <p className="h3 font-weight-light card-text mb-3">Total Price</p>
                <p className="lead text-primary text-center">${totalPrice}</p>
                </CardBody>
            </Card>
        </div>
    );
}


const exampleRedirect = () => {
    //some calculations here
    //let's say an extrnal web service called
    //based on that we redirect
    return window.location = '/app/profilo';
}

export default {
    productListPriceCalculator,
    exampleRedirect
}