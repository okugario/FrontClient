import * as React from 'react';
import { Table, Modal, message } from 'antd';
import { useState, useEffect } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import UserProfileComponent from '../Components/UserProfileComponent';
import TableButtonComponent from '../Components/TableButtonComponent';
import Bcrypt from 'bcryptjs';
import Moment from 'moment';

export default function UsersComponent(props) {
  const [UsersTable, SetNewUsersTable] = useState();
  const [SelectedKey, SetNewSelectedKey] = useState();
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [UserProfile, SetNewUserProfile] = useState(null);

  const RequestTable = () => {
    return ApiFetch('model/Users', 'GET', undefined, (Response) => {
      SetNewUsersTable(Response.data);
    });
  };
  const RequestProfile = () => {
    let Profile = {};
    let PromiseArray = [];
    PromiseArray.push(
      ApiFetch(`model/Users/${SelectedKey}`, 'GET', undefined, (Response) => {
        Profile.Profile = Response.data;
      })
    );
    PromiseArray.push(
      ApiFetch('model/AccessRoles', 'GET', undefined, (Response) => {
        Profile.AllRoles = Response.data.map((Role) => {
          return {
            value: Role.rolename,
            label: Role.rolename,
          };
        });
      })
    );
    return Promise.all(PromiseArray).then(() => {
      SetNewUserProfile(Profile);
    });
  };
  const UserProfileHandler = (Action, Data) => {
    let NewUserProfile = { ...UserProfile };
    switch (Action) {
      case 'ChangeUsername':
        NewUserProfile.Profile.Username = Data;
        SetNewUserProfile(NewUserProfile);
        break;
      case 'ChangeRolename':
        NewUserProfile.Profile.Rolename = Data;
        SetNewUserProfile(NewUserProfile);
        break;
      case 'ChangeEnabled':
        NewUserProfile.Profile.Enabled = Data;
        SetNewUserProfile(NewUserProfile);
        break;
      case 'ChangePassword':
        NewUserProfile.Profile.Password = Data;
        SetNewUserProfile(NewUserProfile);
        break;
      case 'SaveUserProfile':
        if (NewUserProfile.Profile.Hash.length > 0) {
          ApiFetch(
            `model/Users/${
              NewUserProfile.Profile.New
                ? ``
                : `${NewUserProfile.Profile.Username}`
            }`,
            NewUserProfile.Profile.New ? 'POST' : 'PATCH',
            NewUserProfile.Profile,
            (Response) => {
              RequestTable().then(() => {
                SetNewShowProfile(false);
              });
            }
          );
        } else {
          message.warn('Установите пароль!');
        }
        break;
      case 'HashPassword':
        NewUserProfile.Profile.Hash = Bcrypt.hashSync(
          NewUserProfile.Profile.Password,
          12
        );
        SetNewUserProfile(NewUserProfile);
        break;
      case 'EnableStartDate':
        if (Data) {
          NewUserProfile.Profile.options.StartDate = Moment().format();
        } else {
          delete NewUserProfile.Profile.options.StartDate;
        }
        SetNewUserProfile(NewUserProfile);
        break;
      case 'EnableEndDate':
        if (Data) {
          NewUserProfile.Profile.options.EndDate = Moment().format();
        } else {
          delete NewUserProfile.Profile.options.EndDate;
        }
        SetNewUserProfile(NewUserProfile);
        break;
      case 'ChangeStartDate':
        NewUserProfile.Profile.options.StartDate = Data.format();
        SetNewUserProfile(NewUserProfile);
        break;
      case 'ChangeEndDate':
        NewUserProfile.Profile.options.EndDate = Data.format();
        SetNewUserProfile(NewUserProfile);
        break;
    }
  };

  const AddUserProfile = () => {
    ApiFetch('model/AccessRoles', 'GET', undefined, (Response) => {
      SetNewUserProfile({
        AllRoles: Response.data.map((Role) => {
          return {
            value: Role.rolename,
            label: Role.rolename,
          };
        }),
        Profile: {
          New: true,
          Rolename: 'USER',
          Username: '',
          Password: '',
          Enabled: true,
          Hash: '',
          options: {},
        },
      });
      SetNewShowProfile(true);
    });
  };
  const DeleteUserProfile = () => {
    ApiFetch(`model/Users/${SelectedKey}`, 'DELETE', undefined, (Response) => {
      SetNewSelectedKey(null);
      RequestTable();
    });
  };
  useEffect(RequestTable, []);

  return (
    <>
      <TableButtonComponent
        onAdd={() => {
          AddUserProfile();
          SetNewUserProfile(null);
        }}
        onDelete={() => {
          if (SelectedKey != null) {
            Modal.confirm({
              okText: 'Удалить',
              onOk: () => {
                DeleteUserProfile();
              },
              cancelText: 'Отмена',
              title: 'Подвердите действие',
              content: 'Вы действительно хотите удалить пользователя?',
              okButtonProps: { size: 'small', danger: true, type: 'primary' },
              cancelButtonProps: { size: 'small' },
            });
          }
        }}
      />
      <Modal
        destroyOnClose={true}
        maskClosable={false}
        okButtonProps={{ size: 'small', type: 'primary' }}
        cancelButtonProps={{ size: 'small' }}
        title="Профиль пользователя"
        visible={ShowProfile}
        onCancel={() => {
          SetNewShowProfile(false);
          SetNewUserProfile(null);
        }}
        onOk={() => {
          {
            UserProfileHandler('SaveUserProfile');
          }
        }}
        okText="Сохранить"
      >
        <UserProfileComponent
          Profile={UserProfile}
          UserProfileHandler={UserProfileHandler}
        />
      </Modal>
      <Table
        scroll={{ y: 700 }}
        pagination={false}
        size="small"
        rowKey="Username"
        dataSource={UsersTable}
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
              SetNewSelectedKey(Record['Username']);
            },
            onDoubleClick: () => {
              RequestProfile().then(() => {
                SetNewShowProfile(true);
              });
            },
          };
        }}
        columns={[
          {
            title: 'Имя пользователя',
            dataIndex: 'Username',
            key: 'Username',
            render: (Value, Record, Index) => {
              return <div style={{ cursor: 'pointer' }}>{Value}</div>;
            },
          },
          {
            title: 'Имя роли',
            dataIndex: 'Rolename',
            key: 'Rolename',
            render: (Value, Record, Index) => {
              return <div style={{ cursor: 'pointer' }}>{Value}</div>;
            },
          },
        ]}
      />
    </>
  );
}
