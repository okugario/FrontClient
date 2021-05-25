import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Table } from 'antd';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';
import LoadTestData from '../TestData/LoadReportData.json';
import { GenerateTableData } from '../Helpers/Helpers';
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
  Filler,
} from 'chart.js';

@inject('ProviderStore')
@observer
export default class LoadsReportComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.ChartRef = React.createRef();
    this.Chart = null;
  }
  InitChart = () => {
    this.ChartRef.current.getContext('2d');
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
      Legend,
      Filler
    );
    this.Chart = new Chart(this.ChartRef.current, {
      data: {
        labels: LoadTestData.lpts.map((Data) => {
          return Data[0];
        }),
        datasets: [
          {
            type: 'line',
            label: 'Погрузки',
            backgroundColor: 'rgb(88,160,160)',

            fill: true,

            data: LoadTestData.lpts.map((Data) => {
              return Data[1];
            }),
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
  componentDidMount() {
    this.InitChart();
  }
  render() {
    return (
      <div
        className="FullExtend"
        style={{ display: 'grid', gridTemplateRows: '1fr 1fr' }}
      >
        <div>
          <canvas
            ref={this.ChartRef}
            style={{ height: '200px', width: '700px' }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr' }}>
          <Table
            size="small"
            columns={GenerateTableData('Columns', LoadTestData.loads.columns)}
            dataSource={GenerateTableData('Rows', LoadTestData.loads.rows)}
            pagination={false}
          />
          <Table
            size="small"
            columns={GenerateTableData('Columns', LoadTestData.info.columns)}
            dataSource={GenerateTableData('Rows', LoadTestData.info.rows)}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}
