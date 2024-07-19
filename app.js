require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser'); // body parser 추가 1
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
app.use(bodyParser.urlencoded({ extended: false })); // 객체 들어감. 추가 2
app.use(express.static('public'));

// 메인 페이지 라우트
app.get('/', (req, res) => {
  // SQL 쿼리 실행
  const query = "SELECT addr, XPos, YPos, emdongNm FROM hospitals WHERE clCdNm = '병원'";
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('쿼리 실행 실패:', err.stack);
      res.status(500).send('쿼리 실행 실패');
      return;
    }
    // Nunjucks 템플릿에 데이터 전달 및 렌더링
    res.render('test', { hospitals: results });
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`server start port:${port}`);
});

// MySQL 데이터베이스 연결
connection.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err.stack);
    return;
  }
  console.log('데이터베이스 연결 성공');
});
