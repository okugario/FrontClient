import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Table } from 'antd';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';
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
} from 'chart.js';
import TripsReportTestData from '../TestData/TripsReportData.json';
@inject('ProviderStore')
@observer
export default class TripsReportComponent extends React.Component {
  constructor(props) {
    super(props);
    this.ChartRef = React.createRef();
    this.state = {};
    this.Chart = null;
  }
  InitCharts() {
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
        labels: TripsReportTestData.tpts.map((Time) => {
          return Time[0];
        }),
        datasets: [
          {
            label: 'Загрузка',
            type: 'line',
            borderColor: '#000000',
            backgroundColor: '#000000',
            pointRadius: 0,
            borderWidth: 0.8,
            data: TripsReportTestData.wpts,
          },
          {
            pointRadius: 0,
            label: 'Рейсы',
            type: 'line',
            borderWidth: 1.6,
            borderColor: '#802080',
            backgroundColor: '#802080',
            data: TripsReportTestData.tpts.map((Point) => {
              return Point[1];
            }),

            borderWidth: 1,
          },
          {
            pointRadius: 0,
            type: 'line',
            label: 'Загрузка Can',
            borderWidth: 0.4,
            borderColor: '#206070',
            backgroundColor: '#206070',
            data: TripsReportTestData.wcpts,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'bottom' },
          zoom: {
            zoom: { enabled: true, mode: 'x' },
            pan: {
              enabled: true,
              mode: 'x',
              rangeMin: { x: TripsReportTestData.tpts[0][0] },
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: { unit: 'hour', displayFormats: { hour: 'hh:mm:ss' } },
          },
        },
      },
    });
  }

  componentDidMount() {
    this.InitCharts();
  }
  render() {
    return (
      <div
        style={{ display: 'grid', gridTemplateRows: '1fr 1fr' }}
        className="FullExtend"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr' }}>
          <div>
            <canvas
              onDoubleClick={() => {
                this.Chart.resetZoom();
              }}
              ref={this.ChartRef}
              style={{ height: '200px', width: '700px' }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}
          >
            <Table
              size="small"
              columns={GenerateTableData(
                'Columns',
                TripsReportTestData.groups.columns
              )}
              dataSource={GenerateTableData(
                'Rows',
                TripsReportTestData.groups.rows
              )}
              scroll={{ y: 200 }}
              pagination={false}
            />
            <Table
              pagination={false}
              size="small"
              dataSource={GenerateTableData(
                'Rows',
                TripsReportTestData.info.rows
              )}
              columns={GenerateTableData(
                'Columns',
                TripsReportTestData.info.columns
              )}
            />
          </div>
        </div>
        <div>
          <Table
            pagination={false}
            size="small"
            scroll={{ y: 150 }}
            columns={GenerateTableData(
              'Columns',
              TripsReportTestData.trips.columns
            )}
            dataSource={GenerateTableData(
              'Rows',
              TripsReportTestData.trips.rows
            )}
          />
        </div>
      </div>
    );
  }
}
