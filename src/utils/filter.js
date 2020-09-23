import history from "../components/common/History";
import { message } from "antd/lib/index";
import qs from 'qs';
import moment from "moment";
import { getEnv } from './env'


export const formatNumberNN = (number) => {
    return `${number < 10 ? '0' : ''}${number}`
};

export const formatDateYYMMDDhhmmss = (timestamp) => {
    let date = new Date(timestamp);
    let Y = date.getFullYear();
    let M = formatNumberNN(date.getMonth() + 1);
    let D = formatNumberNN(date.getDate());
    let h = formatNumberNN(date.getHours());
    let m = formatNumberNN(date.getMinutes());
    let s = formatNumberNN(date.getMinutes());
    return `${Y}-${M}-${D} ${h}:${m}:${s}`
};

export const formatDateTime = (UnixTime) => {
    let date = new Date(UnixTime * 1000);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

export const formatDateDay = (UnixTime) => {
    let date = new Date(UnixTime * 1000);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
};

export const formatDateYMDhms = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let Y = date.getFullYear();
    let M = formatNumberNN(date.getMonth() + 1);
    let D = formatNumberNN(date.getDate());
    let h = formatNumberNN(date.getHours());
    let m = formatNumberNN(date.getMinutes());
    let s = formatNumberNN(date.getMinutes());
    return `${Y}-${M}-${D} ${h}:${m}:${s}`
};

export const formatDatehhmmss = (times) => {
    let min = Math.floor(times % 3600);
    return formatNumberNN(Math.floor(times / 3600)) + ":" + formatNumberNN(Math.floor(min / 60)) + ":" + formatNumberNN(times % 60);
};

export function getToken(key) {
    return localStorage.getItem(key)
}

export function setToken(key, value) {
    return localStorage.setItem(key, value)
}

export function removeToken(key) {
    return localStorage.removeItem(key)
}

export function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken('access_token')
    }
}
export function getHeaders1() {
    return {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer " + getToken('access_token')
    }
}
export function authHeader() {
    if (process.env.NODE_ENV === 'development') {
        return {
            "Authorization": "Basic Y29uc29sZTo="
        }
    } else {
        if (window.location.href.indexOf('mostest') !== -1 || window.location.href.indexOf('mospre') !== -1) {
            return {
                "Authorization": "Basic Y29uc29sZTo="
            }
        } else {
            return {
                "Authorization": "Basic Y29uc29sZTo="
            }
        }
    }
}

export const liveState = (status) => {
    if (status === 0) {
        return "直播前"
    } else if (status === 1) {
        return "直播中"
    } else if (status === 2) {
        return "直播结束"
    } else {
        return "直播回放"
    }
};

export const openCourseUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return 'https://wxtest.kaikeba.com';
    } else {
        if (window.location.href.indexOf('mostest') !== -1) {
            return 'https://wxtest.kaikeba.com';
        } else if (window.location.href.indexOf('mospre') !== -1) {
            return 'https://wxpre.kaikeba.com';
        } else {
            return 'https://wx.kaikeba.com';
        }
    }
};
export const vipCourseUrl = (appid) => {
    let vipCour = null;
    if (appid) {
        vipCour = 'vip_course'
    } else {
        vipCour = 'vipcourse'
    }

    if (process.env.NODE_ENV === 'development') {
        // return 'https://wxtest.kaikeba.com/vip_course/';
        return `https://wxtest.kaikeba.com/${vipCour}/`;
    } else {
        if (window.location.href.indexOf('mostest') !== -1) {
            return `https://wxtest.kaikeba.com/${vipCour}/`;
        } else if (window.location.href.indexOf('mospre') !== -1) {
            return `https://wxpre.kaikeba.com/${vipCour}/`;
        } else {
            return `https://wx.kaikeba.com/${vipCour}/`;
        }
    }
};

export const baseUrl = () => {
    if (getEnv === 'dev' || getEnv === 'test') {
        return 'https://consoletest.kaikeba.com';
        // return 'https://console.kaikeba.com';
        // return  'http://192.168.85.76:9090';  // bx
        // return "http://192.168.87.199:9090" //zq
    } else {
        if (getEnv === 'test') {
            return 'https://consoletest.kaikeba.com';
        } else if (getEnv === 'pre') {
            return 'https://consolepre.kaikeba.com';
        } else if (getEnv === 'prod') {
            return 'https://console.kaikeba.com';
        }
    }
};

export const wechatUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return 'https://opentest.kaikeba.com';
        // return  'http://192.168.86.98:9090';
    } else {
        if (window.location.href.indexOf('mostest') !== -1) {
            return 'https://opentest.kaikeba.com';
        } else if (window.location.href.indexOf('mospre') !== -1) {
            return 'https://openpre.kaikeba.com';
        } else {
            return 'https://open2.kaikeba.com';
        }
    }
};

// 判断无学科属性的权限
export const noSubjectAuthor = (auth) => {
    return getToken('userAuthorList').indexOf(auth) === -1 ? false : true
};

// 判断有学科属性的用户权限
let bool = '';
export const userAuthor = (auth) => {
    let userAuthorList = JSON.parse(getToken('userAuthorList'));
    if (getToken('userAuthorList').indexOf(auth) === -1) {
        bool = false
    } else {
        for (let i in userAuthorList) {
            if (userAuthorList[i].permission === auth && userAuthorList[i].subjects === null) {
                bool = false;
                break;
            } else {
                bool = true;
            }
        }
    }
    return bool
};

// 学科权限
export const authSubject = (record) => {
    let bool = false;
    let userAuthorList = JSON.parse(getToken('userAuthorList'));
    for (let i in userAuthorList) {
        if (userAuthorList[i].permission === 'marketing:opencourse:manage') {
            for (let j in record.subjects) {
                if (record.subjects !== null && userAuthorList[i].subjects !== null) {
                    if (userAuthorList[i].subjects.indexOf(record.subjects[j]) !== -1) {
                        bool = true;
                        break
                    }
                } else {
                    bool = true;
                    break
                }
            }
        }
    }
    return bool;
};

// 学员查看
export const studentSubject = (record) => {
    let student = false;
    let userAuthorList = JSON.parse(getToken('userAuthorList'));
    for (let i in userAuthorList) {
        if (userAuthorList[i].permission === 'marketing:opencourse:student') {
            for (let j in record.subjects) {
                if (record.subjects !== null && userAuthorList[i].subjects !== null) {
                    if (userAuthorList[i].subjects.indexOf(record.subjects[j].toString()) !== -1) {
                        student = true;
                        break
                    }
                } else {
                    student = true;
                    break
                }
            }
        }
    }
    return student
};

// 公开课权限
export const openAuthor = (auth, subjects) => {
    let bool = false;
    let userAuthorList = JSON.parse(getToken('userAuthorList'));
    for (let i in userAuthorList) {
        if (userAuthorList[i].permission === auth) {
            for (let j in subjects) {
                if (subjects !== null && userAuthorList[i].subjects !== null) {
                    if (userAuthorList[i].subjects.indexOf(subjects[j].toString()) !== -1) {
                        bool = true;
                        break
                    }
                }
            }
        }
    }
    return bool
};

// vip课权限封装
export const vipAuthor = (auth, id) => {
    let userAuthorList = JSON.parse(getToken('userAuthorList'));
    if (getToken('userAuthorList').indexOf(auth) === -1) {
        bool = false
    } else {
        for (let i in userAuthorList) {
            if (userAuthorList[i].permission === auth && userAuthorList[i].subjects === null) {
                bool = false;
                break;
            } else if (userAuthorList[i].permission === auth && userAuthorList[i].subjects.indexOf(id.toString()) === -1) {
                bool = false;
                break;
            } else {
                bool = true;
            }
        }
    }
    return bool
};

// 过滤表情符
export const emojiRule = () => {
    return /([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g;
};

export const handEmojiCharacter = (substring) => {
    for (let i = 0; i < substring.length; i++) {
        let hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
                let ls = substring.charCodeAt(i + 1);
                let uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                if (0x1d000 <= uc && uc <= 0x1f77f) {
                    return true;
                }
            }
        } else if (substring.length > 1) {
            let ls = substring.charCodeAt(i + 1);
            if (ls === 0x20e3) {
                return true;
            }
        } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
                return true;
            } else if (0x2B05 <= hs && hs <= 0x2b07) {
                return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
                return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
                return true;
            } else if (hs === 0xa9 || hs === 0xae || hs === 0x303d || hs === 0x3030
                || hs === 0x2b55 || hs === 0x2b1c || hs === 0x2b1b
                || hs === 0x2b50) {
                return true;
            }
        }
    }
};
//过滤表情
export const filterEmoji = (username) => {
    let ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]'
    ];
    username = username.replace(new RegExp(ranges.join('|'), 'g'), '')
    return username
};

//人民币数字处理
export const returnFloat = (value) => {
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }
};


// vip course 模块图表时间
// 获取当前年
export const getYear = () => {
    let year = [];
    for (let i = 1; i <= 12; i++) {
        year.push(i + '月')
    }
    return year;
};

// 获取当前月
export const getMonth = () => {
    let daysOfMonth = [];
    let fullYear = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let lastDayOfMonth = new Date(fullYear, month, 0).getDate();
    for (var i = 1; i <= lastDayOfMonth; i++) {
        daysOfMonth.push(String(month).padStart(2, '0') + '-' + String(i).padStart(2, '0'));
    };
    return daysOfMonth;
};

// 获取当前周
export const getWeek = () => {
    const dateOfToday = Date.now();
    const dayOfToday = (new Date().getDay() + 7 - 1) % 7;
    const daysOfThisWeek = Array.from(new Array(7))
        .map((_, i) => {
            const date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24);
            return String(date.getMonth() + 1).padStart(2, '0') +
                '-' +
                String(date.getDate()).padStart(2, '0')
        });
    return daysOfThisWeek;
};

// 获取当前天
export const getDay = () => {
    let days = [];
    for (let i = 0; i <= 23; i++) {
        days.push(formatNumberNN(i) + ':00')
    }
    return days
};

// 图表横坐标
let dateDay = '';
export const getChartData = (date) => {
    let chartDate = [];
    if (date === 'year') {
        dateDay = getYear();
    } else if (date === 'month') {
        dateDay = getMonth();
    } else if (date === 'week') {
        dateDay = getWeek();
    } else if (date === 'today') {
        dateDay = getDay();
    }
    for (let i = 0; i < dateDay.length; i++) {
        chartDate.push(dateDay[i])
    }
    return chartDate;
};
//自动补齐两位小数
export const returnFloats = (value) => {
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }
};

// 保留两位小数
export const getNum = (s, n) => {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    let l = s.split(".")[0].split("").reverse(), r = s.split(".")[1], t = "";
    for (let i = 0; i < l.length; i++) {
        t += l[i];
    }
    return t.split("").reverse().join("") + "." + r;
};

// 展示价格格式
export const priceType = (s, n) => {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    let l = s.split(".")[0].split("").reverse(), r = s.split(".")[1], t = "";
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
};

// 禁选日期(之后)
export const disabledDate = current => current && current > moment().endOf('day') || current < moment().subtract(12, 'months');

// 禁选日期(之前)
export const disabledDateBefore = current => {
    return current && current < moment().subtract(7, "minutes");
};

// number
export const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};
export const disabledRangeTime = (data, type) => {
    if (type === 'start') {
        if (data !== undefined) {
            console.log(data._d, "111")
        }
        return {
            disabledHours: () => range(0, 60).splice(0, 20),
            disabledMinutes: () => [],
            disabledSeconds: () => [],
        };
    }
};


export const calculateDiffTime = (start, end) => {
    let utc = end - start;

    let day = Math.round(utc / (24 * 60 * 60 * 1000)); // 天

    let h = Math.round(utc / (60 * 60 * 1000)); //小时

    let m = Math.round(utc / (60 * 1000)); // 分

    return [day, h, m]
};

export const getAllDate = (begin, end) => {
    let arr = [];
    let ab = begin.split("-");
    let ae = end.split("-");
    let db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    let de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    let unixDb = db.getTime() - 24 * 60 * 60 * 1000;
    let unixDe = de.getTime() - 24 * 60 * 60 * 1000;
    for (let k = unixDb; k <= unixDe;) {
        k = k + 24 * 60 * 60 * 1000;
        arr.push((new Date(parseInt(k))).getFullYear() + '-' + formatNumberNN((new Date(parseInt(k))).getMonth() + 1) + '-' + formatNumberNN((new Date(parseInt(k))).getDate()));
    }
    return arr;
};

/**
 **datestr:形如‘2017-06-12’的字符串
 **return Date 对象
 **/
function getDate(datestr) {
    let temp = datestr.split("-");
    if (temp[1] === '01') {
        temp[0] = parseInt(temp[0], 10) - 1;
        temp[1] = '12';
    } else {
        temp[1] = parseInt(temp[1], 10) - 1;
    }
    //new Date()的月份入参实际都是当前值-1
    let date = new Date(temp[0], temp[1], temp[2]);
    return date;
}
/**
 ***获取两个日期间的所有日期
 ***默认start<end
 **/
function getDiffDate(start, end) {
    let startTime = getDate(start);
    let endTime = getDate(end);
    let dateArr = [];
    while ((endTime.getTime() - startTime.getTime()) >= 0) {
        let year = startTime.getFullYear();
        let month = startTime.getMonth().toString().length === 1 ? "0" + (parseInt(startTime.getMonth().toString(), 10) + 1) : (startTime.getMonth() + 1);
        let day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime.getDate();
        dateArr.push(year + "-" + month + "-" + day);
        startTime.setDate(startTime.getDate() + 1);
    }
    return dateArr;
}

export const getXDate = (start, end) => {
    let arr = getDiffDate(start, end);
    console.log(start, end, arr, "============返回的时间段之间的日期")
    if (arr.length === 1) {
        return {
            type: 'today',
            xDate: getDay(),
            date: arr
        }
    } else if (arr.length <= 31) {
        let day = [];
        for (let i = 0; i < arr.length; i++) {
            day.push(arr[i].split('-')[1] + '-' + arr[i].split('-')[2])
        }
        return {
            type: 'month',
            xDate: day,
            date: arr
        }
    } else if (arr.length > 31 && arr.length < 180) {
        let week = [];
        let weekCount = Math.ceil(arr.length / 7);
        for (let i = 1; i <= weekCount; i++) {
            week.push('第' + i + '周')
        }
        return {
            type: 'month_week',
            xDate: week,
            date: arr
        }
    } else if (arr.length > 180) {
        let month = [], array = [];
        let start = arr[0].split('-');
        let end = arr[arr.length - 1].split('-');
        if (parseInt(start[0]) === parseInt(end[0])) {
            for (let i = parseInt(start[1]); i <= parseInt(end[1]); i++) {
                month.push(i + '月');
                array.push(start[0] + '-' + formatNumberNN(i))
            }
        } else {
            for (let i = parseInt(start[1]); i <= 12; i++) {
                month.push(i + '月');
                array.push(start[0] + '-' + formatNumberNN(i))
            }
            for (let i = 1; i <= parseInt(end[1]); i++) {
                month.push(i + '月');
                array.push(end[0] + '-' + formatNumberNN(i))
            }
        }
        return {
            type: 'year',
            xDate: month,
            date: array
        };
    }
};

export const timeToDate = (time) => {
    return (new Date(time)).getFullYear() + '-' + formatNumberNN((new Date(time)).getMonth() + 1) + '-' + formatNumberNN((new Date(time)).getDate())
};

// 判断是是否是pc端 Browser
export const IsPC = () => {
    let userAgentInfo = navigator.userAgent;
    let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
};

// 设置title
export const setTitle = (title) => {
    document.getElementById('title').innerText = title;
};

// status
export const renderPaymentMethod = (id) => {
    if (id === 0) {
        return '支付宝'
    } else if (id === 1) {
        return '微信'
    } else if (id === 2) {
        return '贷款'
    } else if (id === 3) {
        return '腾讯课堂'
    } else if (id === 4) {
        return '网易云课堂'
    } else if (id === 5) {
        return '信用卡分期'
    } else if (id === 6) {
        return '开课吧-工行'
    } else if (id === 7) {
        return '开课吧-支付宝'
    } else if (id === 8) {
        return '开课吧-微信'
    } else if (id === 9) {
        return '芝士分期'
    }
};

// status
export const renderPayType = (id) => {
    if (id === 0) {
        return '全款'
    } else if (id === 1) {
        return '订金'
    } else if (id === 2) {
        return '尾款'
    } else if (id === 96) {
        return '折扣'
    } else if (id === 97) {
        return '优惠券'
    } else if (id === 98) {
        return '积分'
    } else if (id === 99) {
        return '其它'
    }
};

// status
export const renderOrderState = (status) => {
    if (status === 0) {
        return '待处理'
    } else if (status === 1) {
        return '处理中'
    } else if (status === 2) {
        return '已完成'
    } else if (status === 3) {
        return '已超时'
    } else if (status === 4) {
        return '已退款'
    } else if (status === 5) {
        return '部分退款'
    } else if (status === 6) {
        return '已取消'
    } else if (status === 7) {
        return '已退回'
    }
};


export const payStatus = (statu) => {
    let status = Number(statu)
    if (status === 0) {
        return '已创建'
    } else if (status === 1) {
        return '放款成功'
    } else if (status === 2) {
        return '放款失败'
    } else if (status === 3) {
        return '机构待确认'
    } else if (status === 4) {
        return '可请款'
    } else if (status === 5) {
        return '已请款'
    } else if (status === 6) {
        return '暂停放款'
    } else if (status === 7) {
        return '交易取消'
    } else if (status === 8) {
        return '处理中'
    } else if (status === 9) {
        return '待放款'
    } else if (status === 10) {
        return '资料待完善'
    } else if (status === 11) {
        return '审核中'
    } else if (status === 12) {
        return '资金处理中'
    } else {
        return '/'
    }
}

export const auditState = (statu) => {
    let status = Number(statu);
    if (isNaN(status)) { return '' }
    if (status === 0) {
        return '待审核'
    } else if (status === 1) {
        return '审核通过'
    } else if (status === 2) {
        return '审核中'
    } else if (status === 3) {
        return '审核拒绝'
    } else if (status === 4) {
        return '审核取消'
    } else if (status === 5) {
        return '审核退回'
    } else {
        return '/'
    }
};

//线索中心-线索状态
export const renderConfirmState = (status, type) => {
    if (status == 1) {
        return '已确认'
    } else if (status == 0) {
        return '待确认'
    }
};
//线索中心-公共线索状态
export const renderClueState = (status) => {
    switch (status) {
        case 0:
            return '0';
            break;
        case 1:
            return '1';
            break;
        case 2:
            return '2';
            break;
        case 3:
            return '3';
            break;
        case 4:
            return '4';
            break;
        case 5:
            return '5';
            break;
        case 6:
            return '6';
            break;
    }
};

export const renderOrderStateColor = (status) => {
    if (status === 0) {
        return '#E25033'
    } else if (status === 1) {
        return '#38D7C0'
    } else if (status === 2) {
        return '#38D7C0'
    } else if (status === 3) {
        return '#38D7C0'
    } else if (status === 4) {
        return '#38D7C0'
    } else if (status === 5) {
        return '#38D7C0'
    } else if (status === 6) {
        return '#38D7C0'
    }
};

// 钉钉企业id
export const ddCompanyId = () => {
    if (process.env.NODE_ENV === 'development') {
        return 'ding3605591b852ace34';
    } else {
        if (window.location.href.indexOf('mostest') !== -1) {
            return 'ding3605591b852ace34';
        } else if (window.location.href.indexOf('mospre') !== -1) {
            return 'ding3605591b852ace34';
        } else {
            return 'ding3605591b852ace34';
        }
    }
};

export const accessToken = () => {
    if (process.env.NODE_ENV === 'development') {
        return { accessToken: 'access_token', refreshToken: 'refresh_token' };
    } else {
        if (window.location.href.indexOf('mostest') !== -1) {
            return { accessToken: 'access_token_test', refreshToken: 'refresh_token_test' };
        } else if (window.location.href.indexOf('mospre') !== -1) {
            return { accessToken: 'access_token_pre', refreshToken: 'refresh_token_pre' };
        } else {
            return { accessToken: 'access_token_prod', refreshToken: 'refresh_token_prod' };
        }
    }
};

// 刷新token
export function refreshToken() {
    let xhr = new XMLHttpRequest(),
        data = qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: getToken('refresh_token')
        });
    xhr.open("POST", baseUrl() + '/uaa/oauth/token', true);
    // 添加http头，发送信息至服务器时内容编码类型
    xhr.setRequestHeader("Authorization", authHeader().Authorization);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 304) {
                let res = JSON.parse(xhr.responseText);
                setToken('access_token', res.access_token);
                setToken('refresh_token', res.refresh_token);
                setTimeout(function () {
                    window.history.go(0);
                }, 2000);
            } else if (xhr.status === 400 || xhr.status === 404 || xhr.status === 401) {
                // message.error('400/404 接口请求失败，请重试！如有疑问，联系管理员。');
                removeToken('access_token');
                removeToken('refresh_token');
                if (navigator.userAgent.indexOf('DingTalk') !== -1) {
                    window.location.reload();
                } else {
                    history.push('/login')
                }
            } else {
                message.error('500服务端错误，请稍后重试！');
                removeToken('access_token');
                removeToken('refresh_token');
                history.push('/login')
            }
        }
    };
    xhr.send(data);
}
export const userScalable = () => {
    var phoneWidth = parseInt(window.screen.width);
    var phoneScale = phoneWidth / 370;
    var ua = navigator.userAgent;
    if (/Android (\d+\.\d+)/.test(ua)) {
        var version = parseFloat(RegExp.$1);
        if (version > 2.3) {
            document.write('<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', target-densitydpi=device-dpi">');
        } else {

            document.write('<meta name="viewport" content="width=device-width, target-densitydpi=device-dpi">');
        }
    } else {
        document.write('<meta name="viewport" content="width=device-width, user-scalable=no, target-densitydpi=device-dpi">');
    }
};
export const PromotionFilterObj = (obj) => {
    let newObj = {}
    let key = Object.keys(obj)
    let newKey = key[0].split('-')
    newObj.platformAttributeId = newKey[1]
    newObj.platformValue = obj[key[0]] || null
    return newObj
};
//学科类型转换
export const changeSubjectData = (param, list, type) => {
    for (let i = 0; i < list.length; i++) {
        if (type === 'name') {
            if (list[i].id == param) {
                return list[i].name
            }
        } else {
            if (list[i].name == param) {
                return list[i].id
            }
        }
    }
};

export const splitArr = (arr, num) => {
    if (!Array.isArray(arr)) return
    let newArr = []
    for (let i = 0; i < arr.length; i += num) {
        newArr.push(arr.slice(i, i + num))
    }
    return newArr;
}
