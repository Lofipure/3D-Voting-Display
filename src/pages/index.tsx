import React from "react";
import Show from "@/components/Show";
import Create from "@/components/Create";
import { IData } from "@/type";
import "./global.less";

const App = () => {
  const [votingData, setVotingData] = React.useState<IData>();
  const [step, steStep] = React.useState<number>(1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef}>
      {step == 1 ? (
        <Create
          onSuccess={(value) => {
            setVotingData(value);
            steStep(2);
          }}
        />
      ) : (
        <Show
          backgroundColor="#efefef"
          name={votingData?.name ?? ""}
          options={votingData?.options ?? []}
        />
      )}
    </div>
  );
};

export default App;
