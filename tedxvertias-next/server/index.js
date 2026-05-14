require('dotenv').config({ silent: true });
const express = require('express');
const cors = require('cors');
const path = require('path');

const registerRoutes = require('./routes/register');
const adminRoutes = require('./routes/admin');
const certificateRoutes = require('./routes/certificate');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

app.use('/api/register', registerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/certificate', certificateRoutes);

app.listen(PORT, () => {
  console.log(`TEDxVeritas Server running on port ${PORT}`);
});