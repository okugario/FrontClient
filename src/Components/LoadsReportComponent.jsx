import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { reaction } from 'mobx';
import { Table, message } from 'antd';
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
    this.UpdateInDate = null;
    this.UpdateInKeys = null;
    this.state = {
      SummaryTables: [],
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
    if (this.props.ProviderStore.CurrentTab.Id == 'reports') {
      let Result = null;
      if (
        this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys
          .length != 0
      ) {
        this.props.ProviderStore.TransportTree.forEach((TreeNode) => {
          TreeNode.children.forEach((Transport) => {
            if (
              Transport.key ==
              this.props.ProviderStore.CurrentTab.Options
                .CheckedTransportKeys[0]
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
                SummaryTables: Response.summaryTables,
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
        ).catch(() => {
          message.warn('Нет данных для построения отчета.');
        });
      } else {
        this.Chart.update('hide');
        this.setState({
          SummaryTables: [],
          LoadsTableRows: [],
          LoadsTableColumns: [],
          LoadsChartData: [],
          LoadsTableSummary: [],
        });
      }
    }
  }
  Reactions() {}
  componentDidMount() {
    this.InitChart();
    this.RequestReport();
    this.UpdateInDate = reaction(
      () =>
        this.props.ProviderStore.CurrentTab.Options.StartDate ||
        this.props.ProviderStore.CurrentTab.Options.EndDate,
      () => {
        this.RequestReport();
      }
    );
    this.UpdateInKeys = reaction(
      () => this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys,
      () => {
        this.RequestReport();
      }
    );
  }
  componentWillUnmount() {
    this.UpdateInKeys();
    this.UpdateInDate();
  }
  render() {
    return (
      <div
        className="FullExtend"
        style={{ display: 'grid', gridTemplateColumns: '3fr 1fr' }}
      >
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr' }}>
          <div style={{ height: '100%', width: '100%' }}>
            <strong>{this.GetReportTitle()}</strong>
            <canvas
              onDoubleClick={() => {
                this.Chart.resetZoom();
              }}
              ref={this.ChartRef}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
          <div>
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
          </div>
        </div>
        <div style={{ overflowY: 'auto', height: '500px' }}>
          {this.state.SummaryTables.map((ObjectTable, Index) => {
            ObjectTable.table.rows.push(ObjectTable.table.summary[0]);
            return (
              <Table
                pagination={false}
                key={Index}
                size="small"
                title={() => <strong>{ObjectTable.caption}</strong>}
                columns={GenerateTableData(
                  'Columns',
                  ObjectTable.table.columns
                )}
                dataSource={GenerateTableData('Rows', ObjectTable.table.rows)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
