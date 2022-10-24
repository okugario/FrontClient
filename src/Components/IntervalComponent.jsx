import * as React from 'react';
import { useState } from 'react';
import { observer, inject } from 'mobx-react';
import { Modal, Calendar, TimePicker } from 'antd';
import FooterIntervalModalWindow from './FooterIntervalModalWindow';
const IntervalComponent = inject('ProviderStore')(
  observer((props) => {
    const [OpenModal, SetNewOpenModal] = useState(false);
    const [StartDate, SetNewStartDate] = useState(
      props.ProviderStore.CurrentTab.Options.StartDate.clone()
    );
    const [EndDate, SetNewEndDate] = useState(
      props.ProviderStore.CurrentTab.Options.EndDate.clone()
    );

    const ButtonHandler = (Button) => {
      let NewStartDate = StartDate.clone();
      switch (Button) {
        case 'FirstShift':
          SetNewStartDate(NewStartDate.clone().hours(8).minutes(0).seconds(0)),
            SetNewEndDate(NewStartDate.clone().hours(20).minutes(0).seconds(0));

          break;
        case 'SecondShift':
          SetNewStartDate(NewStartDate.clone().hours(20).minutes(0).seconds(0));
          SetNewEndDate(
            NewStartDate.clone().add(1, 'day').hours(8).minutes(0).seconds(0)
          );
          break;
        case 'FullDay':
          SetNewStartDate(NewStartDate.clone().hours(8).minutes(0).seconds(0)),
            SetNewEndDate(
              NewStartDate.clone().add(1, 'day').hours(8).minutes(0).seconds(0)
            );
          break;
        case 'Apply':
          props.ProviderStore.SetNewDateTimeInterval(StartDate, EndDate);
          SetNewOpenModal(false);
          break;
        case 'Cancel':
          SetNewOpenModal(false);
          break;
      }
    };
    return (
      <div>
        <Modal
          onCancel={() => {
            SetNewOpenModal(false);
          }}
          width="700px"
          zIndex={9998}
          visible={OpenModal}
          footer={<FooterIntervalModalWindow ButtonHandler={ButtonHandler} />}
        >
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ width: '300px' }}>
                <strong>Начало периода</strong>
                <Calendar
                  onSelect={(NewStartDate) => {
                    SetNewStartDate(NewStartDate);
                  }}
                  defaultValue={
                    props.ProviderStore.CurrentTab.Options.StartDate
                  }
                  fullscreen={false}
                  value={StartDate}
                />
                <TimePicker
                  onOk={(NewStartTime) => {
                    SetNewStartDate(NewStartTime);
                  }}
                  value={StartDate}
                  showNow={false}
                  popupStyle={{ zIndex: 9999 }}
                  format="HH:mm:ss"
                />
              </div>
              <div style={{ width: '300px' }}>
                <strong>Конец периода</strong>
                <Calendar
                  onSelect={(NewEndDate) => {
                    SetNewEndDate(NewEndDate);
                  }}
                  fullscreen={false}
                  defaultValue={props.ProviderStore.CurrentTab.Options.EndDate}
                  value={EndDate}
                />
                <TimePicker
                  onOk={(NewEndTime) => {
                    SetNewEndDate(NewEndTime);
                  }}
                  value={EndDate}
                  showNow={false}
                  popupStyle={{ zIndex: 9999 }}
                  format="HH:mm:ss"
                />
              </div>
            </div>
          </div>
        </Modal>

        <div
          onClick={() => {
            SetNewOpenModal(true);
          }}
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            backgroundColor: '#1890ff',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>
              {props.ProviderStore.CurrentTab.Options.StartDate.format(
                'DD.MM.YYYY'
              )}
            </span>

            <span>
              {props.ProviderStore.CurrentTab.Options.StartDate.format(
                'HH:mm:ss'
              )}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>
              {props.ProviderStore.CurrentTab.Options.EndDate.format(
                'DD.MM.YYYY'
              )}
            </span>
            <span>
              {props.ProviderStore.CurrentTab.Options.EndDate.format(
                'HH:mm:ss'
              )}
            </span>
          </div>
        </div>
      </div>
    );
  })
);
export default IntervalComponent;
