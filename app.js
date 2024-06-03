const express = require('express');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
require('./config/passport');
const { createIndices } = require('./elastic-search/client');
const authRoutes = require('./routes/auth-routes');
const path = require('path');
const socketConfig = require('./websocket/server');

const app = express();
const httpServer = createServer(app);
const io = socketConfig.init(httpServer);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes); 

createIndices();

io.on('connection', (socket) => {
    console.log('socket connected');
  });

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});