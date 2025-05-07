const express = require('express');
const { startSession, checkStatus } = require('./bot');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static('public'));

// Endpoint untuk mulai session (generate pairing code)
app.post('/start-session', async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const sessionId = await startSession(phoneNumber);
    res.json({ sessionId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// Endpoint untuk cek status session (apakah sudah connect)
app.get('/status/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const status = await checkStatus(sessionId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check status' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});