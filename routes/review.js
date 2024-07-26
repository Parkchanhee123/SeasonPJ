const express = require('express');
const router = express.Router();
const db_connect = require('../db/db_connect');
const db_sql = require('../db/db_sql');
const logined = require('../util/logined');

router.get("/", (req, res) => {
    const conn = db_connect.getConnection();
    conn.query(db_sql.reviews_select, function (err, result, fields) {
        try {
            if (err) {
                console.log('Select Error:', err);
                throw err;
            }
            logined.go(req, res, { center: 'review/list', datas: result }); // 템플릿에 데이터 전달
        } catch (e) {
            console.log(e);
        } finally {
            db_connect.close(conn);
        }
    });
});

// 리뷰작성 페이지
router.get('/post', (req, res) => {
    logined.go(req, res, { center: 'review/post' });
});

router.post("/addimpl", (req, res) => {
    let hos = req.body.hos;
    let userid = req.body.userid;
    let comm = req.body.comm;
    let title = req.body.title;
    let values = [null, title, userid, comm, hos];

    conn = db_connect.getConnection();

    conn.query(db_sql.review_insert, values, (e, result, fields) => {
        try {
            if (e) {
                console.log('Insert Error:', e);
                throw e;
            } else {
                console.log('Insert OK !');
                res.redirect('/review');
            }
        } catch (error) {
            console.log(error);
        } finally {
            db_connect.close(conn);
        }
    });
});

router.get("/detail", (req, res) => {
    let id = req.query.id;
    conn = db_connect.getConnection();
    conn.query(db_sql.review_select_one, [id], function (err, result, fields) {
        try {
            if (err) {
                console.log('Select Error:', err);
                throw err;
            } else {
                console.log(result);
                custinfo = result[0];
                logined.go(req, res, { 'center': 'review/detail', 'custinfo': custinfo });
            }
        } catch (err) {
            console.log(err);
        } finally {
            db_connect.close(conn);
        }
    });
});


module.exports = router;