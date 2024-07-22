require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.SERVER_PORT || 3000;

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'hospital_data'
});

// Nunjucks 템플릿 엔진 설정
nunjucks.configure('views', {
  express: app,
});

app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// 메인 페이지 라우트
app.get('/', (req, res) => {
  res.render('index', { center: null });
});

// 지도 페이지 라우트
app.get('/map', (req, res) => {
  res.render('index', { center: 'map' });
});

// 회원가입 페이지 라우트
app.get('/register', (req, res) => {
  res.render('index', { center: 'register' });
});

// 로그인 페이지 라우트
app.get('/login', (req, res) => {
  res.render('index', { center: 'login' });
});

app.get('/detail', (req, res) => {
  res.render('index', { center: 'detail' });
});

app.get('/search', (req, res) => {
  res.render('index', { center: 'search' });
});

app.get('/review', (req, res) => {
  res.render('index', { center: 'review' });
});

// 병원 데이터 가져오는 API 라우트
app.get('/api/hospitals', (req, res) => {
  connection.query('SELECT yadmNm, XPos, YPos FROM hospitals', (error, results) => {
    if (error) {
      console.error('데이터베이스 조회 오류:', error);
      res.status(500).send('서버 오류');
      return;
    }
    res.json(results);
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`server start port:${port}`);
});

// MySQL 데이터베이스 연결 테스트
connection.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err.stack);
    return;
  }
  console.log('데이터베이스 연결 성공');
});
