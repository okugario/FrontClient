import * as React from 'react';
import { useEffect, useState } from 'react';
import ExhaustTemperatureData from '../TestData/ExhaustTemperatureData.json';
import ChartComponent from './ChartComponent';
import { RandomColor } from '../Helpers/Helpers';

export default function ExhaustTemperatureComponent() {
  const [ChartData, SetNewChartData] = useState(null);
  const GenerateData = (RawData) => {
    return {
      DataSource: RawData.map((ChartData) => {
        const NewChartData = {
          Title: ChartData.capt,
          Type: 'Line',
          Data: ChartData.pts,
          Color: RandomColor(),
        };
        return NewChartData;
      }),
      Options: {
        x: {
          type: 'Time',
        },
        y: { type: 'Standart' },
      },
    };
  };
  const RequestChart = () => {
    SetNewChartData(GenerateData(ExhaustTemperatureData.values));
  };

  useEffect(RequestChart, []);
  return <ChartComponent DataSource={ChartData} />;
}
