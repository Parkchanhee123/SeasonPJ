const express = require('express');
var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql'); 

const conn = db_connect.getConnection();
let name = '%가톨릭%'; // 와일드카드 문자를 사용하여 '가톨릭'이 포함된 모든 데이터 검색

conn.query(db_sql.hospital_select_name, [name], (err, result, fields) => {
    if (err) {
        console.log('Select Error:', err);
    } else {
        if (result.length > 0) {
            console.log('Query Result:', result); 
            console.log('Result as JSON:', JSON.stringify(result));  
        } else {
            console.log('No records found');
        }
    }
    db_connect.close(conn);
});
