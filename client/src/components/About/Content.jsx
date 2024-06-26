import React from "react";

function Content({heading,para}) {
  return (
    <div>
      <h1>{heading}</h1>
      <p>
        {para}
      </p>
    </div>
  );
}

export default Content;
