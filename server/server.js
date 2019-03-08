const express = require('express');
const path = require('path');
const os = require('os');
const session = require('express-session');
const connectRedis = require('connect-redis');
const redisStore = connectRedis(session);
const logger = require('morgan');

// controller files
const { authRoute, memoRoute } = require('./contollers/index');

// config files
const { redis, mongoose } = require('./config/index');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error'));
db.once('open', () => {
  console.log('mongoose connection!');
});

const app = express();
const PORT = 4000;

app.use(logger('short'));
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
app.use('/api/memo', memoRoute);

// api test route
app.get('/api/getUsername', function(req, res, next) {
  res.send({ username: os.userInfo().username });
});

app.listen(PORT, () => {
  console.log('Express is listening on port', PORT);
});

// error handler
app.use(function(err, req, res) {
  console.error(err.stack);
  res.status(500).send('something broke!');
});
