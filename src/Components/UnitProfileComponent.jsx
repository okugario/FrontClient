import * as React from "react";
import { Select, DatePicker, Table, Input } from "antd";

export default function UnitProfile(props) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          Наименование:
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input
            value={props.Profile.Profile.Caption}
            style={{ width: "200px" }}
            size="small"
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>Тип:</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Select
            options={props.Profile.AllUnitType}
            value={props.Profile.Profile.UnitTypeId}
            onChange={(Value) => {
              props.UnitProfileHandler("ChangeUnitType", Value);
            }}
            size="small"
            style={{ width: "200px" }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>Состояние</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Select size="small" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>Транспорт</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Select size="small" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>Дата с:</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <DatePicker size="small" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>Дата по:</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <DatePicker size="small" />
        </div>
      </div>
      <div
        style={{
          paddingBottom: "10px",
        }}
      >
        <Table
          title={() => (
            <div style={{ textAlign: "center" }}>История перемещений</div>
          )}
          bordered
          size="small"
          scroll={{ y: "500px" }}
          pagination={false}
          //dataSource={}
          columns={[
            { title: "Транспорт", dataIndex: "Vehicle", key: "Vehicle" },
            { title: "Дата с:", dataIndex: "StartDate", key: "StartDate" },
            { title: "Дата по:", dataIndex: "EndDate", key: "EndDate" },
          ]}
        />
      </div>
    </>
  );
}
