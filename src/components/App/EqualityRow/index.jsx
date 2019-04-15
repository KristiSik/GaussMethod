import React from "react";
import "./styles.css";

const EqualityRow = ({ id, value, inputChange, deleteEquality }) => (
  <div className="equality-row">
    <input
      value={value}
      onChange={({ target }) => inputChange(id, target.value)}
    />
    <button className="delete-btn" onClick={() => deleteEquality(id)}>X</button>
  </div>
);

export default EqualityRow;
