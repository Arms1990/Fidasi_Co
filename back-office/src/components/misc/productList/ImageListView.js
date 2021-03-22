import React, { useState } from "react";
import {
  Row,
  Card,
  CardBody,
  CardSubtitle,
  CardImg,
  CardText,
  CustomInput,
  Badge
} from "reactstrap";
import classnames from "classnames";
import { ContextMenuTrigger } from "react-contextmenu";
import { Colxx } from "../../common/CustomBootstrap";
import { NavLink } from "react-router-dom";

const ImageListView = ({ detailViewSlug, entityName, product, isSelect, collect, onCheckItem }) => {


  const [productImage, setProductImage] = useState(product.img);

  const image = new Image();
  image.src = product.img;

  image.onload = (e) => {
    setProductImage(product.img);
  }

  image.onerror = (e) => {
    setProductImage('/assets/img/missing.png');
  }

  const renderDefaultImage = () => {
    return (
      <div className="text-center py-5">
        <div className="loading position-static" />
      </div>
    );
  }


  const renderProductImage = (product) => {
    return (
      <CardImg className="img-fluid" top alt={product.title} src={productImage} />
    );
  }

  return (
    <Colxx sm="6" lg="4" xl="3" className="mb-3" key={product.id}>
      <ContextMenuTrigger id="menu_id" data={product.id} collect={collect}>
        <Card
          onClick={ event => {
            const dataName = event.target.dataset.name;
            if(!dataName) {
              return onCheckItem(event, product.id);
            }
          }}
          className={classnames({
            active: isSelect
          })}
        >
          <div className="position-relative">



            <div className="position-absolute product-badges d-flex flex-column">
            {
            product.price ? <Badge
            color={'primary'}
            pill
            className="badge-top-left"
          >
            € {product.price}
          </Badge> : null
          }
            
            <Badge
              color={product.statusColor}
              pill
              className="badge-top-left my-1"
            >
              {product.status}
            </Badge>
            </div>
            { !productImage ? renderDefaultImage() : renderProductImage(product) }

   
          </div>
          <CardBody>
            <Row>
              <Colxx xxs="2">
                <CustomInput
                  className="item-check mb-0"
                  type="checkbox"
                  id={`check_${product.id}`}
                  checked={isSelect}
                  onChange={() => {}}
                  label=""/>
              </Colxx>
              <Colxx xxs="10" className="mb-3">
                <NavLink to={`${detailViewSlug}?p=${product.id}&e=${entityName}`}>
                  <CardSubtitle data-name="details-link" className="mb-2 text-truncate">{product.title}</CardSubtitle>
                </NavLink>
                <CardText className="text-muted text-small mb-0 font-weight-light">
                  {product.date}
                </CardText>
              </Colxx>
            </Row>
          </CardBody>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ImageListView);
