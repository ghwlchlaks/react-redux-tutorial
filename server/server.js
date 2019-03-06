const express = require('express');
const path = require('path');
const os = require('os');
const session = require('express-session');
const connectRedis = require('connect-redis');
const redisStore = connectRedis(session);

// controller files
const { authRoute } = require('./contollers/index');

// config files
const { redis, mongoose } = require('./config/index');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error'));
db.once('open', () => {
  console.log('mongoose connection!');
});

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './../public')));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'session',
    cookie: { maxAge: 1000 * 60 * 5 }, // 유효시간 10분
    store: new redisStore({
      client: redis
    })
  })
);

app.use('/api/auth', authRoute);

// api test route
app.get('/api/getUsername', function(req, res, next) {
  res.send({ username: os.userInfo().username });
});

app.listen(PORT, () => {
  console.log('Express is listening on port', PORT);
});
