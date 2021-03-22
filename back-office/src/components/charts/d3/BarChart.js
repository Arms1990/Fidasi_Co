import React from 'react';

import { ThemeColors } from '../../../helpers/ThemeColors';


import { select, selectAll, event } from 'd3-selection';
import { min, max, extent } from 'd3-array';
import { scaleLinear, scaleBand, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeParse } from 'd3-time-format';
import { brushX } from 'd3-brush';
import { area, curveMonotoneX } from 'd3-shape';
import { transition } from 'd3-transition';
import { zoom, zoomIdentity } from 'd3-zoom';

const getEvent = () => event;

const d3 = Object.assign(
    {},
    {
        select,
        selectAll,
        getEvent,
        curveMonotoneX,
        min,
        max,
        extent,
        scaleLinear,
        scaleBand,
        timeParse,
        scaleTime,
        axisBottom,
        axisLeft,
        brushX,
        area,
        transition,
        zoom,
        zoomIdentity
    }
);

const $ = require('jquery');



class BarChart extends React.Component {

    componentDidMount() {
        this.drawChart();
    }



    drawChart() {
        let { component } = this.props;
        
        let margin = {top: 20, right: 20, bottom: 30, left: 40}, width = $(window).width() / 1.5, height = 400 - margin.top - margin.bottom;
        let x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
        let y = d3.scaleLinear()
            .range([height, 0]);
        
        let svg = d3.select(`.${this.props.identifier}`).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        
        x.domain(component.data.map(data => data[`${component.xColumn}`]));
        y.domain([0, d3.max(component.data, function(d) {
            return d[`${component.yColumn}`];
        })]);

        let tooltip = d3.select(`.${this.props.identifier}`)
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-color", "#333")
        .style("border-radius", "3px")
        .style("padding", "3px");
        
        svg.selectAll(".bar")
            .data(component.data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return x(d[`${component.xColumn}`]);
            })
            .attr("width", x.bandwidth())
            .attr("y", function(d) {
                return y(d[`${component.yColumn}`]);
            })
            .attr("height", function(d) {
                let calculatedHeight = height - y(d[`${component.yColumn}`]);
                return calculatedHeight;
            })
            .style("opacity", "0.7")
            .style("fill", ThemeColors().themeColor1)
            .on("mouseover", function(d) {
                d3.select(this)
                .transition()
                .duration(100)
                .style('opacity', '1.0');
                return tooltip
                .text(d.value)
                .transition()
                .style("visibility", "visible");
            })
            .on("mousemove", function(d) {
                const event = d3.getEvent();
                return tooltip
                .text(`${component.labels[0]}: ${d[component.yColumn]}`)
                .style("top", (event.layerY) + "px")
                .style("left", (event.layerX) + "px");
            })
            .on("mouseout", function() {
                d3.select(this)
                .transition()
                .style('opacity', '0.7');
                return tooltip
                .transition()
                .style("visibility", "hidden");
            });

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg.append("g")
            .call(d3.axisLeft(y));
                    

    }


    render() {
        return <div className={`chart text-center ${this.props.identifier}`}></div>
    }
  
  

}

export default BarChart;