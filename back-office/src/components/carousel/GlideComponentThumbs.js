import React from "react";
import PropTypes from 'prop-types';
import Glide from '@glidejs/glide'
import { getDirection } from "../../helpers/Utils";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

let resizeTimeOut = -1;
let mountTimeOut = -1;

export default class GlideComponentThumbs extends React.Component {
  static propTypes = {
    settingsImages: PropTypes.shape({
      type: PropTypes.string,
      startAt: PropTypes.number,
      perView: PropTypes.number,
      focusAt: PropTypes.number,
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
      throttle: PropTypes.number,
      data: PropTypes.array,
    }),
    settingsThumbs: PropTypes.shape({
      type: PropTypes.string,
      startAt: PropTypes.number,
      perView: PropTypes.number,
      focusAt: PropTypes.number,
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
      throttle: PropTypes.number,
      data: PropTypes.array,
    }),
    id: PropTypes.string,
    className: PropTypes.string
  };

  settingsThumbs =  {
    bound: true,
    rewind: false,
    focusAt: 0,
    startAt: 0,
    gap: 10,
    perView: 5,
    data: this.props.data,
    breakpoints: {
      576: {
        perView: 4
      },
      420: {
        perView: 3
      }
    }
  }

  settingsImages = {
    bound: true,
    rewind: false,
    focusAt: 0,
    startAt: 0,
    gap: 5,
    perView: 1,
    data: this.props.data,
  }

  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.thumbsResize = this.thumbsResize.bind(this);
    this.onThumbClick = this.onThumbClick.bind(this);
    this.imagesSwipeEnd = this.imagesSwipeEnd.bind(this);
    this.renderDots = this.renderDots.bind(this);
    this.updateThumbBreakpoints = this.updateThumbBreakpoints.bind(this);
    this.state = {
      total: this.settingsImages.data.length,
      activeIndex: 0,
      thumbsPerView: Math.min(this.settingsThumbs.perView, this.settingsImages.data.length),
      renderArrows: true
    };
    this.updateThumbBreakpoints();
  }

  updateThumbBreakpoints() {
    let thumbBreakpoints = this.settingsThumbs.breakpoints;
    let newBreakpoints = {};
    for (var prop in thumbBreakpoints) {
      newBreakpoints[prop] = { "perView": Math.min(thumbBreakpoints[prop]["perView"], this.state.total) }
    }
    this.settingsThumbs.breakpoints = newBreakpoints;
  }

  onThumbClick(index) {
    this.setState({activeIndex: index});
    this.glideCarouselImages.go("=" + index);
  }

  thumbsResize () {
    let perView = Math.min(this.settingsThumbs.perView, this.settingsImages.data.length);
    this.setState({thumbsPerView: perView});
    if (this.state.total <= perView ) {
      this.setState({renderArrows: false});
    }
  }

  imagesSwipeEnd () {
    let gap = this.glideCarouselThumbs.index + this.state.thumbsPerView;
    this.setState({activeIndex: this.glideCarouselImages.index});
    if (this.state.activeIndex >= gap) {
      this.glideCarouselThumbs.go(">");
    }
    if (this.state.activeIndex < this.glideCarouselThumbs.index) {
      this.glideCarouselThumbs.go("<");
    }
  }

  componentDidMount() {
    this.glideCarouselImages = new Glide(this.carouselImages, { ...this.settingsImages, direction: getDirection().direction });
    this.glideCarouselImages.mount();

    this.glideCarouselThumbs = new Glide(this.carouselThumbs, { ...this.settingsThumbs, direction: getDirection().direction });
    this.glideCarouselThumbs.mount();

    this.glideCarouselThumbs.on("resize", this.thumbsResize);
    this.glideCarouselImages.on("swipe.end", this.imagesSwipeEnd);
    
    mountTimeOut = setTimeout(() => {
      var event = document.createEvent("HTMLEvents");
      event.initEvent("resize", false, false);
      window.dispatchEvent(event);
      this.glideCarouselImages.on("resize", this.onResize);
    }, 500);
  }

  componentWillUnmount() {
    clearTimeout(resizeTimeOut);
    clearTimeout(mountTimeOut);
    this.glideCarouselImages.destroy();
    this.glideCarouselThumbs.destroy();
  }

  onResize() {
    clearTimeout(resizeTimeOut);
    resizeTimeOut = setTimeout(() => {
      this.glideCarouselImages.update();
      this.glideCarouselThumbs.update();
      resizeTimeOut = -1;
    }, 500);
  }

  renderDots() {
    let dots = [];
    for (let i = 0; i < this.state.total; i++) {
      dots.push(
        <button className="glide__bullet slider-dot" key={i} data-glide-dir={"=" + i}></button>
      );
    }
    return dots;
  }

  render() {
    const { transparent } = this.props;
    return (
      <div className={transparent ? "p-5 bg-white rounded glide" : "p-5"}>
        <div className="glide details" ref={node => this.carouselImages = node}>
          <div data-glide-el="track" className="glide__track">
            <div className="glide__slides">
              {
                this.settingsImages.data.map( (item, index) => {
                  return (
                    <div key={index}>
                      <div className="glide__slide text-center">
                        <img alt="detail" src={item.img || 'https://gogo-react.coloredstrategies.com/assets/img/card-thumb-3.jpg'}
                          className="responsive border-0 rounded-lg img-fluid mb-3" />
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>

        <div className="glide thumbs" ref={node => this.carouselThumbs = node}>
          <div data-glide-el="track" className="glide__track">
            <div className="glide__slides">
              {
                this.settingsThumbs.data.map( (item, index) => {
                  return (
                    <div className={index === this.state.activeIndex ? "glide__slide active" : "glide__slide"} key={index} onClick={() => {this.onThumbClick(index)}}>
                      <img alt="detail" src={item.img || 'https://gogo-react.coloredstrategies.com/assets/img/card-thumb-3.jpg'}
                        className="responsive rounded-lg img-fluid" />
                    </div>
                  );
                })
              }
            </div>
          </div>
          {this.state.renderArrows &&  (
            <div className="glide__arrows" data-glide-el="controls">
              <button className="glide__arrow glide__arrow--left" data-glide-dir="<"><i
              className="simple-icon-arrow-left"></i></button>
              <button className="glide__arrow glide__arrow--right" data-glide-dir=">"><i
              className="simple-icon-arrow-right"></i></button>
            </div>
          )}
        </div>
      </div>
    )
  }
}
