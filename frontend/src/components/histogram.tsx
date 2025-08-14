"use client";

import React, { useEffect, useRef, useState } from "react";
import { AgCharts } from "ag-charts-react";
import type { AgBarSeriesOptions, AgChartOptions } from "ag-charts-community";
import type { Bins } from "~/contracts/simulation";

interface HistogramProps {
  title: string;
  subtitle: string;
  bins: Bins;
  series: AgBarSeriesOptions[];
}

export function Histogram({ title, subtitle, bins, series }: HistogramProps) {
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

  const options: AgChartOptions = {
    title: {
      text: title,
    },
    subtitle: {
      text: subtitle,
    },
    background: { visible: false },
    data: bins,
    series,
    width: containerWidth ?? undefined,
    height: 540,
    theme: "ag-polychroma",
    axes: [
      {
        type: "category",
        position: "bottom",
        label: { rotation: 0 },
        crosshair: { enabled: true },
        gridLine: { enabled: true },
        groupPaddingInner: 0,
        paddingOuter: 0,
        paddingInner: 0.15,
        title: { text: "Runs" },
      },
      {
        type: "number",
        position: "left",
        title: { text: "Percentage of Matches" },
      },
    ],
  };

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <AgCharts options={options} />
    </div>
  );
}
