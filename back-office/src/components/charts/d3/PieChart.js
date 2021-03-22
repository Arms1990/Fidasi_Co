import React from 'react';

import { select, selectAll, event } from 'd3-selection';
import { min, max, extent, sum } from 'd3-array';
import { entries } from 'd3-collection';
import { scaleLinear, scaleOrdinal, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeParse } from 'd3-time-format';
import { brushX } from 'd3-brush';
import { area, curveMonotoneX, arc, pie } from 'd3-shape';
import { transition } from 'd3-transition';
import { zoom, zoomIdentity } from 'd3-zoom';
import { schemeSet2 } from 'd3-scale-chromatic';
import { interpolate } from 'd3-interpolate';


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
        sum,
        pie,
        entries,
        arc,
        interpolate,
        extent,
        scaleLinear,
        scaleOrdinal,
        timeParse,
        schemeSet2,
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



class PieChart extends React.Component {

    componentDidMount() {
        this.drawChart();
    }



    drawChart() {
        let { component } = this.props;
        
        let width = 500, height = 500, margin = 40, radius = Math.min(width, height) / 2 - margin;
        
        let svg = d3.select(`.${this.props.identifier}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "chart")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
        let color = d3.scaleOrdinal()
        .domain(component.data.map(data => data[`${component.xColumn}`]))
        .range(d3.schemeSet2);
        
        let pie = d3.pie()
        .value(function(d) { return d[`${component.yColumn}`]; });
        
        let data_ready = pie(component.data);
        let arcGenerator = d3.arc()
        .padAngle(.025)
        .innerRadius(0)
        .outerRadius(radius);

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
        
        svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d) { return (color(d.data[`${component.yColumn}`])); })
        .attr("stroke", "#333")
        .style("stroke-width", "1px")
        .style("opacity", 0.7)
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
            .text(`${component.labels[0]}: ${d.value}`)
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
        
        svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d) { return d.data[`${component.yColumn}`]; })
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .style("font-size", "11px");


    }
    
    render() {
        return <div className={`text-center ${this.props.identifier}`}></div>
    }

}

export default PieChart;