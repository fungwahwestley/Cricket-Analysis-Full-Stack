"use client";

import React, { useEffect, useRef, useState } from "react";
import { AgCharts } from "ag-charts-react";
import type { AgBarSeriesOptions, AgChartOptions } from "ag-charts-community";

interface HistogramProps {
  title: string;
  subtitle: string;
  data: any[];
  series: any;
}

export function Histogram({ title, subtitle, data, series }: HistogramProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      setContainerWidth(element.clientWidth);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const series1: AgBarSeriesOptions = {
    type: "bar",
    xKey: "score",
    yKey: "Everton",
    yName: "Everton",
    grouped: true,
  };
  const series2 = { ...series1, yKey: "Arsenal", yName: "Arsenal" };

  const options: AgChartOptions = {
    title: {
      text: title,
    },
    subtitle: {
      text: subtitle,
    },
    background: { visible: false },
    data,
    series: [series1, series2],
    width: containerWidth ?? undefined,
    height: 400,
    theme: "ag-polychroma",
    axes: [
      {
        type: "category",
        position: "bottom",
        label: { rotation: 0 },
        crosshair: { enabled: true },
        gridLine: { enabled: true },
        interval: {
          minSpacing: 10,
          placement: "between",
          values: [100, 110, 120],
        },
        groupPaddingInner: 0,
        paddingOuter: 0,
        paddingInner: 0.15,
      },
      { type: "number", position: "left" },
    ],
  };

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <AgCharts options={options} />
    </div>
  );
}
