export default {
  dateTime(e) {
    // 時間轉換
    let old = new Date(e);
    let now = new Date()
    // 獲取old具體時間
    let d = old.getTime();
    let h = old.getHours();
    let m = old.getMinutes();
    let Y = old.getFullYear();
    let M = old.getMonth() + 1;
    let D = old.getDate();
    // 獲取now具體時間
    let nd = now.getTime();
    let nh = now.getHours();
    let nm = now.getMinutes();
    let nY = now.getFullYear();
    let nM = now.getMonth() + 1;
    let nD = now.getDate();

    // 當天時間
    if (D === nD && M === nM && Y === nY) {
      if (h < 10) {
        h = '0' + h;
      }
      if (m < 10) {
        m = '0' + m;
      };
      return h + ':' + m;
    }

    // 昨天時間
    if (D + 1 === nD && M === nM && Y === nY) {
      if (h < 10) {
        h = '0' + h;
      }
      if (m < 10) {
        m = '0' + m;
      };
      return '昨天' + h + ':' + m;
    } else { // 大於兩天
      return Y + '/' + M + '/' + D
    }
  }
}