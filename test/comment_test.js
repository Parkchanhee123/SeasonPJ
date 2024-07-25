var path = require('path');
var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');       

conn = db_connect.getConnection();

let hos = '123';
let userid = 'pwd04';
let comm = '이말숙1';
let values = [0,userid,comm, hos];

conn.query(db_sql.review_insert, values, (e, result, fields) => {
    if(e){
        console.log('Insert Error');
        console.log('Error Message:' + e);
    }else{
        console.log('Insert OK !');
    }
    db_connect.close(conn);
});