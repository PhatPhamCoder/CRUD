import React from "react";
import { Helmet } from "react-helmet";

export default function ChildComponent() {
  return (
    <div>
      <Helmet>
        <title>Optech Company</title>
        <meta name="description" content="App Description" />
        <meta name="theme-color" content="#008f68" />
      </Helmet>
    </div>
  );
}
