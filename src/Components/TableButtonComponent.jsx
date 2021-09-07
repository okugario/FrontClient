import React from "react";
import "antd/dist/antd.css";
import { Button } from "antd";
export default function TableButtonComponent(props) {
  return (
    <div
      style={{
        width: "200px",
        display: "flex",
        justifyContent: "space-evenly",
        marginBottom: "5px",
      }}
    >
      <Button
        size="small"
        type="primary"
        onClick={() => {
          props.onAdd();
        }}
      >
        Добавить
      </Button>
      <Button
        size="small"
        type="primary"
        danger="true"
        onClick={(Event) => {
          props.onDelete();
        }}
      >
        Удалить
      </Button>
    </div>
  );
}
