import React from 'react';

import { ThemeColors } from '../../../helpers/ThemeColors';

import { select, selectAll, event } from 'd3-selection';
import { min, max, extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
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



class AreaChart extends React.Component {

    componentDidMount() {
        this.drawChart();
    }



    drawChart() {
        let { component } = this.props;
        let margin = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
            width = $(window).width() / 1.8,
            height = 500 - margin.top - margin.bottom,
            height2 = 490 - margin2.top - margin2.bottom;

        let svg = d3.select(`.${this.props.identifier}`).append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "chart")
            .append("g")

        component.data = component.data.map(function(dataItem) {
            dataItem[`${component.xColumn}`] = d3.timeParse("%Y-%m-%d %H:%M:%S")(dataItem[`${component.xColumn}`]);
            return dataItem;
        });

        let x = d3.scaleTime().range([0, width]),
            x2 = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

        let xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

        const brushed = () => {
            if (d3.getEvent().sourceEvent && d3.getEvent().sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            var s = d3.getEvent().selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            focus.select(".area").attr("d", area);
            focus.select(".axis--x").call(xAxis);
            svg.select(".zoom").call(
            zoom.transform,
            d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0)
            );
        }

        const zoomed = () => {
            if (d3.getEvent().sourceEvent && d3.getEvent().sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3.getEvent().transform;
            x.domain(t.rescaleX(x2).domain());
            focus.select(".area").attr("d", area);
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }

        let brush = d3.brushX()
            .extent([[0, 0], [width, height2]])
            .on("brush end", brushed);

        let zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        let area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return x(d[`${component.xColumn}`]); })
            .y0(height)
            .y1(function(d) { return y(d[`${component.yColumn}`]); });

        let area2 = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return x2(d[`${component.xColumn}`]); })
            .y0(height2)
            .y1(function(d) { return y2(d[`${component.yColumn}`]); });

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        let focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        x.domain(d3.extent(component.data, function(d) { return d[`${component.xColumn}`]; }));
        y.domain([0, d3.max(component.data, function(d) { return d[`${component.yColumn}`]; })]);
        x2.domain(x.domain());
        y2.domain(y.domain());

        focus.append("path")
            .datum(component.data)
            .attr("d", area)
            .attr("clip-path", "url(#clip)")
            .attr("class","area zoom")
            .attr("fill", ThemeColors().themeColor1)
            .attr("fill-opacity", .3)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style('opacity', '0.7')
            .on("mouseover", function(d) {
                return d3.select(this)
                .transition()
                .duration(100)
                .style('opacity', '1.0');
            })
            .on("mouseout", function() {
                return d3.select(this)
                .transition()
                .style('opacity', '0.7');
            })
            .call(zoom);

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        let dragger = context.append("path")
            .datum(component.data)
            .attr("class", "area")
            .attr("d", area2)
            .attr("clip-path", "url(#clip)")
            .attr("fill", ThemeColors().themeColor1)
            .attr("fill-opacity", .3)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style('opacity', '0.7');

        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range())
            .on("mouseover", function(d) {
                return dragger
                .transition()
                .duration(100)
                .style('opacity', '1.0');
            })
            .on("mouseout", function() {
                return dragger
                .transition()
                .style('opacity', '0.7');
            });

    }


    render() {
        return <div className={`chart text-center ${this.props.identifier}`}></div>
    }
  
  

}

export default AreaChart;