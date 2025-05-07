const { BaileysClient } = require('baileys');
const fs = require('fs');
const path = require('path');

const sessionsDir = path.join(__dirname, '../sessions');

// Pastikan folder sessions ada
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir);
}

// Start session baru
async function startSession(phoneNumber) {
  const sessionId = phoneNumber.replace('+', '');
  const sessionPath = path.join(sessionsDir, `${sessionId}.json`);

  if (fs.existsSync(sessionPath)) {
    throw new Error('Session already exists');
  }

  const client = new BaileysClient();

  await client.connect();
  const code = await client.pairingCode(phoneNumber);

  // Simpan session (kode pairing dan statusnya)
  fs.writeFileSync(sessionPath, JSON.stringify({ code, status: 'waiting' }));

  client.on('pairing', async (pairingCode) => {
    if (pairingCode === code) {
      // Update status jadi "connected" setelah berhasil pairing
      fs.writeFileSync(sessionPath, JSON.stringify({ code, status: 'connected' }));
    }
  });

  return sessionId;
}

// Cek status session
async function checkStatus(sessionId) {
  const sessionPath = path.join(sessionsDir, `${sessionId}.json`);

  if (!fs.existsSync(sessionPath)) {
    throw new Error('Session not found');
  }

  const sessionData = JSON.parse(fs.readFileSync(sessionPath));
  return sessionData;
}

module.exports = { startSession, checkStatus };