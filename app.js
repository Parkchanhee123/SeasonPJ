require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const logined = require('./util/logined');
const port = process.env.SERVER_PORT || 3000;

// session 저장소 지정(메모리)
const MemoryStore = require("memorystore")(session);

// Passport lib
const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;

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

// Session 선언
app.use(
  session({
      secret: "secret key",
      resave: false,
      saveUninitialized: true,
      store: new MemoryStore({
          checkPeriod: 86400000, // 24 hours
      })
  })
);

// Flash 메시지 미들웨어 설정
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Passport 초기화 및 session 연결
app.use(passport.initialize());
app.use(passport.session());

// 로그인 성공 시 호출되는 함수
passport.serializeUser(function (user, done) {
  console.log('serializeUser', user);
  done(null, user);
});

// local login 전략 설정
passport.use(
  new LocalStrategy(
      {
          usernameField: "id",
          passwordField: "pwd",
      },
      function (userid, password, done) {
          console.log('Login attempt:', userid, password);

          conn = db_connect.getConnection();
          conn.query(db_sql.cust_select_one, [userid], (err, row) => {
              if (err) return done(err);

              if (row[0] === undefined) {
                  return done(null, false, { message: "Invalid username or password." });
              } else if (row[0]['pwd'] !== password) {
                  return done(null, false, { message: "Invalid username or password." });
              } else {
                  return done(null, { id: userid, name: row[0]['name'], acc: row[0]['acc'] });
              }
          });
      }
  )
);

// 로그인 요청 처리
app.post(
  "/login",
  passport.authenticate("local", {
      successRedirect: "/center", // 로그인 성공 시 이동할 경로
      failureRedirect: "/login",   // 로그인 실패 시 이동할 경로
      failureFlash: true           // 플래시 메시지 활성화
  })
);

// 로그인 페이지 라우트
app.get('/login', (req, res) => {
  logined.go(req, res, {
      center: 'login',
      message: req.flash('error')  // 플래시 메시지 전달
  });
});

// 로그인 성공 후 이동할 페이지
app.get('/center', (req, res) => {
  logined.go(req, res, { center: 'center' });
});

// 회원가입 페이지 라우트
app.get('/register', (req, res) => {
  logined.go(req, res, { center: 'register' });
});

// 페이지 방문 시 호출되는 함수
passport.deserializeUser(function (user, done) {
  console.log('Login User', user.name, user.id);
  done(null, user);
});

app.post('/registerimpl', (req, res) => {
  // 입력값 받기
  let id = req.body.id;
  let pwd = req.body.pwd;
  let name = req.body.name;
  let acc = req.body.acc;
  console.log(id, pwd, name, acc);

  // DB에 입력 후 회원가입 완료 페이지로 리다이렉트
  let values = [id, pwd, name, acc];
  conn = db_connect.getConnection();

  conn.query(db_sql.cust_insert, values, (e) => {
      if (e) {
          console.log('Insert Error', e);
          throw e;
      } else {
          console.log('Insert OK !');
          logined.go(req, res, { center: 'registerok', name: name });
      }
  });
});

// 로그아웃 처리
app.get('/logout', (req, res) => {
  req.logout((err) => {
      if (err) { return next(err); }
      req.session.destroy();
      res.redirect('/');
  });
})

app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// 메인 페이지 라우트
app.get('/', (req, res) => {
  logined.go(req, res, { center: null });
});

// 지도 페이지 라우트
app.get('/map', (req, res) => {
  logined.go(req, res, { center: 'map' });
});

// 회원가입 페이지 라우트
app.get('/register', (req, res) => {
  logined.go(req, res, { center: 'register' });
});

// 로그인 페이지 라우트
app.get('/login', (req, res) => {
  logined.go(req, res, { center: 'login' });
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
          logined.go(req, res, {
            center: 'search',
            hospitals: results,
            currentPage: page,
            totalPages: totalPages,
            searchTerm: searchTerm || '',
            region: region || ''| ''
          });
      });
  });
});

app.get('/review', (req, res) => {
  logined.go(req, res, { center: 'review' });
});

// 병원 데이터 가져오는 API 라우트
app.get('/api/hospitals', (req, res) => {
  const conn = db_connect.getConnection();

  conn.query(db_sql.hospital_select, (error, results) => {
    if (error) {
      console.error('데이터베이스 조회 오류:', error);
      res.status(500).send('서버 오류');
    } else {
      res.json(results);
    }
    db_connect.close(conn);
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
      logined.go(req, res, { center: 'detail', hospital: results[0] });
    } else {
      res.status(404).send('Hospital not found');
    }
  });
});

const user = require('./routes/user');
app.use('/user', user);

// 마이페이지
app.get('/user', (req, res) => {
  logined.go(req, res, { center: 'userdetail' });
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
