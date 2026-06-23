"use client";

import { Spinner } from "@chakra-ui/react";
import React from "react";

export default function loader() {
  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <Spinner color="#00452e" size={"xl"} />
    </div>
  );
}
