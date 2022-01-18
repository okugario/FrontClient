import * as React from "react";
import { Button, Checkbox, DatePicker, Input, message, Select } from "antd";
import { useState } from "react";
import Moment from "moment";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Password from "antd/lib/input/Password";

export default function UserProfile(props) {
  const [ShowPassword, SetNewShowPassword] = useState(false);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          Имя пользователя:
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input
            size="small"
            style={{ width: "190px" }}
            value={props.Profile.Profile.Username}
            disabled={!props.Profile.Profile.New}
            onChange={(Event) => {
              props.UserProfileHandler("ChangeUsername", Event.target.value);
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>Пароль:</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {ShowPassword ? (
            <>
              <Input
                value={props.Profile.Profile.Password}
                size="small"
                autoComplete="new-password"
                type="password"
                style={{ width: "126px" }}
                onChange={(Event) => {
                  props.UserProfileHandler(
                    "ChangePassword",
                    Event.target.value
                  );
                }}
              />
              <Button
                icon={<CheckOutlined />}
                style={{ marginLeft: "8px" }}
                type="primary"
                size="small"
                onClick={() => {
                  if (props.Profile.Profile.Password.length == 0) {
                    message.warn("Введите корректный пароль!");
                  } else {
                    props.UserProfileHandler(
                      "HashPassword",
                      SetNewShowPassword(false)
                    );
                  }
                }}
              />
              <Button
                type="primary"
                size="small"
                danger="true"
                style={{ marginLeft: "8px" }}
                onClick={() => {
                  SetNewShowPassword(false);
                  props.UserProfileHandler("ChangePassword", null);
                }}
                icon={<CloseOutlined />}
              />
            </>
          ) : (
            <Button
              size="small"
              type="primary"
              style={{ width: "190px" }}
              onClick={() => {
                SetNewShowPassword(true);
              }}
            >
              Установить новый пароль
            </Button>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>Выбор роли:</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Select
            size="small"
            options={props.Profile.AllRoles}
            value={props.Profile.Profile.Rolename}
            onChange={(Value) => {
              props.UserProfileHandler("ChangeRolename", Value);
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          Доступ включен:
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            size="small"
            checked={props.Profile.Profile.Enabled}
            onChange={(Event) => {
              props.UserProfileHandler("ChangeEnabled", Event.target.checked);
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            size="small"
            style={{ marginRight: "5px" }}
            checked={"StartDate" in props.Profile.Profile.options}
            onChange={(Event) => {
              props.UserProfileHandler("EnableStartDate", Event.target.checked);
            }}
          />
          Доступ с:
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <DatePicker
            disabled={!("StartDate" in props.Profile.Profile.options)}
            size="small"
            format="DD.MM.YYYY HH:mm:ss"
            value={Moment(props.Profile.Profile.options.StartDate)}
            onChange={(Moment) => {
              props.UserProfileHandler("ChangeStartDate", Moment);
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            size="small"
            style={{ marginRight: "5px" }}
            checked={"EndDate" in props.Profile.Profile.options}
            onChange={(Event) => {
              props.UserProfileHandler("EnableEndDate", Event.target.checked);
            }}
          />
          Доступ по:
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <DatePicker
            size="small"
            disabled={!("EndDate" in props.Profile.Profile.options)}
            format="DD.MM.YYYY HH:mm:ss"
            value={Moment(props.Profile.Profile.options.EndDate)}
            onChange={(Moment) => {
              props.UserProfileHandler("ChangeEndDate", Moment);
            }}
          />
        </div>
      </div>
    </>
  );
}
