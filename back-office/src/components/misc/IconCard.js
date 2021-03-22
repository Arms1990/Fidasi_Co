import React from "react";
import { Card, CardBody } from "reactstrap";
import ThumbnailImage from "../cards/ThumbnailImage";
import classnames from "classnames";

const IconCard = ({ component }) => {
  
  
  const { data } = component;

  const modifiedData = data.map( (dataItem, index) => {
    return (
      <div className="col" key={index}>
        <Card>
          <CardBody className="text-center px-0">
            {
            dataItem.icon ?
            <i className={classnames(dataItem.icon, 'text-primary', 'h1', 'mb-0', 'px-3', 'align-self-center')} />
            :
            <ThumbnailImage small src={dataItem.image || 'https://gogo-react.coloredstrategies.com/assets/img/profile-pic-l-10.jpg'} alt={dataItem.title} className="m-4" />
            }
            <p className="card-text font-weight-semibold my-2">{dataItem.title}</p>
            <p className="lead text-center mb-0">{dataItem.data}</p>
          </CardBody>
        </Card>
      </div>
    );
  });

  return (
    <div className={classnames(`row`)}>
      {modifiedData}
    </div>
  );
};

export default IconCard;