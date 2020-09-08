import React from "react";
import { H4, ShareModule } from "@licenserocks/kit";

export const IndexSidebar = ({ url }) => (
  <>
    <H4 mb={6}>Share this license</H4>
    <ShareModule mb={6} url={url} />
  </>
);
