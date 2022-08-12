import React from "react";
import { LayoutProps } from "../pages/_app";

const HomeLayout = ({ children }: LayoutProps) => {
  return <main className="absolute inset-0 flex flex-col ">{children}</main>;
};

export default HomeLayout;
