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
      LoadsTableSummary: [],
    };
    this.ChartRef = React.createRef();
    this.Chart = null;
  }

  InitChart = () => {
    if (this.Chart != null) {
      this.Chart.data.datasets[0].data = this.state.LoadsChartData;
      this.Chart.data.labels = this.state.LoadsChartData.map((Data) => {
        return Data[0];
      });

      this.Chart.update('reset');
    } else {
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
          labels: [],
          datasets: [
            {
              type: 'line',
              label: 'Погрузки',
              backgroundColor: 'rgb(88,160,160)',
              fill: true,
              data: [],
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
  };
  GetReportTitle() {
    let Result = null;
    if (
      this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys.length !=
      0
    ) {
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
    } else {
      Result = 'Транспортное средство не выбрано';
    }

    return Result;
  }
  RequestReport() {
    if (
      this.props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id ==
      'loadsReport'
    ) {
      if (
        this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys
          .length != 0
      ) {
        ApiFetch(
          `reports/LoadsReport?id=${
            this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys[0]
          }&sts=${this.props.ProviderStore.CurrentTab.Options.StartDate.unix()}&fts=${this.props.ProviderStore.CurrentTab.Options.EndDate.unix()}`,
          'GET',
          undefined,
          (Response) => {
            this.setState(
              {
                LoadsTableSummary: Response.loadsTable.summary,
                LoadsChartData: Response.loadsPoints,
                InfoTableRows: GenerateTableData(
                  'Rows',
                  Response.infoTable.rows
                ),
                InfoTableColumns: GenerateTableData(
                  'NoColumns',
                  Response.infoTable.rows
                ),
                LoadsTableRows: GenerateTableData(
                  'Rows',
                  Response.loadsTable.rows
                ),
                LoadsTableColumns: GenerateTableData(
                  'Columns',
                  Response.loadsTable.columns
                ),
              },
              () => {
                this.Chart.data.labels = this.state.LoadsChartData.map(
                  (Data) => {
                    return Data[0];
                  }
                );
                this.Chart.data.datasets[0].data = this.state.LoadsChartData;
                this.Chart.update('show');
              }
            );
          }
        );
      } else {
        this.Chart.update('hide');
        this.setState({
          InfoTableRows: [],
          InfoTableColumns: [],
          LoadsTableRows: [],
          LoadsTableColumns: [],
          LoadsChartData: [],
          LoadsTableSummary: [],
        });
      }
    }
  }
  componentDidMount() {
    this.InitChart();
    this.RequestReport();
    reaction(
      () =>
        this.props.ProviderStore.CurrentTab.Options.StartDate ||
        this.props.ProviderStore.CurrentTab.Options.EndDate,
      () => {
        this.RequestReport();
      }
    );
    reaction(
      () => this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys,
      () => {
        this.RequestReport();
      }
    );
  }
  render() {
    return (
      <div
        className="FullExtend"
        style={{ display: 'grid', gridTemplateRows: '1fr 1fr' }}
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
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr' }}>
          <Table
            summary={() => {
              return (
                <Table.Summary fixed={true}>
                  {this.state.LoadsTableSummary.map((Row, Index) => {
                    return (
                      <Table.Summary.Row key={Index}>
                        {Row.map((Value, Index) => {
                          return (
                            <Table.Summary.Cell key={Index}>
                              {Value}
                            </Table.Summary.Cell>
                          );
                        })}
                      </Table.Summary.Row>
                    );
                  })}
                </Table.Summary>
              );
            }}
            scroll={{ y: 170 }}
            size="small"
            columns={this.state.LoadsTableColumns}
            dataSource={this.state.LoadsTableRows}
            pagination={false}
          />
          <Table
            scroll={{ y: 200 }}
            size="small"
            showHeader={false}
            columns={this.state.InfoTableColumns}
            dataSource={this.state.InfoTableRows}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}
