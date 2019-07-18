module.exports = (app) => {
    const chatbox = require('../controllers/chatbox.controller');
    
    app.post('/chatbox', chatbox.chat);

}