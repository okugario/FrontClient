import * as React from 'react';
import { useEffect, useState } from 'react';
import ExhaustTemperatureData from '../TestData/ExhaustTemperatureData.json';
import { observer, inject } from 'mobx-react';
import { ApiFetch } from '../Helpers/Helpers';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeSeriesScale,
  BarController,
  BarElement,
  Legend,
} from 'chart.js';

const ExhaustTemperatureComponent = inject('ProviderStore')(
  observer((props) => {
    const ChartRef = React.createRef();
    const InitChart = () => {
      RequestTransportTree();
      ChartRef.current.getContext('2d');
      Chart.register(
        LineController,
        LinearScale,
        CategoryScale,
        PointElement,
        LineElement,
        TimeSeriesScale,
        BarController,
        BarElement,
        zoomPlugin,
        Legend
      );
      let CurrentChart = new Chart(ChartRef.current, {
        data: { labels: [], datasets: [] },
      });
    };
    const RequestTransportTree = () => {
      ApiFetch(
        `reports/VehicleTree?ts=${props.ProviderStore.CurrentTab.Options.StartDate.unix()}`,
        'GET',
        undefined,
        (Response) => {
          props.ProviderStore.SetNewTransportTree(Response.data);
        }
      );
    };
    useEffect(InitChart, []);
    return (
      <canvas ref={ChartRef} style={{ height: '200px', width: '700px' }} />
    );
  })
);
export default ExhaustTemperatureComponent;
