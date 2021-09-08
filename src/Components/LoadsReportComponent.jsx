import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { useState, useEffect, createRef } from 'react';
import { Table, message } from 'antd';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ApiFetch } from '../Helpers/Helpers';
import 'chartjs-adapter-moment';

import { GenerateTableData } from '../Helpers/Helpers';
import {
  Chart as ChartClass,
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
const LoadsReportComponent = inject('ProviderStore')(
  observer((props) => {
    const [SummaryTables, SetNewSummaryTables] = useState([]);
    const [LoadsTableRows, SetNewLoadsTableRows] = useState([]);
    const [LoadsTableColumns, SetNewLoadsTableColumns] = useState([]);
    const [LoadsTableSummary, SetNewLoadsTableSummary] = useState([]);
    const [Chart, SetNewChart] = useState(null);
    const [ChartRef, SetNewChartRef] = useState(createRef());

    ChartClass.register(
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

    const InitChart = (LoadsChartData, Labels) => {
      if (LoadsChartData == undefined && Labels == undefined) {
        ChartRef.current.getContext('2d');
        SetNewChart(
          new ChartClass(ChartRef.current, {
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
                  limits: { x: { min: 'original', max: 'original' } },
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
          })
        );
      } else {
        Chart.data.datasets[0].data = LoadsChartData;
        Chart.data.labels = Labels;

        Chart.update('reset');
      }
    };

    const GetReportTitle = () => {
      let Result = null;
      if (
        props.ProviderStore.CurrentTab.Options.CheckedTransportKeys.length != 0
      ) {
        props.ProviderStore.TransportTree.forEach((TreeNode) => {
          TreeNode.children.forEach((Transport) => {
            if (
              Transport.key ==
              props.ProviderStore.CurrentTab.Options.CheckedTransportKeys[0]
            ) {
              Result = Transport.title;
            }
          });
        });
      } else {
        Result = 'Транспортное средство не выбрано';
      }

      return Result;
    };
    const RequestReport = () => {
      if (
        props.ProviderStore.CurrentTab.Options.CheckedTransportKeys.length != 0
      ) {
        ApiFetch(
          `reports/LoadsReport?id=${
            props.ProviderStore.CurrentTab.Options.CheckedTransportKeys[0]
          }&sts=${props.ProviderStore.CurrentTab.Options.StartDate.unix()}&fts=${props.ProviderStore.CurrentTab.Options.EndDate.unix()}`,
          'GET',
          undefined,
          (Response) => {
            SetNewLoadsTableSummary(Response.loadsTable.summary);
            SetNewSummaryTables(Response.summaryTables);
            SetNewLoadsTableRows(
              GenerateTableData('Rows', Response.loadsTable.rows)
            );
            SetNewLoadsTableColumns(
              GenerateTableData('Columns', Response.loadsTable.columns)
            );

            InitChart(
              Response.loadsPoints,
              Response.loadsPoints.map((Data) => {
                return Data[0];
              })
            );
            Chart.update('show');
          }
        ).catch(() => {
          message.warn('Нет данных для построения отчета.');
        });
      } else {
        if (Chart != null) {
          Chart.update('hide');
          SetNewSummaryTables([]);
          SetNewLoadsTableRows([]);
          SetNewLoadsTableColumns([]);
          SetNewLoadsTableSummary([]);
        } else {
          InitChart();
        }
      }
    };

    useEffect(RequestReport, [
      props.ProviderStore.CurrentTab.Options.CheckedTransportKeys,
      props.ProviderStore.CurrentTab.Options.StartDate,
      props.ProviderStore.CurrentTab.Options.EndDate,
    ]);

    return (
      <div
        className="FullExtend"
        style={{ display: 'grid', gridTemplateColumns: '3fr 1fr' }}
      >
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr' }}>
          <div style={{ height: '100%', width: '100%' }}>
            <strong>{GetReportTitle()}</strong>
            <canvas
              onDoubleClick={() => {
                Chart.resetZoom();
              }}
              ref={ChartRef}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
          <div>
            <Table
              summary={() => {
                return (
                  <Table.Summary fixed={true}>
                    {LoadsTableSummary.map((Row, Index) => {
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
              columns={LoadsTableColumns}
              dataSource={LoadsTableRows}
              pagination={false}
            />
          </div>
        </div>
        <div style={{ overflowY: 'auto', height: '500px' }}>
          {SummaryTables.map((ObjectTable, Index) => {
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
  })
);
export default LoadsReportComponent;
