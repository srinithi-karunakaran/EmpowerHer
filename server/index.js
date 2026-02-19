import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

import { analyzePitch } from './controllers/aiController.js';
import { getUserProfile, updateProfile, createUser } from './controllers/userController.js';
import { scanReceipt } from './controllers/ocrController.js';

// Routes
app.get('/', (req, res) => {
    res.send('EmpowerHer API is running...');
});

app.post('/api/pitch/analyze', analyzePitch);
app.get('/api/users/:userId', getUserProfile);
app.post('/api/users', createUser);
app.put('/api/users/:userId', updateProfile);
app.post('/api/ocr/scan', scanReceipt);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
