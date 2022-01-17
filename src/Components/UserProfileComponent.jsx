import * as React from "react";
import { Button, Checkbox, Input, message, Select } from "antd";
import { useState } from "react";

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
            style={{ width: "160px" }}
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
        <div style={{ display: "flex", alignItems: "center" }}>Включен:</div>
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
        <div style={{ display: "flex", alignItems: "center" }}>Пароль:</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {ShowPassword ? (
            <>
              <Input
                value={props.Profile.Profile.Password}
                size="small"
                style={{ width: "150px" }}
                onChange={(Event) => {
                  props.UserProfileHandler(
                    "ChangePassword",
                    Event.target.value
                  );
                }}
              />
              <Button
                style={{ marginLeft: "10px" }}
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
              >
                Сохранить
              </Button>
            </>
          ) : (
            <Button
              size="small"
              type="primary"
              onClick={() => {
                SetNewShowPassword(true);
              }}
            >
              Установить новый пароль
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
