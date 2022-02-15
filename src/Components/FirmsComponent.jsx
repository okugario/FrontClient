import * as React from "react";
import { useEffect, useState } from "react";
import { Button, Checkbox, message, Table, Input, Modal } from "antd";
import { ApiFetch } from "../Helpers/Helpers";
export default function FirmsComponent() {
  const [FirmsTable, SetNewFirmsTable] = useState();
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const InputRef = React.createRef();
  const RequestTable = () => {
    return ApiFetch("model/Firms", "GET", undefined, (Response) => {
      SetNewFirmsTable(
        Response.data.map((Firm, Index) => {
          if (Firm.Options == null) {
            Firm.Options = {};
          }
          Firm.Index = Index;
          Firm.Edit = false;

          return Firm;
        })
      );
    });
  };
  const SaveFirm = (Index) => {
    ApiFetch(
      `model/Firms${
        "Id" in FirmsTable[Index] ? `/${FirmsTable[Index].Id}` : ""
      }`,
      "Id" in FirmsTable[Index] ? "PATCH" : "POST",
      FirmsTable[Index],
      (Response) => {
        RequestTable();
      }
    );
  };
  const FirmsHandler = (Action, Data, Index) => {
    let NewFirmsTable = [...FirmsTable];
    switch (Action) {
      case "Edit":
        if (
          NewFirmsTable.some((Firm) => {
            return Firm.Edit;
          })
        ) {
          message.warn("Сохраните организацию");
        } else {
          NewFirmsTable[Index].Edit = true;
          SetNewFirmsTable(NewFirmsTable);
        }
        break;
      case "EditCancel":
        if ("Id" in NewFirmsTable[Index]) {
          ApiFetch(
            `model/Firms/${NewFirmsTable[Index].Id}`,
            "GET",
            undefined,
            (Response) => {
              Response.data.Edit = false;
              Response.data.Index = Index;
              NewFirmsTable[Index] = Response.data;
            }
          ).then(() => {
            SetNewFirmsTable(NewFirmsTable);
          });
        } else {
          NewFirmsTable.splice(Index, 1);
          SetNewFirmsTable(NewFirmsTable);
        }

        break;

      case "AddFirms":
        if (
          NewFirmsTable.some((Firm) => {
            return Firm.Edit;
          })
        ) {
          message.warn("Сохраните организацию");
        } else {
          NewFirmsTable.unshift({
            Caption: "",
            Own: false,
            Options: {},
            Edit: true,
            Index: NewFirmsTable.length,
          });
        }
        SetNewFirmsTable(NewFirmsTable);
        break;
      case "SaveFirm":
        if ("Id" in NewFirmsTable[Index]) {
          NewFirmsTable[Index].Caption = InputRef.current.input.value;
          SetNewFirmsTable(NewFirmsTable);
          SaveFirm(Index);
        } else {
          if (
            !NewFirmsTable.some((Object) => {
              return Object.Caption == InputRef.current.input.value;
            }) &&
            InputRef.current.input.value.length > 0
          ) {
            NewFirmsTable[Index].Caption = InputRef.current.input.value;
            SaveFirm(Index);
          } else {
            message.warning("Укажите другое наименование");
          }
        }

        break;
      case "DeleteFirm":
        if (
          "Id" in
          NewFirmsTable.find((Firm) => {
            return Firm.Index == Index;
          })
        ) {
          ApiFetch(
            `model/Firms/${
              NewFirmsTable.find((Firm) => {
                return Firm.Index == Index;
              }).Id
            }`,
            "DELETE",
            undefined,
            (Response) => {
              SetNewSelectedKey(null);
              RequestTable();
            }
          ).catch(() => {
            message.warn("Сначала удалите связанные объекты");
          });
        }
        break;
      case "ChangeCheckbox":
        if (
          NewFirmsTable.some((Firm) => {
            return Firm.Edit;
          })
        ) {
          message.warn("Сохраните организацию");
        } else {
          NewFirmsTable[Index].Edit = true;
          NewFirmsTable[Index].Own = Data;
          SetNewFirmsTable(NewFirmsTable);
        }
        break;
    }
  };
  useEffect(RequestTable, []);
  return (
    <>
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
            FirmsHandler("AddFirms");
          }}
        >
          Добавить
        </Button>
        <Button
          size="small"
          type="primary"
          danger
          onClick={() => {
            if (SelectedKey != null) {
              Modal.confirm({
                okText: "Удалить",
                cancelText: "Отмена",
                okButtonProps: {
                  size: "small",
                  type: "primary",
                  danger: true,
                },
                cancelButtonProps: { size: "small" },
                title: "Подтвердите действие",
                content: "Вы действительно хотите удалить организацию?",

                onOk: () => {
                  FirmsHandler("DeleteFirm", undefined, SelectedKey);
                },
              });
            }
          }}
        >
          Удалить
        </Button>
      </div>
      <Table
        pagination={false}
        rowKey="Index"
        rowSelection={{
          columnWidth: 0,
          selectedRowKeys: [SelectedKey],
          hideSelectAll: true,
          renderCell: () => {
            return null;
          },
        }}
        onRow={(Record, Index) => {
          return {
            onClick: () => {
              SetNewSelectedKey(Record["Index"]);
            },
            onDoubleClick: () => {
              FirmsHandler("Edit", Record["Index"], Index);
            },
          };
        }}
        scroll={{ y: 700 }}
        size="small"
        dataSource={FirmsTable}
        columns={[
          {
            title: "Наименование",
            dataIndex: "Caption",
            key: "Caption",
            render: (Text, Record, Index) => {
              if (Record.Edit) {
                return (
                  <Input
                    ref={InputRef}
                    defaultValue={Record["Caption"]}
                    size="small"
                    style={{ width: "150px" }}
                  />
                );
              } else {
                return <div style={{ cursor: "pointer" }}>{Text}</div>;
              }
            },
          },
          {
            title: "Внутренняя",
            dataIndex: "Own",
            key: "Own",
            render: (Value, Record, Index) => {
              if (Record.Edit) {
                return (
                  <>
                    <Checkbox
                      checked={Value}
                      onChange={(Event) => {
                        FirmsHandler(
                          "ChangeCheckbox",
                          Event.target.checked,
                          Index
                        );
                      }}
                    />
                    <Button
                      onClick={() => {
                        FirmsHandler("SaveFirm", undefined, Index);
                      }}
                      size="small"
                      type="primary"
                      style={{ marginLeft: "10px" }}
                    >
                      Сохранить
                    </Button>
                    <Button
                      size="small"
                      style={{ marginLeft: "10px" }}
                      onClick={() => {
                        FirmsHandler("EditCancel", undefined, Index);
                      }}
                    >
                      Отмена
                    </Button>
                  </>
                );
              } else {
                return (
                  <div style={{ cursor: "pointer" }}>
                    <Checkbox
                      checked={Value}
                      onChange={(Event) => {
                        FirmsHandler(
                          "ChangeCheckbox",
                          Event.target.checked,
                          Index
                        );
                      }}
                    />
                  </div>
                );
              }
            },
          },
        ]}
      />
    </>
  );
}
