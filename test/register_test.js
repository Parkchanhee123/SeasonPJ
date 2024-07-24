var path = require('path');
var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');       

conn = db_connect.getConnection();

let id = 'test1';
let pwd = 'test';
let name = 'test user';
let acc = '189816516';
let values = [id,pwd,name,acc];

conn.query(db_sql.cust_insert, values, (e, result, fields) => {
    if(e){
        console.log('Insert Error');
        console.log('Error Message:' + e);
    }else{
        console.log('Insert OK !');
    }
    db_connect.close(conn);
});