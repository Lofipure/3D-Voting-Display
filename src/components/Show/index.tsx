import React from "react";
import { Modal } from "antd";
import { IData, ISelection } from "@/type";
import Global from "./Global.class";

interface IShow extends IData {
  backgroundColor: string;
  onComplete: () => void;
}
const viewContainerStyle: React.CSSProperties = {
  height: "100vh",
  width: "100vw",
};

const createContent = (
  list: Array<
    ISelection & {
      optionName: string;
    }
  >,
): React.ReactNode => {
  return (
    <div>
      {list.map((item) => (
        <div key={item.id}>
          恭喜 {item.label} 荣获 {item.optionName}
        </div>
      ))}
    </div>
  );
};

const Show: React.FC<IShow> = (props) => {
  const { backgroundColor, name, options, onComplete } = props;
  const viewContainer = React.useRef<HTMLDivElement>(null);
  const scene = React.useRef<any>(null);

  const handleComplete = (
    list: Array<
      ISelection & {
        optionName: string;
      }
    >,
  ) => {
    Modal.success({
      title: "🎉 Congratulation",
      content: createContent(list),
      onOk: onComplete,
    });
  };
  React.useEffect(() => {
    if (scene.current || !viewContainer.current) return;
    scene.current = new Global({
      backgroundColor,
      name,
      options,
      container: viewContainer.current,
      onComplete: handleComplete,
    });
  }, []);

  return <div ref={viewContainer} style={viewContainerStyle} />;
};

export default Show;
