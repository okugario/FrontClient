import * as React from 'react';
import { useEffect } from 'react';
import { Chart } from '../Classes/ChartClass';

export default function ChartComponent(props) {
  const ChartRef = React.createRef();
  const InitChart = () => {
    if (props.DataSource != null) {
      new Chart(ChartRef.current, props.DataSource);
    }
  };
  useEffect(InitChart, [props.DataSource]);
  return (
    <div
      ref={ChartRef}
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  );
}
