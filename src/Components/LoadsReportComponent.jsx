import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { reaction } from 'mobx';
import { Table } from 'antd';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ApiFetch } from '../Helpers/Helpers';
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
  Filler,
} from 'chart.js';

@inject('ProviderStore')
@observer
export default class LoadsReportComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      InfoTableRows: [],
      InfoTableColumns: [],
      LoadsTableRows: [],
      LoadsTableColumns: [],
      LoadsChartData: [],
    };
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
        labels: this.state.LoadsChartData.map((Data) => {
          return Data[0];
        }),
        datasets: [
          {
            type: 'line',
            label: 'Погрузки',
            backgroundColor: 'rgb(88,160,160)',

            fill: true,

            data: this.state.LoadsChartData.map((Data) => {
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
              displayFormats: { hour: 'HH:MM:SS' },
            },
          },
        },
      },
    });
  };
  RequestReport() {
    if (
      this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys.length !=
      0
    ) {
      return ApiFetch(
        `reports/LoadsReport?id=${
          this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys[0]
        }&sts=${this.props.ProviderStore.CurrentTab.Options.StartDate.unix()}&fts=${this.props.ProviderStore.CurrentTab.Options.EndDate.unix()}`,
        'GET',
        undefined,
        (Response) => {
          this.setState({
            LoadsChartData: Response.loadsPoints,
            InfoTableRows: GenerateTableData('Rows', Response.infoTable.rows),
            InfoTableColumns: GenerateTableData(
              'NoColumns',
              Response.infoTable.rows
            ),
            LoadsTableRows: GenerateTableData('Rows', Response.loadsTable.rows),
            LoadsTableColumns: GenerateTableData(
              'Columns',
              Response.loadsTable.columns
            ),
          });
        }
      );
    }
  }
  componentDidMount() {
    if (
      this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys.length >
      0
    ) {
      this.RequestReport().then(() => {
        this.InitChart();
      });
    }

    reaction(
      () => this.props.ProviderStore.CurrentTab.Options.StartDate,
      () => {
        if (this.Chart != null) {
          this.RequestReport().then(() => {
            this.Chart.data.labels = this.state.LoadsChartData.map((Data) => {
              return Data[0];
            });
            this.Chart.data.datasets[0].data = this.state.LoadsChartData.map(
              (Data) => {
                return Data[1];
              }
            );
            this.Chart.update();
          });
        } else {
          this.RequestReport().then(() => {
            this.InitChart();
          });
        }
      }
    );
    reaction(
      () => this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys,
      () => {
        if (
          this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys
            .length > 0
        ) {
          if (this.Chart != null) {
            this.RequestReport().then(() => {
              this.Chart.data.datasets[0].data = this.state.LoadsChartData.map(
                (Data) => {
                  return Data[1];
                }
              );
              this.Chart.update();
            });
          } else {
            this.RequestReport().then(() => {
              this.InitChart();
            });
          }
        }
      }
    );
  }
  render() {
    return this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys
      .length > 0 ? (
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
            columns={this.state.LoadsTableColumns}
            dataSource={this.state.LoadsTableRows}
            pagination={false}
          />
          <Table
            size="small"
            showHeader={false}
            columns={this.state.InfoTableColumns}
            dataSource={this.state.InfoTableRows}
            pagination={false}
          />
        </div>
      </div>
    ) : (
      <span>Отчет не может быть построен</span>
    );
  }
}
