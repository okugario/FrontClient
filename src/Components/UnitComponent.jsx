import * as React from "react";
import { useState } from "react";
import { Modal, Table } from "antd";
import TableButtonComponent from "./TableButtonComponent";
import UnitProfileComponent from "./UnitProfileComponent";
export default function UnitMoveComponent() {
  const [UnitsTable, SetNewUnitsTable] = useState();
  const [UnitProfile, SetNewUnitProfile] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState();
  const [ShowUnit, SetNewShowUnit] = useState(true);

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
            SetNewShowProfile(false);
          }
        }}
        okText="Сохранить"
      >
        <UnitProfileComponent Profile={UnitProfile} />
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
              SetNewSelectedKey(Record["Caption"]);
            },
            onDoubleClick: () => {
              SetNewShowProfile(true);
            },
          };
        }}
        columns={[
          { title: "Агрегат", dataIndex: "Unit", key: "Unit" },
          { title: "Наименование", dataIndex: "Caption", key: "Caption" },
        ]}
      />
    </>
  );
}
