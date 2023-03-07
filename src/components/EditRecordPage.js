import React from 'react';
import { useParams } from 'react-router-dom';
import EditRecordForm from './EditRecordForm';

const EditRecordPage = ({ records, props }) => {
  const { id } = useParams();
  const record = records.find(r => r._id === id);
  const { onEditRecord } = props;

  const handleUpdateRecord = (updatedRecord) => {
    console.log('id', id)
    onEditRecord(id, updatedRecord);
  };

  if (!record) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Record</h1>
      <EditRecordForm record={record} onEditRecord={handleUpdateRecord} />
    </div>
  );
};

export default EditRecordPage;