module.exports = {
    // 병원 관련 SQL 쿼리
    hospital_select_one: 'SELECT * FROM hospitals WHERE id = ?', // 아이디가 ?인 항목 조회
    hospital_insert: 'INSERT INTO hospitals (id, addr, XPos, YPos, clCd, clCdNm, cmdcGdrCnt, cmdcIntnCnt, cmdcResdntCnt, cmdcSdrCnt, detyGdrCnt, detyIntnCnt, detyResdntCnt, detySdrCnt, drTotCnt, emdongNm, estbDd, hospUrl, mdeptGdrCnt, mdeptIntnCnt, mdeptResdntCnt, mdeptSdrCnt, pnursCnt, postNo, sgguCd, sgguCdNm, sidoCd, sidoCdNm, telno, yadmNm, ykiho) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    hospital_update: 'UPDATE hospitals SET addr=?, XPos=?, YPos=?, clCd=?, clCdNm=?, cmdcGdrCnt=?, cmdcIntnCnt=?, cmdcResdntCnt=?, cmdcSdrCnt=?, detyGdrCnt=?, detyIntnCnt=?, detyResdntCnt=?, detySdrCnt=?, drTotCnt=?, emdongNm=?, estbDd=?, hospUrl=?, mdeptGdrCnt=?, mdeptIntnCnt=?, mdeptResdntCnt=?, mdeptSdrCnt=?, pnursCnt=?, postNo=?, sgguCd=?, sgguCdNm=?, sidoCd=?, sidoCdNm=?, telno=?, yadmNm=?, ykiho=? WHERE id=?',
    hospital_delete: 'DELETE FROM hospitals WHERE id = ?',
    hospital_select: 'SELECT * FROM hospitals',
    hospital_select_sgguCdNm : 'SELECT * FROM hospitals WHERE sidoCdNm = ?',

    cust_select:'SELECT * FROM users',
    cust_select_one:'SELECT * FROM users WHERE id = ?',         
    cust_insert:'INSERT INTO users (id,pwd,name, acc) VALUES (?,?,?,?)',
    cust_update: 'UPDATE users SET pwd=?, name=?, acc=? WHERE id=?',
    cust_delete:'DELETE FROM users WHERE id = ?'
};
