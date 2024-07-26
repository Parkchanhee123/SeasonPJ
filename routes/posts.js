const express = require('express');
const router = express.Router();
const db_connect = require('../db/db_connect');
const db_sql = require('../db/db_sql');
const logined = require('../util/logined');


router.get("/", (req, res) => { 
    console.log('/posts :');

    
    const conn = db_connect.getConnection();
    conn.query(db_sql.reviews_select,function (err, result, fields)  {
        try {
            if (err) {
                console.log('Select Error:', err);
                throw err;
            }
            console.log(result);
            logined.go(req, res, { center: 'review/posts', posts: result }); // 템플릿에 데이터 전달
        } catch (e) {
            console.log(e);
        } finally {
            db_connect.close(conn);
        }
    });
});

router.get("/detail",(req,res)=>{   //상세페이지 확인
    let id = req.query.id;
    conn = db_connect.getConnection();
    conn.query(db_sql.review_select_one, id, (err, result, fields) => {
        try{
            if(err){
                console.log('Select Error');
                throw err;
            }else{
                console.log(result);
                detailinfo = result[0];
                logined.go(req, res, { 'center': 'review/detail','detailinfo':detailinfo});
            }
        }catch(err){
            console.log(err);
        }finally{
            db_connect.close(conn);
        }
    
    });
})

//작성 페이지 이동
.get("/reviews",(req,res)=>{  
    conn = db_connect.getConnection();

    conn.query('SELECT yadmNm FROM hospitals', (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            res.status(500).send('Server error');
            return;
        }
        // 병원 목록을 함께 렌더링
        console.log(results)
        logined.go(req, res, { center: 'review/reviews', hospitals: results });
    });
})

// 등록값 넣어주기
router.post("/reviews", (req,res)=>{
    let title = req.body.title;
    let name = req.body.name; 
    let visit_date = req.body.visit_date;
    let hospital_name = req.body.hospital_name;
    let rate = req.body.rate;
    let review = req.body.review;
    
    let values = [title,name,visit_date,hospital_name,rate,review];
    conn = db_connect.getConnection();
    conn.query(db_sql.review_insert_all, values, (err, result, fields) => {
        try{
            if(err){
                console.log('Insert Error');
                throw err;
            }else{
                console.log('Insert OK !');
                logined.go(req, res, { center: 'review/reviews' });
                // res.redirect('/reviews');
            }
        }catch(e){
            console.log(e);
        }finally{
            db_connect.close(conn);
        }
    });
})



module.exports = router;
