const express = require('express');
const router = express.Router();
const db_connect = require('../db/db_connect');
const db_sql = require('../db/db_sql');
const logined = require('../util/logined');

// MySQL 데이터베이스 연결
router.get('/detail', (req, res) => {
    const id = req.user.id;
    const conn = db_connect.getConnection();
    conn.query(db_sql.cust_select_one, [id], (err, result, fields) => {
        try {
            if (err) {
                console.log('select Error');
                throw err;
            } else {
                userinfo = result[0];
                logined.go(req, res, { 'center': 'user/detail', 'userinfo': userinfo });
            }
        } catch (err) {
            console.log(err);
        } finally {
            db_connect.close(conn);
        }
    });
});

router.post("/updateimpl", (req, res) => {
    let id = req.body.id;        //post 방식일때는 body에서 가져옴
    let pwd = req.body.pwd;
    let name = req.body.name;
    let acc = req.body.acc;
    console.log(id + ' ' + pwd + ' ' + name + ' ' + acc);
    let values = [pwd, name, acc, id];

    conn = db_connect.getConnection();

    conn.query(db_sql.cust_update, values, (e, result, fields) => {
        try {
            if (e) {
                console.log('Insert Error');
                throw e;
            } else {
                console.log('Insert OK !');
                res.redirect('/user/detail');            //기존에 서버에 만들어뒀던걸 리다이렉트
            }
        } catch (err) {
            console.log(err);
        } finally {
            db_connect.close(conn);
        }
    });
});

module.exports = router;
