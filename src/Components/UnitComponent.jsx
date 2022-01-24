import * as React from "react";
import { useState, useEffect } from "react";
import { Modal, Table } from "antd";
import TableButtonComponent from "./TableButtonComponent";
import UnitProfileComponent from "./UnitProfileComponent";
import { ApiFetch } from "../Helpers/Helpers";
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
    ApiFetch("model/Units", "GET", undefined, (Response) => {
      SetNewUnitsTable(Response.data);
    });
  };
  const RequestUnitProfile = () => {
    let Profile = {};
    let PromiseArray = [];
    PromiseArray.push(
      ApiFetch(`model/Units/${SelectedKey}`, "GET", undefined, (Response) => {
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
    return Promise.all(PromiseArray).then(() => {
      SetNewUnitProfile(Profile);
    });
  };

  const UnitProfileHandler = (Action, Data) => {
    let NewUnitProfile = { ...UnitProfile };
    switch (Action) {
      case "ChangeUnitType":
        NewUnitProfile.Profile.UnitTypeId = Data;
        SetNewUnitProfile(NewUnitProfile);
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
          },
          {
            title: "Тип агрегата",
            dataIndex: "UnitType",
            key: "UnitType",
            render: (Value, Record, Index) => {
              return Record.UnitType.Caption;
            },
          },
        ]}
      />
    </>
  );
}
