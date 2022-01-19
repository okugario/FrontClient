import * as React from "react";
import { useState } from "react";
import { Modal, Select, Table } from "antd";
import TableButtonComponent from "./TableButtonComponent";
export default function UnitMoveComponent() {
  const [UnitsTable, SetNewUnitsTable] = useState();
  const [SelectedKey, SetNewSelectedKey] = useState();

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
        columns={[
          { title: "Агрегат", dataIndex: "Unit", key: "Unit" },
          { title: "Состояние", dataIndex: "UnitState", key: "UnitState" },
          { title: "Транспорт", dataIndex: "Transport", key: "Transport" },
          { title: "Дата с:", dataIndex: "FirstDate", key: "FirstDate" },
          { title: "Дата по:", dataIndex: "SecondDate", key: "SecondDate" },
        ]}
      />
    </>
  );
}
