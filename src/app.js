const path = require('path');
const express = require('express');
const hbs = require('hbs');

const app = express();

const port = process.env.PORT || 3000;

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// hbs 파일의 변경된 내용도 자동 적용되도록 nodemon 시작 설정
// nodemon src/app.js -e js,hbs

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath); // 기본은 views 디렉토리
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

//
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'DEvSIGNER'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'DEvSIGNER'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    helpText: 'This is some helpful text.',
    name: 'DEvSIGNER'
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address'
    });
  }

  const address = req.query.address;
  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      });
    });
  });
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    });
  }

  console.log(req.query.search);
  res.send({
    products: []
  });
});

//
app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'DEvSIGNER',
    errorMessage: 'Help article not found.'
  });
});

// 라우팅은 위에서 부터 순서대로 매칭되는 핸들러로 실행된다.
// '*'는 모든 매칭이지만 제일 마지막에 놓는다.
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'DEvSIGNER',
    errorMessage: 'Page not found.'
  });
});

//
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
