const mysql = require('mysql2');
const config = require('./db_config');

module.exports = {
  getConnection:function(){
    return mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database
    });
  },
  close:function(conn){
    console.log('Close..');       
    conn.end();         //커넥션 종료
  }

}