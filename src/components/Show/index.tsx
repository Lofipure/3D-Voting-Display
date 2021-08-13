import React, { useEffect } from "react";
import Global from "./Global.class";

const Show: React.FC = () => {
  useEffect(() => {
    new Global({
      backgroundColor: "#efefef",
      name: "Text",
      options: [
        {
          label: "Test One",
          selectionResult: [
            {
              id: 1,
              label: "1",
              selectedNumber: 18,
            },
            // {
            //   id: 2,
            //   label: "2",
            //   selectedNumber: 10,
            // },
          ],
        },
        // {
        //   label: "Test Two",
        //   selectionResult: [
        //     {
        //       id: 3,
        //       label: "3",
        //       selectedNumber: 2,
        //     },
        //     {
        //       id: 4,
        //       label: "4",
        //       selectedNumber: 15,
        //     },
        //     {
        //       id: 5,
        //       label: "5",
        //       selectedNumber: 18,
        //     },
        //     {
        //       id: 6,
        //       label: "6",
        //       selectedNumber: 18,
        //     },
        //   ],
        // },
      ],
    });
  });
  return <div></div>;
};

export default Show;
