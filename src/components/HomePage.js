import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddRecordForm from './AddRecordForm';
import EditRecordForm from './EditRecordForm';

function HomePage() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    axios.get('/api/weights')
      .then(res => setRecords(res.data))
      .catch(err => console.log(err));
  }, []);

  const addRecord = (record) => {
    axios.post('/api/weights', record)
      .then(res => setRecords([...records, res.data]))
      .catch(err => console.log(err));
  };

  const deleteRecord = id => {
    axios.delete(`/api/weights/${id}`)
      .then(res => setRecords(records.filter(record => record._id !== id)))
      .catch(err => console.log(err));
  };

  const editRecord = (id, updatedRecord) => {
    axios.put(`/api/weights/${id}`, updatedRecord)
      .then(res => {
        setRecords(prevRecords => {
          const updatedRecords = prevRecords.map(record => {
            if (record._id === id) {
              return res.data;
            }
            return record;
          });
          return updatedRecords;
        });
        console.log('получен эдит на гл стр');
      })
      .catch(err => console.log(err));
  };

  const handleEditClick = (record) => {
    setSelectedRecord(record);
  }

  const handleEditClose = () => {
    setSelectedRecord(null);
  }

  const handleEditSave = (updatedRecord) => {
    setSelectedRecord(null);
    editRecord(updatedRecord._id, updatedRecord);
    console.log('edited');
  }

  return (
    <div className="page">
      <h2 className="header-1">Weight Tracker</h2>
      <AddRecordForm onAddRecord={addRecord} />
      <div className="table-cont">
      <h2 className="progr">Progress</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Weight (kg)</th>
            <th className="th-file">File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record._id}>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>{record.weight}</td>
              <td className="file-cell">
              {record.file ? (
              <a href={`../../uploads/${record.file}`} target="_blank" type="application/octet-stream">
              {record.file}
              </a>
              ) : (
              'No file'
              )}
              </td>
              <td>
                <button className="del-btn btn btn-sm btn-outline-danger" onClick={() => deleteRecord(record._id)}>Delete</button>             
                <button className="upd-btn btn btn-sm btn-outline-danger" href="#modal" onClick={() => handleEditClick(record)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {selectedRecord && <EditRecordForm record={selectedRecord} onClose={handleEditClose} onSave={(updatedRecord) => handleEditSave(updatedRecord)} />}
    </div>
  );
}

export default HomePage;