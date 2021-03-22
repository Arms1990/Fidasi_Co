import React from "react";
import PropTypes from 'prop-types';
import Glide from '@glidejs/glide'
import { getDirection } from "../../helpers/Utils";
import "@glidejs/glide/dist/css/glide.core.min.css";
import { Card, CardBody } from "reactstrap";

let resizeTimeOut = -1;
let mountTimeOut = -1;

const NoControlCarouselItem = ({ title, img, date, badges }) => {
  return (
    <div className="glide-item">
      <Card>
        <div className="position-relative">
          <img className="card-img-top" src={img || 'https://gogo-react.coloredstrategies.com/assets/img/card-thumb-3.jpg'} alt={title} />
          {badges &&
            badges.map((b, index) => {
              return (
                <span
                  key={index}
                  className={`badge badge-pill badge-${
                    b.color
                    } position-absolute ${
                    index === 0
                      ? "badge-top-left"
                      : "badge-top-left-" + (index + 1)
                    }`}
                >
                  {b.title}
                </span>
              );
            })}
        </div>
        <CardBody>
          <h6 className="mb-4">{title}</h6>
          <footer>
            <p className="text-muted text-small mb-0 font-weight-light">
              {date}
            </p>
          </footer>
        </CardBody>
      </Card>
    </div>
  );
};

export default class GlideComponent extends React.Component {
  static propTypes = {
    settings: PropTypes.shape({
      type: PropTypes.string,
      startAt: PropTypes.number,
      perView: PropTypes.number,
      focusAt: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
      gap: PropTypes.number,
      autoplay: PropTypes.bool,
      hoverpause: PropTypes.bool,
      keyboard: PropTypes.bool,
      bound: PropTypes.bool,
      swipeThreshold: PropTypes.oneOf([PropTypes.number, PropTypes.bool]),
      dragThreshold: PropTypes.oneOf([PropTypes.number, PropTypes.bool]),
      perTouch: PropTypes.oneOf([PropTypes.number, PropTypes.bool]),
      touchRatio: PropTypes.number,
      touchAngle: PropTypes.number,
      animationDuration: PropTypes.number,
      rewind: PropTypes.bool,
      rewindDuration: PropTypes.number,
      animationTimingFunc: PropTypes.string,
      direction: PropTypes.string,
      peek: PropTypes.object,
      breakpoints: PropTypes.object,
      classes: PropTypes.object,
      throttle: PropTypes.number
    }),
    id: PropTypes.string,
    className: PropTypes.string
  };

  settings = {
    gap: 5,
    perView: 4,
    type: "carousel",
    breakpoints: {
      480: { perView: 1 },
      800: { perView: 2 },
      1200: { perView: 3 }
    },
    hideNav: false
  };

  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.renderDots = this.renderDots.bind(this);
    this.state = {
      total: React.Children.count(this.props.children)
    };
  }

  componentDidMount() {
    this.glideCarousel = new Glide(this.carousel, {...this.settings, direction: getDirection().direction});
    this.glideCarousel.mount();
    mountTimeOut = setTimeout(() => {
      var event = document.createEvent("HTMLEvents");
      event.initEvent("resize", false, false);
      window.dispatchEvent(event);
      this.glideCarousel.on("resize", this.onResize);
    }, 500);
  }

  componentWillUnmount() {
    clearTimeout(resizeTimeOut);
    clearTimeout(mountTimeOut);
    this.glideCarousel.destroy();
  }

  onResize() {
    clearTimeout(resizeTimeOut);
    resizeTimeOut = setTimeout(() => {
      this.glideCarousel.update();
      resizeTimeOut = -1;
    }, 500);
  }

  renderDots() {
    let dots = [];
    for (let i = 0; i < this.state.total; i++) {
      dots.push(
        <button className="glide__bullet slider-dot" key={i} data-glide-dir={"="+i}></button>
      );
    }
    return dots;
  }

  render() {

    const { data } = this.props.component;

    return (
      <div>
        <div className="glide" ref={node => this.carousel = node}>
          <div data-glide-el="track" className="glide__track">
            <div className="glide__slides">
              {data.map(item => {
                return (
                  <div key={item.id}>
                    <NoControlCarouselItem {...item} />
                  </div>
                );
              })}
            </div>
          </div>
          {
            !this.settings.hideNav &&  (
              <div className="glide__arrows slider-nav" data-glide-el="controls">
              <button className="glide__arrow glide__arrow--left left-arrow btn btn-link" data-glide-dir="<">
                <i className="simple-icon-arrow-left"></i>
              </button>
  
              <div className="glide__bullets slider-dot-container" data-glide-el="controls[nav]">
                {this.renderDots()}
              </div>
              
              <button className="glide__arrow glide__arrow--right right-arrow btn btn-link" data-glide-dir=">">
                <i className="simple-icon-arrow-right"></i>
              </button>
            </div>
            )
          }
        </div>
      </div>
    )
  }
}
