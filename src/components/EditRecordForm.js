import React, { useState } from 'react';
import axios from 'axios';

const EditRecordForm = ({ record, onClose, onSave }) => {
  const [weight, setWeight] = useState(record.weight);
  const [date, setDate] = useState(new Date(record.date).toISOString().slice(0, 10));

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };
  
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('date', date);
    formData.append('weight', weight);
  
    axios.put(`/api/weights/${record._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => onSave(res.data))
    .catch(err => console.log(err));
    //onSave(formData)
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="ed-lab" htmlFor="weight">Weight (kg)</label>
            <input type="number" id="weight" name="weight" value={weight} onChange={handleWeightChange} />
          </div>
          <div className="form-group">
            <label className="ed-lab" htmlFor="date">Date</label>
            <input type="date" id="date" name="date" value={date} onChange={handleDateChange} />
          </div>
          <button className="sav-btn btn btn-sm btn-outline-danger" type="submit">Save</button>
          <button className="can-btn btn btn-sm btn-outline-danger" type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditRecordForm;