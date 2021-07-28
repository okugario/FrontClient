import * as React from 'react';
import { useState, useEffect } from 'react';
import { Table, Modal, Button, message } from 'antd';
import { TableSorter, ApiFetch } from '../Helpers/Helpers';
import RetranslationProfile from './RetranslationProfile';
import Moment from 'moment';
import { inject, observer } from 'mobx-react';
const RetranslationComponent = inject('ProviderStore')(
  observer((props) => {
    const [RetranslationTable, SetNewTable] = useState(null);
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [ShowProfile, SetNewShowProfile] = useState(false);
    const [ShowDeleteModal, SetNewShowDeleteModal] = useState(false);
    const [Profile, SetNewProfile] = useState(null);
    const RequestProfile = () => {
      ApiFetch(
        `model/RetransTargets/${SelectedKey}`,
        'GET',
        undefined,
        (Response) => {
          SetNewProfile(Response.data);
          SetNewShowProfile(true);
        }
      );
    };
    const RetranslationHandler = (Operation, Data, ObjectKey) => {
      let NewObjects = Profile != null ? [...Profile.Objects] : [];
      let NewProfile = Profile != null ? { ...Profile } : null;
      switch (Operation) {
        case 'AddRetranslation':
          SetNewProfile({
            Caption: '',
            Active: false,
            Options: {
              Protocol: { Limit: 50, Name: 'WialonIPS', Pause: 30, Ver: 1 },
              Url: '',
            },
            Objects: [],
          });
          SetNewShowProfile(true);
          break;
        case 'ChangeCaption':
          NewProfile.Caption = Data;
          SetNewProfile(NewProfile);
          break;
        case 'ChangeActive':
          NewProfile.Active = Data;
          SetNewProfile(NewProfile);
          break;
        case 'ChangeUrl':
          NewProfile.Options.Url = Data;
          SetNewProfile(NewProfile);
          break;
        case 'ChangeProtocolName':
          NewProfile.Options.Protocol.Name = Data;
          SetNewProfile(NewProfile);
          break;
        case 'ChangeProtocolVersion':
          NewProfile.Options.Protocol.Ver = Data;
          SetNewProfile(NewProfile);
          break;
        case 'ChangeProtocolLimit':
          NewProfile.Options.Protocol.Limit = Data;
          SetNewProfile(NewProfile);
          break;
        case 'ChangeProtocolPause':
          NewProfile.Options.Protocol.Pause = Data;
          SetNewProfile(NewProfile);
          break;
        case 'AddObject':
          if (NewObjects[0] == undefined || NewObjects[0].ObjectId != '0') {
            NewObjects.unshift({
              TargetId: NewProfile.Id,
              ObjectId: '0',
              LastTs: Moment().unix(),
            });
            NewProfile.Objects = NewObjects;
            SetNewProfile(NewProfile);
          } else {
            message.error('Сохраните объект');
          }

          break;
        case 'SaveObject':
          if (
            Data != '0' &&
            NewObjects.every((Objects) => {
              return Objects.ObjectId != Data;
            })
          ) {
            NewObjects[0].ObjectId = Data;
            NewProfile.Objects = NewObjects;
            SetNewProfile(NewProfile);
          } else {
            message.error('Укажите корректный ID');
          }

          break;
        case 'ChangeObjectTime':
          NewObjects.find((Object) => {
            return Object.ObjectId == ObjectKey;
          }).LastTs = Data;
          NewProfile.Objects = NewObjects;
          SetNewProfile(NewProfile);

          break;
        case 'DeleteObject':
          NewObjects.splice(
            NewObjects.findIndex((Object) => {
              return Object.ObjectId == ObjectKey;
            }),
            1
          );
          NewProfile.Objects = NewObjects;
          SetNewProfile(NewProfile);
          break;
        case 'DeleteRetranslation':
          if (SelectedKey != null) {
            let NewRetranslationTable = [...RetranslationTable];
            NewRetranslationTable.splice(
              RetranslationTable.findIndex((Retranslation) => {
                return Retranslation.Id == SelectedKey;
              }),
              1
            );
            SetNewSelectedKey(null);
            ApiFetch(
              `model/RetransTargets/${SelectedKey}`,
              'DELETE',
              undefined,
              () => {
                SetNewTable(NewRetranslationTable);
                SetNewShowDeleteModal(false);
              }
            );
          }

          break;
        case 'SaveProfile':
          if (
            Profile.Caption.length != 0 &&
            Profile.Options.Url.length != 0 &&
            Profile.Options.Protocol.Limit != 0 &&
            Profile.Options.Protocol.Pause != 0
          ) {
            ApiFetch(
              'Id' in Profile
                ? `model/RetransTargets/${SelectedKey}`
                : `model/RetransTargets`,
              'Id' in Profile ? 'PATCH' : 'POST',
              Profile,
              (Response) => {
                RequestTable().then(() => {
                  SetNewShowProfile(false);
                });
              }
            );
          } else {
            message.error('Полностью заполните профиль');
          }
          break;
      }
    };
    const RequestTable = () => {
      if (
        props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id ==
        'RetransTargets'
      ) {
        return ApiFetch(
          'model/RetransTargets',
          'GET',
          undefined,
          (Response) => {
            SetNewTable(Response.data);
          }
        );
      }
    };
    useEffect(RequestTable, [
      props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id,
    ]);
    return (
      <div className="FullExtend">
        <Modal
          visible={ShowDeleteModal}
          onCancel={() => {
            SetNewShowDeleteModal(false);
          }}
          title="Подтвердите действие"
          okButtonProps={{ size: 'small' }}
          cancelButtonProps={{ size: 'small' }}
          onOk={() => {
            RetranslationHandler('DeleteRetranslation');
          }}
        >
          Вы действительно хотите удалить ретранслятор?
        </Modal>
        <Modal
          okText="Сохранить"
          width="450px"
          maskClosable={false}
          title="Профиль ретранслятора"
          visible={ShowProfile}
          onCancel={() => {
            SetNewShowProfile(false);
          }}
          okButtonProps={{ size: 'small' }}
          cancelButtonProps={{ size: 'small' }}
          onOk={() => {
            RetranslationHandler('SaveProfile');
          }}
        >
          <RetranslationProfile
            Profile={Profile}
            RetranslationHandler={RetranslationHandler}
          />
        </Modal>
        <div
          style={{
            width: '200px',
            display: 'flex',
            justifyContent: 'space-evenly',
            marginBottom: '5px',
          }}
        >
          <Button
            size="small"
            type="primary"
            onClick={() => {
              RetranslationHandler('AddRetranslation');
            }}
          >
            Добавить
          </Button>
          <Button
            size="small"
            danger
            type="primary"
            onClick={() => {
              if (SelectedKey != null) {
                SetNewShowDeleteModal(true);
              }
            }}
          >
            Удалить
          </Button>
        </div>
        <Table
          scroll={{ y: 700 }}
          rowKey="Id"
          size="small"
          dataSource={RetranslationTable}
          pagination={false}
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
                SetNewSelectedKey(Record['Id']);
              },
              onDoubleClick: () => {
                RequestProfile();
              },
            };
          }}
          columns={[
            {
              defaultSortOrder: 'ascend',
              sorter: TableSorter('Caption'),
              title: 'Наименование',
              dataIndex: 'Caption',
              key: 'Caption',
              render: (Record) => {
                return <div style={{ cursor: 'pointer' }}>{Record}</div>;
              },
            },
            {
              title: 'Включен',
              dataIndex: 'Active',
              key: 'Active',
              render: (Record) => {
                return (
                  <div style={{ cursor: 'pointer' }}>
                    {Record ? 'Да' : 'Нет'}
                  </div>
                );
              },
            },
          ]}
        />
      </div>
    );
  })
);
export default RetranslationComponent;
