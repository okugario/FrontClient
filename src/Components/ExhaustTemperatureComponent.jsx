import * as React from 'react';
import { useEffect, useState } from 'react';

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
      const CurrentChart = new Chart(ChartRef.current, {
        data: {
          labels: [],
          datasets: [
            {
              pointRadius: 0,
              borderColor: '#7cb5ec',
              backgroundColor: '#7cb5ec',
              type: 'line',
              label: "",
              data:[]
            },
            {
              pointRadius: 0,
              borderColor: '#434348',
              backgroundColor: '#434348',
              type: 'line',
              label:"",
              data: [],
            },
            {
              pointRadius: 0,
              borderColor: '#90ed7d',
              backgroundColor: '#90ed7d',
              type: 'line',
              label: "",
              data:[],
            },
            {
              pointRadius: 0,
              borderColor: '#f7a866',
              backgroundColor: '#f7a866',
              type: 'line',
              label:"",
              data: [],
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: true, position: 'bottom' },
          },
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'hour',
                displayFormats: { hour: 'DD MMM HH:MM:SS' },
              },
            },
          },
        },
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
