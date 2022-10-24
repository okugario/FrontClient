import * as React from 'react';
import AccessRoleProfileComponent from './AccessRoleProfileComponent';
import { useEffect, useState } from 'react';
import { ApiFetch, AntDGenerateTreeData } from '../Helpers/Helpers';
import { Button, Table, Modal } from 'antd';
import { inject, observer } from 'mobx-react';

const AccessRolesComponent = inject('ProviderStore')(
  observer((props) => {
    const [RolesTable, SetNewRolesTable] = useState(null);
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [ShowProfile, SetNewShowProfile] = useState(false);
    const [AccessRoleProfile, SetNewAccessRoleProfile] = useState(null);
    const RequestRolesTable = () => {
      return ApiFetch('model/AccessRoles', 'GET', undefined, (Response) => {
        SetNewRolesTable(
          Response.data.map((Role) => {
            return {
              Rolename: Role.rolename,
              Comment: Role.comment,
            };
          })
        );
      });
    };
    const RequestRole = () => {
      let Profile = {};
      let PromiseArray = [];
      PromiseArray.push(
        ApiFetch(
          `model/AccessRoles/${SelectedKey}`,
          'GET',
          undefined,
          (Response) => {
            if (!('config_categories' in Response.data.options)) {
              Response.data.options.config_categories = [];
            }
            Profile.Profile = Response.data;
            Profile.Profile.new = false;
          }
        )
      );
      PromiseArray.push(
        ApiFetch('model/ConfigSchemes', 'GET', undefined, (Response) => {
          Profile.ConfigCategoriesAll = AntDGenerateTreeData(
            Response.data.find((Scheme) => {
              return Scheme.Caption == 'ApplicationMenu';
            }).Options.items,
            {
              ChildrensName: 'items',
              TitleName: 'caption',
              KeyName: 'id',
            }
          );
        })
      );
      PromiseArray.push(
        ApiFetch('model/Regions', 'GET', undefined, (Response) => {
          Profile.AllRegions = AntDGenerateTreeData(Response.data, {
            TitleName: 'Caption',
            KeyName: 'Id',
          });
        })
      );
      return Promise.all(PromiseArray).then(() => {
        SetNewAccessRoleProfile(Profile);
      });
    };
    const RoleProfileHandler = (Action, Data) => {
      let PromiseArray = [];
      let NewAccessRoleProfile =
        AccessRoleProfile != null
          ? { ...AccessRoleProfile }
          : {
              Profile: {
                new: true,
                rolename: '',
                comment: '',
                options: {
                  access: 'user',
                  config_categories: [],
                  config_regions: [],
                },
              },
            };

      switch (Action) {
        case 'ChangeCaption':
          NewAccessRoleProfile.Profile.rolename = Data;
          SetNewAccessRoleProfile(NewAccessRoleProfile);
          break;
        case 'ChangeComment':
          NewAccessRoleProfile.Profile.comment = Data;
          SetNewAccessRoleProfile(NewAccessRoleProfile);
          break;
        case 'ChangeCategories':
          NewAccessRoleProfile.Profile.options.config_categories = Data;
          SetNewAccessRoleProfile(NewAccessRoleProfile);
          break;
        case 'ChangeRegions':
          NewAccessRoleProfile.Profile.options.config_regions = Data;
          SetNewAccessRoleProfile(NewAccessRoleProfile);
          break;
        case 'AddRole':
          PromiseArray.push(
            ApiFetch('model/ConfigSchemes', 'GET', undefined, (Response) => {
              NewAccessRoleProfile.ConfigCategoriesAll = AntDGenerateTreeData(
                Response.data.find((Scheme) => {
                  return Scheme.Caption == 'ApplicationMenu';
                }).Options.items,
                {
                  ChildrensName: 'items',
                  TitleName: 'caption',
                  KeyName: 'id',
                }
              );
            })
          );
          PromiseArray.push(
            ApiFetch('model/Regions', 'GET', undefined, (Response) => {
              NewAccessRoleProfile.AllRegions = AntDGenerateTreeData(
                Response.data,
                {
                  TitleName: 'Caption',
                  KeyName: 'Id',
                }
              );
            })
          );
          Promise.all(PromiseArray).then(() => {
            SetNewAccessRoleProfile(NewAccessRoleProfile);
            SetNewShowProfile(true);
          });
          break;
        case 'SaveRoleProfile':
          ApiFetch(
            `model/AccessRoles${
              AccessRoleProfile.Profile.new
                ? ``
                : `/${AccessRoleProfile.Profile.rolename}`
            } `,
            AccessRoleProfile.Profile.new ? 'POST' : 'PATCH',
            AccessRoleProfile.Profile,
            (Response) => {
              RequestRolesTable().then(() => {
                SetNewShowProfile(false);
                SetNewAccessRoleProfile(null);
              });
            }
          );
          break;
        case 'DeleteRoles':
          ApiFetch(
            `model/AccessRoles/${SelectedKey}`,
            'DELETE',
            undefined,
            (Response) => {
              SetNewSelectedKey(null);
              RequestRolesTable();
            }
          );
          break;
      }
    };
    useEffect(RequestRolesTable, []);
    return (
      <>
        <Modal
          onOk={() => {
            RoleProfileHandler('SaveRoleProfile');
          }}
          maskClosable={false}
          onCancel={() => {
            SetNewAccessRoleProfile(null);
            SetNewShowProfile(false);
          }}
          destroyOnClose={true}
          title="Профиль роли"
          cancelButtonProps={{ size: 'small' }}
          okButtonProps={{ size: 'small', type: 'primary' }}
          visible={ShowProfile}
          okText="Сохранить"
        >
          <AccessRoleProfileComponent
            Profile={AccessRoleProfile}
            RoleProfileHandler={RoleProfileHandler}
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
              RoleProfileHandler('AddRole');
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
                Modal.confirm({
                  okText: 'Удалить',
                  onOk: () => {
                    RoleProfileHandler('DeleteRoles');
                  },
                  cancelText: 'Отмена',
                  okButtonProps: {
                    size: 'small',
                    danger: true,
                    type: 'primary',
                  },
                  cancelButtonProps: { size: 'small' },
                  title: 'Подтвердите действие',
                  content: 'Вы действительно хотите удалить объект',
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
                SetNewSelectedKey(Record.Rolename);
              },
              onDoubleClick: () => {
                RequestRole().then(() => {
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
          scroll={{ y: 700 }}
          pagination={false}
          rowKey="Rolename"
          dataSource={RolesTable}
          size="small"
          columns={[
            {
              title: 'Роль',
              dataIndex: 'Rolename',
              key: 'Rolename',
              render: (Value, Record, index) => {
                return <div style={{ cursor: 'pointer' }}>{Value}</div>;
              },
            },
            {
              title: 'Описание',
              dataIndex: 'Comment',
              key: 'Comment',
              render: (Value, Record, index) => {
                return <div style={{ cursor: 'pointer' }}>{Value}</div>;
              },
            },
          ]}
        />
      </>
    );
  })
);
export default AccessRolesComponent;
