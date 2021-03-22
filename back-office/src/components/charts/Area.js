import React from "react";
import ChartComponent, { Chart } from "react-chartjs-2";
import moment from 'moment';
import classNames from 'classnames';
import { areaChartOptions } from "./config";



import { Modal, ModalBody } from 'reactstrap';
import {
  AreaChart,
  LineChart,
  BarChart,
  PieChart,
  DoughnutChart,
  Table,
  Card,
  UserCardGroup,
  ProductCardList,
  ProductList,
  ProfileCard,
  Calendar,
  ThumbsCarousel,
  Search,
  Tabs
} from '../misc/index';
import Validation from '../misc/wizard/Validation';



export default class Area extends React.Component {

  level = 0

  
  
  state = {
    modalOpen: false,
    elements: []    
  }

  colors = [
    {
      "backgroundColor": "rgba(136, 10, 31, 0.1)",
      "borderColor": "rgb(136, 10, 31)",
    },
    {
      backgroundColor: "rgb(69, 86, 172, 0.1)",
      borderColor: "rgb(69, 86, 172)"
    }
  ];

  
  toggle() {
    const { modalOpen } = this.state;
    const { elements } = this.props.component;
    if(Array.isArray(elements)) {
        return this.setState({
            modalOpen: !modalOpen,
            elements
        });
    }
}


renderElements() {

  const { elements } = this.state;
  const transparent = false;

  const components = elements.map( (element, index) => {
      const { type } = element;
      if(type === "chart") {
          const { kind } = element;
          if(kind === "pie") {
              return (
                  <div className={ elements.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5") } key={index}>
                      <PieChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={element} />
                  </div>
              );
          }

          if(kind === "bar") {
              return (
                  <div className={ elements.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5") } key={index}>
                      <BarChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={element} />
                  </div>
              );
          }

          if(kind === "area") {
              return (
                  <div className={ elements.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5") } key={index}>
                      <AreaChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={element} />
                  </div>
              );
          }

          if(kind === "line") {
              return (
                  <div className={ elements.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5") } key={index}>
                      <LineChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={element} />
                  </div>
              );
          }

          if(kind === "doughnut") {
              return (
                  <div className={ elements.length === 1 ? "col" : (index === 0 ? "col-md-7" : "col-md-5") } key={index}>
                      <DoughnutChart className={!transparent ? "shadow-none" : null} shadow={transparent} component={element} />
                  </div>
              );
          }
      }

      if(type === "calendar") {
          return (
              <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                  <Calendar component={element} />
              </div>
          );
      }

      if(type === "table") {
          return (
              <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                  <Table component={element} />
              </div>
          );
      }

      if(type === "card") {
          return (
              <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                  <Card {...this.props} component={element} />
              </div>
          );
        }

        if(type === "wizard") {
          return (
              <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                  <Validation {...this.props} component={element} />
              </div>
          );
        }

        if(type === "productCardList") {
          return (
              <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                  <ProductCardList inCard={true} {...this.props} component={element} />
              </div>
          );
        }

        if(type === "productList") {
          return (
              <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                  <ProductList inCard={true} {...this.props} dynamicComponent={element} />
              </div>
          );
        }

        if(type === "userCard") {
          return (
              <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                  <UserCardGroup inCard={true} {...this.props} component={element} />
              </div>
          );
        }

        if(type === "profileCard") {
          return (
              <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                  <ProfileCard {...this.props} component={element} />
              </div>
          );
        }
        
        if(type === "thumbCarousel") {
          const data = element.data.map( dataItem => ({ id: dataItem.id, img: dataItem.img }) );
            return (
              <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                  <ThumbsCarousel {...this.props} data={data} component={element} />
              </div>
          );
      }

      if(type === "search") {
          return (
              <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                  <Search {...this.props} component={element} />
              </div>
          );
      }

      
      if(type === "tabs") {
          return (
              <div className={ elements.length === 1 ? "col" : (index === 1 ? "col-md-5" : "col-md-5") } key={index}>
                  <Tabs {...this.props} component={element} />
              </div>
          );
      }

      return null;
  });

  return components;
}

  constructor(props) {
    super(props);
    this.chart_instance = React.createRef();
    if (this.props.shadow) {
      Chart.defaults.lineWithShadow = Chart.defaults.line;
      Chart.controllers.lineWithShadow = Chart.controllers.line.extend({
        draw: function(ease) {
          Chart.controllers.line.prototype.draw.call(this, ease);
          var ctx = this.chart.ctx;
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.15)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 10;
          ctx.responsive = true;
          ctx.stroke();
          Chart.controllers.line.prototype.draw.apply(this, arguments);
          ctx.restore();
        }
      });
    }
  }


  handleClick = (event, originalData) => {
    const { level } = this;
    if(level === 0) {
      if(event[0]) {
        this.level = 1;
        event = event[0];
        let dataset = originalData[event._datasetIndex];
        let chartDataset = this.chart_instance.current.chartInstance.data.datasets[event._datasetIndex];
        let data = dataset.data;
        if(Array.isArray(data)) {
          let labels = data.map( (dataItem) => moment(dataItem[dataset.xColumn]).format(dataItem.timeIdentifier === "week" ? "dddd" : "MMM YYYY") );
          data = data.map( dataItem => dataItem[dataset.yColumn] );
          this.chart_instance.current.chartInstance.data.labels = labels;
          this.chart_instance.current.chartInstance.data.datasets = [
            {
              ...chartDataset,
              data: data
            }
          ];
          this.chart_instance.current.chartInstance.update({
              duration: 800,
              lazy: true,
              easing: 'easeOutBounce'
          });
        }
      }
    } else {
      this.level = 0;
      let { component: { data } } = this.props;
      let modifiedData = {
        labels: [ ...new Set(data.map( dataItem => dataItem.data.map(realDataItem => moment(realDataItem[dataItem.xColumn]).format(dataItem.timeIdentifier === "week" ? "dddd" : "MMM YYYY")) ).flat(2)) ],
        datasets: data.map( (dataItem, colorIndex) => {
            return {
              backgroundColor: this.colors[colorIndex].backgroundColor,
              borderColor: this.colors[colorIndex].borderColor,
              borderWidth: 2,
              pointBackgroundColor: "#fff",
              pointBorderColor: this.colors[colorIndex].borderColor,
              pointBorderWidth: 2,
              pointHoverBackgroundColor: this.colors[colorIndex].borderColor,
              pointHoverBorderColor: "#fff",
              pointHoverRadius: 5,
              pointRadius: 4,
              label: dataItem.label,
              data: dataItem.data.map( (realDataItem) => {
                let column = realDataItem[dataItem.yColumn];
                if(Array.isArray(column)) {
                  return column[0][dataItem.yColumn];
                }
                return column;
              })
            };
        })
      };
      this.chart_instance.current.chartInstance.data = modifiedData;
      this.chart_instance.current.chartInstance.update({
          duration: 800,
          lazy: true,
          easing: 'easeOutBounce'
      });
    }
    this.toggle();

  }

  render() {
    const { shadow, component: { data, legend } } = this.props;
    const { modalOpen, elements } = this.state;


    let modifiedData = {
      labels: [ ...new Set(data.map( dataItem => dataItem.data.map(realDataItem => moment(realDataItem[dataItem.xColumn]).format(dataItem.timeIdentifier === "week" ? "dddd" : "MMM YYYY")) ).flat(2)) ],
      datasets: data.map( (dataItem, colorIndex) => {
          return {
            backgroundColor: this.colors[colorIndex].backgroundColor,
            borderColor: this.colors[colorIndex].borderColor,
            borderWidth: 2,
            pointBackgroundColor: "#fff",
            pointBorderColor: this.colors[colorIndex].borderColor,
            pointBorderWidth: 2,
            pointHoverBackgroundColor: this.colors[colorIndex].borderColor,
            pointHoverBorderColor: "#fff",
            pointHoverRadius: 5,
            pointRadius: 4,
            label: dataItem.label,
            data: dataItem.data.map( (realDataItem) => {
              let column = realDataItem[dataItem.yColumn];
              if(Array.isArray(column)) {
                return column[0][dataItem.yColumn];
              }
              return column;
            })
          };
      })
    };

    return (
      <div className={classNames('card', this.props.className)}>
        <div className="card-body">
          <div className="card-title">
            <span>{legend.charAt(0).toUpperCase() + legend.slice(1)}</span>
          </div>
          <div>
            <ChartComponent
              height={400}
              ref={this.chart_instance}
              type={shadow ? "lineWithShadow" : "line"}
              options={{
                ...areaChartOptions
              }}
              getElementAtEvent={ (event) => this.handleClick(event, data) }
              data={modifiedData}
            />
          </div>
          
          <Modal isOpen={modalOpen} size="lg" toggle={ () => this.toggle() }>
              <ModalBody className="p-4">
                  { elements.length === 0 ? <div class="loading d-block mx-auto position-static" /> : null }
                  { this.renderElements() }
              </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}
