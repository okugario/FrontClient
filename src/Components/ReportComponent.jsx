import { Button, Checkbox, DatePicker, Table } from "antd";
import { useState, useEffect } from "react";
import * as React from "react";
import Moment from "moment";
import { ApiFetch } from "../Helpers/Helpers";

export default function ReportComponent() {
  const [ReportTable, SetNewReportTable] = useState();
  const [StardDate, SetNewStardDate] = useState(Moment());
  const [EndDate, SetNewEndDate] = useState(Moment());
  const [SelectedKey, SetNewSelectedKey] = useState(null);

  const ReportHandler = (Action, Data) => {};
  return (
    <>
      <div
        style={{
          width: "500px",
          display: "flex",
          marginBottom: "5px",
          justifyContent: "space-evenly",
        }}
      >
        <Button size="small" type="primary">
          Выгрузить в CSV
        </Button>
        <DatePicker
          value={StardDate}
          format="DD.MM.YYYY"
          size="small"
          picker="date"
          onChange={(Moment) => {
            SetNewStardDate(Moment);
          }}
        />
        <DatePicker
          value={EndDate}
          format="DD.MM.YYYY"
          size="small"
          picker="date"
          onChange={(Moment) => {
            SetNewEndDate(Moment);
          }}
        />
      </div>
      <Table
        pagination={false}
        rowSelection={{
          columnWidth: 0,
          selectedRowKeys: [SelectedKey],
          hideSelectAll: true,
          renderCell: () => {
            return null;
          },
        }}
        size="small"
        scroll={{ y: 700, x: 700 }}
        dataSource={ReportTable}
        columns={[
          {
            title: "",
            dataIndex: "Checkbox",
            key: "Checkbox",
            render: (Value, Record, Index) => {
              return <Checkbox>{Value}</Checkbox>;
            },
          },
          { title: "Номер терминала", dataIndex: "Terminal", Key: "Terminal" },
          { title: "Январь", dataIndex: "January", key: "January" },
          { title: "Февраль", dataIndex: "February", key: "February" },
          { title: "Март", dataIndex: "March", key: "March" },
          { title: "Апрель", dataIndex: "April", key: "April" },
          { title: "Май", dataIndex: "May", key: "May" },
          { title: "Июнь", dataIndex: "June", key: "June" },
          { title: "Июль", dataIndex: "July", key: "July" },
          { title: "Август", dataIndex: "August", key: "August" },
          { title: "Сентябрь", dataIndex: "September", key: "September" },
          { title: "Октябрь", dataIndex: "October", key: "October" },
          { title: "Ноябрь", dataIndex: "November", key: "November" },
          { title: "Декабрь", dataIndex: "December", key: "December" },
        ]}
      />
    </>
  );
}
