import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Table } from 'antd';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';
import { ApiFetch, GenerateTableData } from '../Helpers/Helpers';

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
@inject('ProviderStore')
@observer
export default class TripsReportComponent extends React.Component {
  constructor(props) {
    super(props);
    this.ChartRef = React.createRef();
    this.state = {
      TripsChartData: [],
      LoadingChartData: [],
      LoadingCanChartData: [],
      InfoTableRows: [],
      TripsTableRows: [],
      TripsTableColumns: [],
      GroupsTableRows: [],
      GroupsTableColumns: [],
      InfoTableColumns: [],
    };
    this.Chart = null;
  }

  RequestReport() {
    if (
      this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys.length !=
      0
    ) {
      return ApiFetch(
        `reports/TripsReport?id=${
          this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys[0]
        }&sts=${this.props.ProviderStore.CurrentTab.Options.StartDate.unix()}&fts=${this.props.ProviderStore.CurrentTab.Options.EndDate.unix()}`,
        'GET',
        undefined,
        (Response) => {
          this.setState({
            TripsChartData: Response.tripsPoints,
            LoadingChartData: Response.weightPoints,
            LoadingCanChartData: Response.weightCANPoints,
            GroupsTableColumns: GenerateTableData(
              'Columns',
              Response.groupsTable.columns
            ),
            GroupsTableRows: GenerateTableData(
              'Rows',
              Response.groupsTable.rows
            ),
            TripsTableRows: GenerateTableData('Rows', Response.tripsTable.rows),
            TripsTableColumns: GenerateTableData(
              'Columns',
              Response.tripsTable.columns
            ),
            InfoTableColumns: GenerateTableData(
              'NoColumns',
              Response.infoTable.rows
            ),
            InfoTableRows: GenerateTableData('Rows', Response.infoTable.rows),
          });
        }
      );
    }
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
        labels: this.state.TripsChartData.map((Time) => {
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
            data: this.state.LoadingChartData,
          },
          {
            pointRadius: 0,
            label: 'Рейсы',
            type: 'line',
            borderWidth: 1.6,
            borderColor: '#802080',
            backgroundColor: '#802080',
            data: this.state.TripsChartData,
            borderWidth: 1,
          },
          {
            pointRadius: 0,
            type: 'line',
            label: 'Загрузка Can',
            borderWidth: 0.4,
            borderColor: '#206070',
            backgroundColor: '#206070',
            data: this.state.LoadingCanChartData,
          },
        ],
      },
      options: {
        responsive: true,
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
        scales: {
          x: {
            type: 'time',
            time: { unit: 'hour', displayFormats: { hour: 'hh:mm:ss' } },
          },
        },
      },
    });
  }
  GetReportTitle() {
    let Result = null;
    this.props.ProviderStore.TransportTree.forEach((TreeNode) => {
      TreeNode.children.forEach((Transport) => {
        if (
          Transport.key ==
          this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys[0]
        ) {
          Result = Transport.title;
        }
      });
    });
    return Result;
  }
  componentDidMount() {
    this.RequestReport().then(() => {
      this.InitCharts();
    });
  }
  render() {
    return (
      <div
        style={{ display: 'grid', gridTemplateRows: '1fr 1fr' }}
        className="FullExtend"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '3fr 1fr',
          }}
        >
          <div>
            <strong>{this.GetReportTitle()}</strong>
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
              columns={this.state.GroupsTableColumns}
              dataSource={this.state.GroupsTableRows}
              scroll={{ y: 200 }}
              pagination={false}
            />
            <Table
              showHeader={false}
              pagination={false}
              size="small"
              dataSource={this.state.InfoTableRows}
              columns={this.state.InfoTableColumns}
            />
          </div>
        </div>
        <div>
          <Table
            pagination={false}
            size="small"
            scroll={{ y: 150 }}
            columns={this.state.TripsTableColumns}
            dataSource={this.state.TripsTableRows}
          />
        </div>
      </div>
    );
  }
}
