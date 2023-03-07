const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'text/javascript');
      }
    }
}));

const upload = multer({ storage: storage });

mongoose.connect('mongodb://127.0.0.1:27017/weight-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.log(err);
    });

const weightSchema = new mongoose.Schema({
    date: Date,
    weight: Number,
    file: String
});

const Weight = mongoose.model('Weight', weightSchema);

app.get('/api/weights', (req, res) => {
    Weight.find({})
    .then(weights => {
        res.status(200).json(weights);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});

app.get('/api/weights/:id', (req, res) => {
    Weight.findById(req.params.id)
    .then(weight => {
        if (!weight) {
            res.status(404).send('Weight not found');
        } else {
            res.status(200).json(weight);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});

app.post('/api/weights', upload.single('file'), (req, res) => {
    const weight = new Weight({
      date: req.body.date,
      weight: req.body.weight,
      file: req.file ? req.file.originalname : ''
    });

    weight.save()
    .then((newWeight) => {
        res.status(200).json(newWeight);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send(err);
    });
});

app.put('/api/weights/:id', upload.single('file'), (req, res) => {
  const updatedWeight = {
    date: req.body.date,
    weight: req.body.weight,
  };
  
  Weight.findByIdAndUpdate(req.params.id, updatedWeight, { new: true })
    .then(weight => {
      if (!weight) {
        res.status(404).send('Weight not found');
      } else {
        res.status(200).json(weight);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.delete('/api/weights/:id', (req, res) => {
    Weight.findByIdAndDelete(req.params.id)
    .then(weight => {
        if (!weight) {
            res.status(404).send('Weight not found');
        } else {
        res.status(200).send('Weight deleted successfully');
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});

app.use(express.static(path.join(__dirname, 'public'), { 'Content-Type': 'text/javascript' }));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});