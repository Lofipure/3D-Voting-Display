import { IGlobalShowOptions } from "@/type";
import React from "react";
import Global from "./Global.class";

interface IShow extends IGlobalShowOptions {}

const Show: React.FC<IShow> = (props) => {
  const { backgroundColor, name, options } = props;
  new Global({
    backgroundColor,
    name,
    options,
  });
  return <div></div>;
};

export default Show;
