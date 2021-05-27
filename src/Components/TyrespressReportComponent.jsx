import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Table } from 'antd';
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
import TyrpressReportData from '../TestData/TyrespressReportData.json';
import { GenerateTableData } from '../Helpers/Helpers';

@inject('ProviderStore')
@observer
export default class TyrespressReportComponent extends React.Component {
  constructor(props) {
    super(props);
    this.Chart = null;
    this.ChartRef = React.createRef();
    this.state = {};
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
      Legend
    );
    this.Chart = new Chart(this.ChartRef.current, {
      data: {
        labels: TyrpressReportData.skt.values[0].pts.map((Point) => {
          return Point[0];
        }),
        datasets: [
          {
            pointRadius: 0,
            type: 'line',
            label: TyrpressReportData.skt.values[0].caption,
            borderColor: '#7cb5ec',
            backgroundColor: '#7cb5ec',
            data: TyrpressReportData.skt.values[0].pts,
          },
          {
            borderColor: '#434348',
            backgroundColor: '#434348',
            pointRadius: 0,
            type: 'line',
            label: TyrpressReportData.skt.values[1].caption,
            data: TyrpressReportData.skt.values[1].pts,
          },
          {
            borderColor: '#90ed7d',
            backgroundColor: '#90ed7d',
            pointRadius: 0,
            type: 'line',
            label: TyrpressReportData.skt.values[2].caption,
            data: TyrpressReportData.skt.values[2].pts,
          },
          {
            pointRadius: 0,
            backgroundColor: '#f7a35c',
            borderColor: '#f7a35c',
            type: 'line',
            label: TyrpressReportData.skt.values[3].caption,
            data: TyrpressReportData.skt.values[3].pts,
          },
          {
            pointRadius: 0,
            backgroundColor: '#8085e9',
            borderColor: '#8085e9',
            type: 'line',
            label: TyrpressReportData.skt.values[4].caption,
            data: TyrpressReportData.skt.values[4].pts,
          },
          {
            pointRadius: 0,
            backgroundColor: '#f15c80',
            borderColor: '#f15c80',
            type: 'line',
            label: TyrpressReportData.skt.values[5].caption,
            data: TyrpressReportData.skt.values[5].pts,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: true, position: 'bottom' },
          zoom: {
            zoom: { wheel: { enabled: true }, mode: 'x' },
            pan: {
              enabled: true,
              mode: 'x',
            },
          },
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
      <div style={{ display: 'grid', gridTemplateRows: '2 fr 1 fr' }}>
        <div>
          <canvas
            onDoubleClick={() => {
              this.Chart.resetZoom();
            }}
            ref={this.ChartRef}
            style={{ height: '200px', width: '700px' }}
          />
        </div>
        <Table
          size="small"
          pagination={false}
          columns={GenerateTableData(
            'Columns',
            TyrpressReportData.skt.table.columns
          )}
          dataSource={GenerateTableData(
            'Rows',
            TyrpressReportData.skt.table.rows
          )}
        />
      </div>
    );
  }
}
