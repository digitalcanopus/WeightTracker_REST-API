import React from 'react';

function RecordList(props) {
  return (
    <ul>
      {props.records.map(record => (
        <li key={record.id}>
          <h2>{record.name}</h2>
          <p>{record.description}</p>
          <p>{record.price}</p>
        </li>
      ))}
    </ul>
  );
}

export default RecordList;