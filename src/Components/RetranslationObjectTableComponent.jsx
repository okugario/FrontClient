import * as React from 'react';
import { Button, DatePicker, InputNumber, Table, Modal } from 'antd';
import Moment from 'moment';

export default class RetranslationObjectTableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.NewIdInputRef = React.createRef();
    this.state = {
      OpenModal: false,
      SelectedKey: [],
      Columns: [
        {
          width: 100,
          title: 'ID',
          dataIndex: 'ObjectId',
          key: 'ObjectId',
          render: (Text) => {
            if (Text == '0') {
              return (
                <InputNumber
                  defaultValue={Text}
                  size="small"
                  ref={this.NewIdInputRef}
                />
              );
            } else {
              return <div style={{ cursor: 'pointer' }}>{Text}</div>;
            }
          },
        },
        {
          title: 'Время последней отправки',
          dataIndex: 'LastTs',
          key: 'LastTs',
          render: (Text, Record, Index) => {
            return (
              <div style={{ cursor: 'pointer' }}>
                <DatePicker
                  style={{ width: '170px' }}
                  showTime={true}
                  onOk={(Value) => {
                    this.props.RetranslationHandler(
                      'ChangeObjectTime',
                      Value.unix(),
                      this.state.SelectedKey[0]
                    );
                  }}
                  defaultValue={Moment.unix(Text)}
                  size="small"
                  format="DD.MM.YYYY HH:mm:ss"
                />
                {Record.ObjectId == '0' ? (
                  <Button
                    onClick={() => {
                      this.props.RetranslationHandler(
                        'SaveObject',
                        this.NewIdInputRef.current.value
                      );
                    }}
                    size="small"
                    type="primary"
                    style={{ marginLeft: '15px' }}
                  >
                    Сохранить
                  </Button>
                ) : null}
              </div>
            );
          },
        },
      ],
    };
  }
  ModalHandler(Boolean) {
    if (this.state.SelectedKey.length != 0) {
      this.setState({
        OpenModal: Boolean,
      });
    }
  }
  render() {
    return (
      <React.Fragment>
        <Modal
          okButtonProps={{ size: 'small' }}
          cancelButtonProps={{ size: 'small' }}
          visible={this.state.OpenModal}
          okText="Да"
          title="Подтвердите действие"
          cancelText="Нет"
          onCancel={() => {
            this.ModalHandler(false);
          }}
          onOk={() => {
            this.props.RetranslationHandler(
              'DeleteObject',
              undefined,
              this.state.SelectedKey[0]
            );
            this.setState({ SelectedKey: [], OpenModal: false });
          }}
        >
          Вы действительно хотите удалить объект?
        </Modal>
        <div
          style={{
            alignContent: 'center',
            display: 'flex',
            width: '100%',
            height: '30px',
          }}
        >
          <Button
            size="small"
            type="primary"
            onClick={() => {
              this.props.RetranslationHandler('AddObject');
            }}
          >
            Добавить
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            size="small"
            type="primary"
            danger
            onClick={() => {
              this.ModalHandler(true);
            }}
          >
            Удалить
          </Button>
        </div>
        <Table
          scroll={{ scrollToFirstRowOnChange: true, y: 200 }}
          rowSelection={{
            hideSelectAll: true,
            columnWidth: 0,
            renderCell: () => {
              return null;
            },
            selectedRowKeys: this.state.SelectedKey,
          }}
          onRow={(Record) => {
            return {
              onClick: () => {
                this.setState({ SelectedKey: [Record.ObjectId] });
              },
            };
          }}
          pagination={false}
          size="small"
          columns={this.state.Columns}
          rowKey="ObjectId"
          dataSource={this.props.Objects}
        />
      </React.Fragment>
    );
  }
}
