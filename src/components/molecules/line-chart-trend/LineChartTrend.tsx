import { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';

import { useResizeObserver } from '@/components/hooks';

interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
export interface DataPoint {
  timestamp: number;
  value: number;
}

type Props = {
  data: DataPoint[];
  margin?: Margin;
  color?: string;
  timeWindow?: number; // Max number of points to display
  width?: number;
  height?: number;
};

export const LineChartTrend = ({
  data,
  margin = { top: 20, right: 20, bottom: 30, left: 40 },
  color = '#2ef8ff',
  timeWindow = 1000,
  width,
  height,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(wrapperRef);

  // Memoize the display data to avoid recalculating on every render
  const displayData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return timeWindow ? data.slice(-timeWindow) : data;
  }, [data, timeWindow]);

  // Memoize the data hash to detect actual data changes
  const dataHash = useMemo(() => {
    if (displayData.length === 0) return '';
    const firstPoint = displayData[0];
    const lastPoint = displayData[displayData.length - 1];
    return `${displayData.length}-${firstPoint?.timestamp}-${lastPoint?.timestamp}-${lastPoint?.value}`;
  }, [displayData]);

  useEffect(() => {
    if (!displayData || displayData.length === 0) return;
    if (!wrapperRef.current || !svgRef.current) return;

    const wrapper = wrapperRef.current;
    const svgElement = svgRef.current;
    const svg = d3.select(svgElement);

    // Get dimensions from wrapper using clientWidth/clientHeight
    // This gives us the actual rendered size of the parent container
    const svgWidth = width ?? wrapper.clientWidth;
    const svgHeight = height ?? wrapper.clientHeight;

    // Ensure minimum dimensions
    if (svgWidth <= 0 || svgHeight <= 0) return;

    const innerWidth = Math.max(0, svgWidth - margin.left - margin.right);
    const innerHeight = Math.max(0, svgHeight - margin.top - margin.bottom);

    // Set explicit dimensions on SVG element to override default 300x150
    svgElement.setAttribute('width', String(svgWidth));
    svgElement.setAttribute('height', String(svgHeight));

    // Clear previous content to prevent accumulation
    svg.selectAll('*').remove();

    // Calculate domains
    const xExtent = d3.extent(displayData, (d) => d.timestamp) as [
      number,
      number
    ];
    const yExtent = d3.extent(displayData, (d) => d.value) as [number, number];

    // Scales
    const xScale = d3.scaleLinear().domain(xExtent).range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(yExtent)
      .range([innerHeight, 0])
      .nice();

    // Line generator
    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.timestamp))
      .y((d) => yScale(d.value))
      .curve(d3.curveLinear);

    // Area generator
    const areaGenerator = d3
      .area<DataPoint>()
      .x((d) => xScale(d.timestamp))
      .y0(innerHeight)
      .y1((d) => yScale(d.value))
      .curve(d3.curveLinear);

    // Render area
    svg
      .append('path')
      .datum(displayData)
      .attr('class', 'area')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('fill', color)
      .attr('fill-opacity', 0.2)
      .attr('d', areaGenerator);

    // Render line
    svg
      .append('path')
      .datum(displayData)
      .attr('class', 'line')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 1.5)
      .attr('d', lineGenerator);

    // Skip axes for very small charts (height < 50px)
    if (svgHeight >= 50) {
      const xAxis = d3.axisBottom(xScale).ticks(3);
      const yAxis = d3.axisLeft(yScale).ticks(3);

      svg
        .append('g')
        .attr('class', 'x-axis')
        .attr(
          'transform',
          `translate(${margin.left}, ${innerHeight + margin.top})`
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .call(xAxis as any);

      svg
        .append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .call(yAxis as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataHash, margin, color, dimensions, width, height]);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <svg
        ref={svgRef}
        style={{
          display: 'block',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </div>
  );
};
