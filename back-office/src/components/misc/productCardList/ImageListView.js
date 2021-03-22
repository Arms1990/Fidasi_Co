import React from "react";
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

const ImageListView = ({id, product, isSelect, collect, onCheckItem, toggleModal }) => {
  return (
    <Colxx sm="6" lg="4" xl="3" className="mb-3" key={product.id}>
      <ContextMenuTrigger id="menu_id" data={product.id} collect={collect}>
        <Card
          onClick={event => onCheckItem(event, product.id)}
          className={classnames({
            active: isSelect
          })}
        >
          <div className="position-relative">
            <CardImg top alt={product.title} src={product.img} />
            {
              product.price ? <Badge
              color={'primary'}
              pill
              className="position-absolute badge-top-left"
            >
              ${product.price}
            </Badge> : null
            }
            <Badge
              color={product.statusColor}
              pill
              className="position-absolute badge-top-left"
            >
              {product.status}
            </Badge>
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
                <NavLink to={`?p=${product.id}`} onClick={ (e) => toggleModal(e, id) }>
                  <CardSubtitle className="mb-2 truncate">{product.title}</CardSubtitle>
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
