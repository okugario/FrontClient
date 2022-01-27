import * as React from "react";
import { useState, useEffect } from "react";
import { Modal, Table } from "antd";
import TableButtonComponent from "./TableButtonComponent";
import UnitProfileComponent from "./UnitProfileComponent";
import { ApiFetch } from "../Helpers/Helpers";
import Moment from "moment";

export default function UnitMoveComponent() {
  const [UnitsTable, SetNewUnitsTable] = useState();
  const [UnitProfile, SetNewUnitProfile] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState();
  const [ShowUnit, SetNewShowUnit] = useState(false);

  const DeleteUnit = () => {
    if (SelectedKey != null) {
      Modal.confirm({
        okText: "Удалить",
        onOk: () => {
          console.log("Отработало");
        },
        cancelText: "Отмена",
        title: "Подтвердите действие",
        content: "Вы действительно хотите удалить объект?",
        okButtonProps: { size: "small", danger: true, type: "primary" },
        cancelButtonProps: { size: "small" },
      });
    }
  };
  const RequestUnitTable = () => {
    return ApiFetch("model/Units", "GET", undefined, (Response) => {
      SetNewUnitsTable(Response.data);
    });
  };
  const RequestUnitProfile = () => {
    let Profile = {};
    let PromiseArray = [];
    PromiseArray.push(
      ApiFetch(`model/Units/${SelectedKey}`, "GET", undefined, (Response) => {
        Response.data.UnitHistory.map((UnitSnapshot) => {
          UnitSnapshot.New = false;
          return UnitSnapshot;
        });
        Profile.Profile = Response.data;
      })
    );
    PromiseArray.push(
      ApiFetch("model/UnitTypes", "GET", undefined, (Response) => {
        Profile.AllUnitType = Response.data.map((Type) => {
          return { value: Type.Id, label: Type.Caption };
        });
      })
    );
    PromiseArray.push(
      ApiFetch("model/UnitStates", "GET", undefined, (Response) => {
        Profile.AllStates = Response.data.map((State) => {
          return { value: State.Id, label: State.Caption };
        });
      })
    );
    PromiseArray.push(
      ApiFetch("model/Vehicles", "GET", undefined, (Response) => {
        Profile.AllVehicles = Response.data.map((Vehicle) => {
          return { value: Vehicle.Id, label: Vehicle.Caption };
        });
      })
    );
    return Promise.all(PromiseArray).then(() => {
      SetNewUnitProfile(Profile);
    });
  };

  const UnitProfileHandler = (Action, Data, Key) => {
    let NewUnitProfile = { ...UnitProfile };
    let PromiseArray = [];
    switch (Action) {
      case "ChangeUnitCaption":
        NewUnitProfile.Profile.UnitHistory[Key].Caption = Data;
        SetNewUnitProfile(NewUnitProfile);
        break;
      case "ChangeUnitType":
        NewUnitProfile.Profile.UnitTypeId = Data;
        SetNewUnitProfile(NewUnitProfile);
        break;
      case "ChangeUnitState":
        NewUnitProfile.Profile.UnitHistory[Key].UnitStateId = Data;
        SetNewUnitProfile(NewUnitProfile);
        break;
      case "ChangeUnitVehicle":
        NewUnitProfile.Profile.UnitHistory[Key].VehicleId = Data;
        SetNewUnitProfile(NewUnitProfile);
        break;
      case "ChangeUnitDate":
        NewUnitProfile.Profile.UnitHistory[Key].TS = Data.format();
        SetNewUnitProfile(NewUnitProfile);
        break;
      case "AddUnitSnapshot":
        NewUnitProfile.Profile.UnitHistory.unshift({
          New: true,
          Caption: "",
          TS: Data,
          UnitStateId: NewUnitProfile.AllStates.find((State) => {
            return State.label == "-";
          }).value,
          VehicleId: NewUnitProfile.AllVehicles[0].value,
        });
        SetNewUnitProfile(NewUnitProfile);

        break;
      case "SaveUnit":
        ApiFetch(
          `model/Units${
            "Id" in NewUnitProfile.Profile
              ? ""
              : `/${NewUnitProfile.Profile.Id}`
          }`,
          "Id" in NewUnitProfile.Profile ? "PATCH" : "POST",
          NewUnitProfile.Profile,
          (Response) => {}
        ).then(() => {
          NewUnitProfile.Profile.UnitHistory.forEach((UnitSnapshot) => {
            PromiseArray.push(
              ApiFetch(
                "model/UnitHistory",
                UnitSnapshot.New ? "POST" : "PATCH",
                UnitSnapshot,
                () => {}
              )
            );
          });
          Promise.all(PromiseArray).then(() => {
            RequestUnitTable().then(() => {
              SetNewShowUnit(false);
            });
          });
        });
        break;
    }
  };
  useEffect(RequestUnitTable, []);
  return (
    <>
      <Modal
        destroyOnClose={true}
        maskClosable={false}
        okButtonProps={{ size: "small", type: "primary" }}
        cancelButtonProps={{ size: "small" }}
        title="Профиль агрегата"
        visible={ShowUnit}
        onCancel={() => {
          SetNewShowUnit(false);
          SetNewUnitProfile(null);
        }}
        onOk={() => {
          {
            UnitProfileHandler("SaveUnit");
            SetNewShowUnit(false);
          }
        }}
        okText="Сохранить"
      >
        <UnitProfileComponent
          Profile={UnitProfile}
          UnitProfileHandler={UnitProfileHandler}
        />
      </Modal>
      <TableButtonComponent
        onDelete={() => {
          DeleteUnit();
        }}
      />
      <Table
        scroll={{ y: 700 }}
        pagination={false}
        size="small"
        dataSource={UnitsTable}
        rowKey="Id"
        rowSelection={{
          columnWidth: 0,
          selectedRowKeys: [SelectedKey],
          hideSelectAll: true,
          renderCell: () => {
            return null;
          },
        }}
        onRow={(Record) => {
          return {
            onClick: () => {
              SetNewSelectedKey(Record["Id"]);
            },
            onDoubleClick: () => {
              RequestUnitProfile().then(() => {
                SetNewShowUnit(true);
              });
            },
          };
        }}
        columns={[
          {
            title: "Наименование",
            dataIndex: "Caption",
            key: "Caption",
            render: (Value, Record, Index) => {
              return <div style={{ cursor: "pointer" }}>{Value}</div>;
            },
          },
          {
            title: "Тип агрегата",
            dataIndex: "UnitType",
            key: "UnitType",
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: "pointer" }}>
                  {Record.UnitType.Caption}
                </div>
              );
            },
          },
        ]}
      />
    </>
  );
}
