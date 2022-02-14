import { Button, Checkbox, DatePicker, Table, Select } from "antd";
import { useState, useEffect } from "react";
import * as React from "react";
import Moment from "moment";
import { ApiFetch } from "../Helpers/Helpers";

export default function ReportComponent() {
  const [ReportTable, SetNewReportTable] = useState();
  const [Time, SetNewTime] = useState(Moment());
  const [SelectedKey, SetNewSelectedKey] = useState([]);
  const RequestTable = () => {
    ApiFetch("http://localhost:3000/Report", "GET", undefined, (Response) => {
      SetNewReportTable(
        Response.map((Object, Index) => {
          Object.Index = Index;
          return Object;
        })
      );
    });
  };
  const SelectedRows = (Index, Checked) => {
    let NewSelectedKeys = [...SelectedKey];
    if (Checked == true) {
      NewSelectedKeys.push(Index);
    } else {
      NewSelectedKeys.splice(
        NewSelectedKeys.findIndex((FindIndex) => {
          return FindIndex == Index;
        }),
        1
      );
    }
    SetNewSelectedKey(NewSelectedKeys);
  };
  const TestFunc = (Data) => {
    switch (Data) {
      case "extern":
        return "Внешний";
      case "notdef":
        return "Не указано";
      case "tk":
        return "ТК";
    }
  };

  const { RangePicker } = DatePicker;
  useEffect(RequestTable, []);
  return (
    <>
      <div
        style={{
          width: "600px",
          display: "flex",
          marginBottom: "5px",
          justifyContent: "space-evenly",
        }}
      >
        <Button size="small" type="primary">
          Выгрузить в CSV
        </Button>
        <RangePicker
          size="small"
          value={Time}
          onChange={(Moment) => {
            SetNewTime(Moment);
          }}
          picker="month"
        />
        <Button size="small" type="primary">
          Загрузить
        </Button>
      </div>
      <Table
        pagination={false}
        rowSelection={{
          columnWidth: 0,
          selectedRowKeys: SelectedKey,
          hideSelectAll: true,
          renderCell: () => {
            return null;
          },
        }}
        rowKey="Index"
        size="small"
        scroll={{ y: 700, x: 1000 }}
        dataSource={ReportTable}
        columns={[
          {
            title: "",
            dataIndex: "Checkbox",
            key: "Checkbox",
            render: (Value, Record, Index) => {
              return (
                <Checkbox
                  onChange={(Event) => {
                    SelectedRows(Index, Event.target.checked);
                  }}
                />
              );
            },
          },
          {
            title: "Тип компании",
            dataIndex: "TypeCompany",
            key: "TypeCompany",
            render: (Value, Record, Index) => {
              return <div>{(Value, TestFunc(Value))}</div>;
            },
          },
          { title: "Номер терминала", dataIndex: "Terminal", Key: "Terminal" },
          { title: "Машина", dataIndex: "Vehicle", key: "Vehicle" },
          {
            title: "Январь",
            dataIndex: "January",
            key: "January",
            render: (Value, Record, Index) => {
              return Value == 0 ? "Выключен" : "Включен";
            },
          },
          {
            title: "Февраль",
            dataIndex: "February",
            key: "February",
            render: (Value, Record, Index) => {
              return Value == 0 ? "Выключен" : "Включен";
            },
          },
          {
            title: "Март",
            dataIndex: "March",
            key: "March",
            render: (Value, Record, Index) => {
              return Value == 0 ? "Выключен" : "Включен";
            },
          },
          {
            title: "Апрель",
            dataIndex: "April",
            key: "April",
            render: (Value, Record, Index) => {
              return Value == 0 ? "Выключен" : "Включен";
            },
          },
          {
            title: "Май",
            dataIndex: "May",
            key: "May",
            render: (Value, Record, Index) => {
              return Value == 0 ? "Выключен" : "Включен";
            },
          },
          {
            title: "Июнь",
            dataIndex: "June",
            key: "June",
            render: (Value, Record, Index) => {
              return Value == 0 ? "Выключен" : "Включен";
            },
          },
          {
            title: "Июль",
            dataIndex: "July",
            key: "July",
            render: (Value, Record, Index) => {
              return Value == 0 ? "Выключен" : "Включен";
            },
          },
          {
            title: "Август",
            dataIndex: "August",
            key: "August",
            render: (Value, Record, Index) => {
              return Value == 0 ? "Выключен" : "Включен";
            },
          },
          {
            title: "Сентябрь",
            dataIndex: "September",
            key: "September",
            render: (Value, Record, Index) => {
              return Value == 0 ? "Выключен" : "Включен";
            },
          },
          {
            title: "Октябрь",
            dataIndex: "October",
            key: "October",
            render: (Value, Record, Index) => {
              return Value == 0 ? "Выключен" : "Включен";
            },
          },
          {
            title: "Ноябрь",
            dataIndex: "November",
            key: "November",
            render: (Value, Record, Index) => {
              return Value == 0 ? "Выключен" : "Включен";
            },
          },
          {
            title: "Декабрь",
            dataIndex: "December",
            key: "December",
            render: (Value, Record, Index) => {
              return Value == 0 ? "Выключен" : "Включен";
            },
          },
        ]}
      />
    </>
  );
}
