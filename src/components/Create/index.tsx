import React from "react";
import { Button, Form, Input, InputNumber } from "antd";
import { IData } from "@/type";
import { Plus, Minus } from "@icon-park/react";
import styles from "./index.less";

export interface ICreate {
  onSuccess: (value: IData) => void;
}

const Create: React.FC<ICreate> = (props) => {
  const { onSuccess } = props;
  const [form] = Form.useForm<IData>();
  return (
    <div className={styles["create"]}>
      <Form form={form}>
        <Form.Item
          name="name"
          label="Voting theme"
          className={styles["create-header"]}
        >
          <Input />
        </Form.Item>
        <Form.List
          name="options"
          initialValue={[
            {
              label: "",
              selectionResult: [
                {
                  label: "",
                  selectedNumber: undefined,
                },
              ],
            },
          ]}
        >
          {(options, { add: addOptions, remove: removeOptions }) => (
            <>
              {options.map((option, optionIndex) => (
                <div key={option.key}>
                  <div className={styles["create-options"]}>
                    <div className={styles["create-options__header"]}>
                      <Form.Item
                        name={[option.name, "label"]}
                        className={styles["create-options__header__input"]}
                      >
                        <Input placeholder="Options Name" />
                      </Form.Item>
                      {optionIndex == options.length - 1 && (
                        <Button
                          onClick={() => {
                            addOptions({
                              label: "",
                              selectionResult: [
                                {
                                  label: "",
                                  selectedNumber: undefined,
                                },
                              ],
                            });
                          }}
                        >
                          Add Options
                        </Button>
                      )}
                    </div>
                    <Form.List name={[option.name, "selectionResult"]}>
                      {(
                        selections,
                        { add: addSelection, remove: removeSelection },
                      ) => (
                        <div className={styles["create-options__body"]}>
                          {selections.map((selection, selectionIndex) => (
                            <div
                              className={styles["create-selection"]}
                              key={selection.key}
                            >
                              <Form.Item
                                name={[selection.name, "label"]}
                                className={styles["create-selection__label"]}
                              >
                                <Input placeholder="Selection Name" />
                              </Form.Item>
                              <Form.Item
                                className={styles["create-selection__number"]}
                                name={[selection.name, "selectedNumber"]}
                              >
                                <InputNumber placeholder="Selection Name" />
                              </Form.Item>
                              {selections.length > 1 && (
                                <Minus
                                  className={styles["create-selection__icon"]}
                                  size={20}
                                  fill="#F32626"
                                  onClick={removeSelection.bind(
                                    this,
                                    selectionIndex,
                                  )}
                                />
                              )}
                              {selectionIndex == selections.length - 1 && (
                                <Plus
                                  onClick={addSelection}
                                  className={styles["create-selection__icon"]}
                                  size={20}
                                  fill="#58A0FF"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </Form.List>
                  </div>
                </div>
              ))}
            </>
          )}
        </Form.List>
      </Form>
      <Button
        onClick={() => {
          onSuccess(form.getFieldsValue());
        }}
      >
        Get Data
      </Button>
    </div>
  );
};

export default Create;
