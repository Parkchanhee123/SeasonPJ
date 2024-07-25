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

router.get("/", (req, res) => { 
    let id = req.body.id;
    const conn = db_connect.getConnection();
    conn.query(db_sql.reviews_select_one, function (err, result, fields) {
        try {
            if (err) {
                console.log('Select Error:', err);
                throw err;
            }
            logined.go(req, res, { center: 'review/post', datas: result }); // 템플릿에 데이터 전달
        } catch (e) {
            console.log(e);
        } finally {
            db_connect.close(conn);
        }
    });
});

module.exports = router;
