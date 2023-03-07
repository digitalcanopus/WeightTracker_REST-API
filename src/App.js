import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AddRecordPage from './components/AddRecordPage';
import EditRecordPage from './components/EditRecordPage';
import axios from 'axios';

function App() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get('/api/weights')
      .then(res => setRecords(res.data))
      .catch(err => console.log(err));
  }, []);

  const addRecord = record => {
    axios.post('/api/weights', record)
      .then(res => {
        setRecords([...records, res.data]);
      })
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
        console.log('получен эдит на app', res.data);
      })
      .catch(err => console.log(err));
  };

  const updateRecordHandler = async (id, updatedData) => {
    try {
      await axios.put(`/api/weights/${id}`, updatedData);
      setRecords(prevRecords => {
        console.log('получен эдит на app');
        return prevRecords.map(record => {
          if (record._id === id) {
            return {
              ...record,
              ...updatedData
            };
          } else {
            return record;
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <Routes>
        <Route exact path="/" element={<HomePage records={records} onDeleteRecord={deleteRecord} />} />
        <Route path="/add" element={<AddRecordPage onAddRecord={addRecord} />} />
        <Route path="/edit/:id" element={<EditRecordPage records={records} onEditRecord={editRecord} />} />
      </Routes>
    </div>
  );
}

export default App;