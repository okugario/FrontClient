import * as React from "react";
import { useState, useEffect } from "react";
import { Select, DatePicker, Table, Input, Button } from "antd";
import Moment from "moment";
import { CloseOutlined } from "@ant-design/icons";

export default function UnitProfile(props) {
  const [SelectedKey, SetNewSelectedKey] = useState(0);
  const UniversalGetter = (Feeld) => {
    return props.Profile.Profile.UnitHistory[SelectedKey][Feeld];
  };
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
            value={UniversalGetter("Caption")}
            onChange={(Event) => {
              props.UnitProfileHandler(
                "ChangeUnitCaption",
                Event.target.value,
                SelectedKey
              );
            }}
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
            disabled={props.Profile.Profile.UnitHistory != null}
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
          <Select
            options={props.Profile.AllStates}
            value={UniversalGetter("UnitStateId")}
            onChange={(Value) => {
              props.UnitProfileHandler("ChangeUnitState", Value, SelectedKey);
            }}
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
        <div style={{ display: "flex", alignItems: "center" }}>Транспорт</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Select
            options={props.Profile.AllVehicles}
            value={UniversalGetter("VehicleId")}
            onChange={(Value) => {
              props.UnitProfileHandler("ChangeUnitVehicle", Value, SelectedKey);
            }}
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
        <div style={{ display: "flex", alignItems: "center" }}>Дата</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <DatePicker
            value={Moment(props.Profile.Profile.UnitHistory[0].TS)}
            onChange={(Moment) => {
              props.UnitProfileHandler("ChangeUnitDate", Moment, SelectedKey);
            }}
            format="DD.MM.YYYY HH:mm:ss"
            size="small"
          />
        </div>
      </div>
      <div
        style={{
          paddingBottom: "10px",
        }}
      >
        <Table
          title={() => (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>История перемещений</div>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  SetNewSelectedKey(0);
                  props.UnitProfileHandler("AddUnitSnapshot");
                }}
              >
                Добавить
              </Button>
            </div>
          )}
          scroll={{ y: 700 }}
          bordered
          size="small"
          rowKey="Key"
          rowSelection={{
            selectedRowKeys: [SelectedKey],
            columnWidth: 1,
            hideSelectAll: true,
            renderCell: () => {
              return null;
            },
          }}
          onRow={(Record, Index) => {
            return {
              onClick: () => {
                SetNewSelectedKey(Index);
              },
            };
          }}
          pagination={false}
          dataSource={props.Profile.Profile.UnitHistory.map(
            (Snapshot, Index) => {
              Snapshot.Key = Index;
              return Snapshot;
            }
          )}
          columns={[
            {
              title: "Дата",
              dataIndex: "TS",
              key: "TS",
              render: (Value, Record, Index) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {Moment(Value).format("DD.MM.YYYY HH:mm:ss")}
                    <CloseOutlined
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  </div>
                );
              },
            },
          ]}
        />
      </div>
    </>
  );
}
