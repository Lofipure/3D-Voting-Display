import React from "react";
import { Button, Form, Input, InputNumber, message, Modal } from "antd";
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
          rules={[
            {
              required: true,
              message: "这个你不填?",
            },
          ]}
          name="name"
          label="Voting theme"
          className={styles["create-header"]}
        >
          <Input placeholder="举个🌰：第三届猕猴桃🥝幼儿园颁奖典礼" />
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
                        rules={[
                          {
                            required: true,
                            message: "这个你不填我不好办事儿啊。",
                          },
                        ]}
                        name={[option.name, "label"]}
                        className={styles["create-options__header__input"]}
                      >
                        <Input placeholder="举个🌰：安安静静睡午觉奖" />
                      </Form.Item>
                      <Button.Group>
                        {optionIndex == options.length - 1 && (
                          <Button
                            type="primary"
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
                            再来一个！
                          </Button>
                        )}
                      </Button.Group>
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
                                rules={[
                                  {
                                    required: true,
                                    message: "这个你不填我不好办事儿啊。",
                                  },
                                ]}
                                name={[selection.name, "label"]}
                                className={styles["create-selection__label"]}
                              >
                                <Input placeholder="举个🌰：小王小朋友" />
                              </Form.Item>
                              <Form.Item
                                rules={[
                                  {
                                    required: true,
                                    message: "这个你不填你还图个啥。",
                                  },
                                ]}
                                className={styles["create-selection__number"]}
                                name={[selection.name, "selectedNumber"]}
                              >
                                <InputNumber placeholder="举个🌰：32" />
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
      <Button.Group>
        <Button
          onClick={() => {
            form
              .validateFields()
              .then(() => {
                onSuccess(form.getFieldsValue());
              })
              .catch(() => {
                message.error("你这表单叫填好了???💢");
              });
          }}
        >
          🎉
        </Button>
        <Button
          type="primary"
          onClick={() => {
            Modal.warn({
              title: "注意事项",
              content: "Voting theme 只支持英文。(中文的.ttf老是不成功)😮‍💨",
            });
          }}
        >
          🤔 谁不点我谁吃亏
        </Button>
      </Button.Group>
    </div>
  );
};

export default Create;
