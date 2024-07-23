const e = require('express');
var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');  // __dirname = 현재 프로젝트 폴더 이름

// MySQL 데이터베이스 연결
conn = db_connect.getConnection();

let sido = '경기';

// MySQL 쿼리 실행
conn.query(db_sql.hospital_select_sgguCdNm, [sido], (err, result, fields) => {
    try {
        if (err) {
            console.log('Select Error');
            throw err;
        } else {
            console.log(result);  // 일반 결과 받음
            console.log(JSON.stringify(result));  // JSON으로도 결과 받음
        }
    
    }catch {
        console.log(err);
    }finally {
        db_connect.close(conn);

    }
   
    // 연결 종료
});
