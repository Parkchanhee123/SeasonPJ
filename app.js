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

// db연결
var db_connect = require('./db/db_connect');
var db_sql = require('./db/db_sql');

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
    
// 지역별 검색 기능 추가
app.get('/search', (req, res) => {
  const searchTerm = req.query.q;
  const region = req.query.region;
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 25; // 한 페이지에 출력하는 데이터의 개수
  const offset = (page - 1) * itemsPerPage;

  let countQuery = 'SELECT COUNT(*) AS count FROM hospitals WHERE 1=1';
  let dataQuery = 'SELECT * FROM hospitals WHERE 1=1';
  let params = [];

  if (searchTerm) {
      countQuery += ' AND yadmNm LIKE ?';
      dataQuery += ' AND yadmNm LIKE ?';
      params.push(`%${searchTerm}%`);
  }

  if (region) {
      countQuery += ' AND sidoCdNm = ?';
      dataQuery += ' AND sidoCdNm = ?';
      params.push(region);
  }

  connection.query(countQuery, params, (countError, countResults) => {
      if (countError) {
          console.error('데이터베이스 조회 오류:', countError);
          res.status(500).send('서버 오류');
          return;
      }

      const totalItems = countResults[0].count;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      // 요청한 페이지가 유효한지 확인
      if (page > totalPages && totalItems > 0) {
          res.redirect(`/search?${searchTerm ? `q=${searchTerm}&` : ''}${region ? `region=${region}&` : ''}page=${totalPages}`);
          return;
      }

      dataQuery += ' LIMIT ? OFFSET ?';
      params.push(itemsPerPage, offset);

      connection.query(dataQuery, params, (dataError, results) => {
          if (dataError) {
              console.error('데이터베이스 조회 오류:', dataError);
              res.status(500).send('서버 오류');
              return;
          }
          res.render('index', {
              center: 'search',
              hospitals: results,
              currentPage: page,
              totalPages: totalPages,
              searchTerm: searchTerm || '',
              region: region || ''
          });
      });
  });
});

app.get('/review', (req, res) => {
  res.render('index', { center: 'review' });
});

// 병원 데이터 가져오는 API 라우트
app.get('/api/hospitals', (req, res) => {
  connection.query('SELECT * FROM hospitals', (error, results) => {
    if (error) {
      console.error('데이터베이스 조회 오류:', error);
      res.status(500).send('서버 오류');
      return;
    }
    res.json(results);
  }); 
});

// 병원 상세 정보 페이지 라우트
app.get('/detail/:id', (req, res) => {
  const hospitalId = req.params.id;
  console.log('Hospital ID:', hospitalId);  // 로그 추가
  connection.query(db_sql.hospital_select_one, [hospitalId], (error, results) => {
    if (error) {
      console.error('데이터베이스 조회 오류:', error);
      res.status(500).send('서버 오류');
      return;
    }
    console.log('Results:', results);  // 로그 추가
    if (results.length > 0) {
      res.render('index', { center: 'detail', hospital: results[0] });
    } else {
      res.status(404).send('Hospital not found');
    }
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
