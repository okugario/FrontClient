import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import WorkConditionsProfileComponent from './WorkConditionsProfileComponent';
import { ApiFetch } from '../Helpers/Helpers';
export default function WorkConditionsComponent(props) {
  const [WorkConditionsTable, SetNewWorkConditionsTable] = useState([]);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [WorkConditionsProfile, SetNewWorkConditionsProfile] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const RequestWorkConditionsProfile = () => {
    return ApiFetch(
      `model/WorkConditions/${SelectedKey}`,
      'GET',
      undefined,
      (Response) => {
        SetNewWorkConditionsProfile({ Profile: Response.data });
      }
    );
  };
  const RequestTable = () => {
    ApiFetch('model/WorkConditions', 'GET', undefined, (Response) => {
      SetNewWorkConditionsTable(Response.data);
    });
  };
  useEffect(RequestTable, []);
  return (
    <>
      <Modal
        onCancel={() => {
          SetNewShowProfile(false);
        }}
        title="Профиль условий"
        width="450px"
        visible={ShowProfile}
        okButtonProps={{ size: 'small', type: 'primary' }}
        okText="Сохранить"
        maskClosable={false}
        cancelButtonProps={{ size: 'small' }}
        cancelText="Отмена"
      >
        <WorkConditionsProfileComponent Profile={WorkConditionsProfile} />
      </Modal>
      <div
        style={{
          width: '200px',
          display: 'flex',
          justifyContent: 'space-evenly',
          marginBottom: '5px',
        }}
      >
        <Button size="small" type="primary" onClick={() => {}}>
          Добавить
        </Button>
        <Button
          size="small"
          danger
          type="primary"
          onClick={() => {
            if (SelectedKey != null) {
              Modal.confirm({
                okText: 'Удалить',
                cancelText: 'Отмена',
                okButtonProps: {
                  size: 'small',
                  type: 'primary',
                  danger: true,
                },
                cancelButtonProps: { size: 'small' },
                title: 'Подтвердите действие',
                content: 'Вы действительно хотите удалить объект?',

                onOk: () => {},
              });
            }
          }}
        >
          Удалить
        </Button>
      </div>
      <Table
        onRow={(Record) => {
          return {
            onClick: () => {
              SetNewSelectedKey(Record['Id']);
            },
            onDoubleClick: () => {
              RequestWorkConditionsProfile().then(() => {
                SetNewShowProfile(true);
              });
            },
          };
        }}
        rowSelection={{
          columnWidth: 0,
          selectedRowKeys: [SelectedKey],
          hideSelectAll: true,
          renderCell: () => {
            return null;
          },
        }}
        scroll={{ scrollToFirstRowOnChange: true, y: 700 }}
        pagination={false}
        rowKey="Id"
        dataSource={WorkConditionsTable}
        size="small"
        columns={[
          {
            title: 'Наименование',
            key: 'Caption',
            dataIndex: 'Caption',
            render: (Value) => {
              return <div style={{ cursor: 'pointer' }}>{Value}</div>;
            },
          },
        ]}
      />
    </>
  );
}
