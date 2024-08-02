const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

// Token API bot yang diberikan oleh BotFather
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Membaca script task.js
const taskScript = fs.readFileSync('task.js', 'utf8');

// State untuk menyimpan user_id dan reference sementara
const userStates = {};

// Fungsi untuk menjalankan script task.js
async function runTaskScript(user_id, reference) {
  eval(taskScript);
  await verifyTask(user_id, reference);
}

// Handler untuk perintah /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Halo! Selamat datang di bot saya. Untuk memulai, ketik /task.');
});

// Handler untuk perintah /task
bot.onText(/\/task/, (msg) => {
  const chatId = msg.chat.id;
  userStates[chatId] = { step: 1 };
  bot.sendMessage(chatId, 'Silahkan masukkan user_id:');
});

// Handler untuk menangani pesan teks
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (userStates[chatId]) {
    const state = userStates[chatId];

    if (state.step === 1 && text !== '/task') {
      state.user_id = text;
      state.step = 2;
      bot.sendMessage(chatId, 'Silahkan masukkan reference:');
    } else if (state.step === 2) {
      state.reference = text;
      bot.sendMessage(chatId, `Memulai verifikasi tugas untuk user_id: ${state.user_id} dan reference: ${state.reference}`);
      
      try {
        await runTaskScript(state.user_id, state.reference);
        bot.sendMessage(chatId, 'Tugas selesai diverifikasi.');
      } catch (err) {
        bot.sendMessage(chatId, `Terjadi kesalahan: ${err.message}`);
      }
      
      // Reset state
      delete userStates[chatId];
    }
  }
});
