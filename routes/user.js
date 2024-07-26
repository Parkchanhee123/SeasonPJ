const express = require('express');
const router = express.Router();
const db_connect = require('../db/db_connect');
const db_sql = require('../db/db_sql');
const logined = require('../util/logined');

// MySQL 데이터베이스 연결
router.get('/detail', (req, res) => {
    const id = req.user.id;
    const conn = db_connect.getConnection();

    // 사용자 정보 조회
    conn.query(db_sql.cust_select_one, [id], (err, result, fields) => {
        if (err) {
            console.error('Select Error:', err);
            res.status(500).send('Server Error: Failed to retrieve user information');
            db_connect.close(conn);
            return;
        }

        const userinfo = result[0];

        // 사용자의 예약 정보 조회
        conn.query(db_sql.reserv_select_by_user, [id], (err, reservations, fields) => {
            if (err) {
                console.error('Select Error:', err);
                res.status(500).send('Server Error: Failed to retrieve reservation information');
                db_connect.close(conn);
                return;
            }

            logined.go(req, res, { 'center': 'user/detail', 'userinfo': userinfo, 'reservations': reservations });
            db_connect.close(conn);
        });
    });
});

router.post("/updateimpl", (req, res) => {
    let id = req.body.id;        //post 방식일때는 body에서 가져옴
    let pwd = req.body.pwd;
    let name = req.body.name;
    let acc = req.body.acc;
    console.log(id + ' ' + pwd + ' ' + name + ' ' + acc);
    let values = [pwd, name, acc, id];

    const conn = db_connect.getConnection();

    conn.query(db_sql.cust_update, values, (e, result, fields) => {
        try {
            if (e) {
                console.error('Insert Error:', e);
                throw e;
            } else {
                console.log('Insert OK !');
                res.redirect('/user/detail');            //기존에 서버에 만들어뒀던걸 리다이렉트
            }
        } catch (err) {
            console.error('Error:', err);
            res.status(500).send('Server Error: Failed to update user information');
        } finally {
            db_connect.close(conn);
        }
    });
});

module.exports = router;
