const { app_id, app_secret, birthday1, birthday2, city, loveStr, love_date, template_id, tian_api, user: { forEach } } = require("./config")
const axios = require('axios');

// 导入 dayjs 模块
const dayjs = require("dayjs")
// 导入 dayjs 插件
const weekday = require('dayjs/plugin/weekday')
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter")
// 使用 dayjs 插件
dayjs.extend(weekday)
dayjs.extend(isSameOrAfter);

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const axiosPost = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
}, axiosGet = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(url, { params, }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
};

// 获取token
const getToken = async () => {
  let { data: { access_token } } = await axiosGet('https://api.weixin.qq.com/cgi-bin/token', {
    grant_type: 'client_credential',
    appid: app_id,
    secret: app_secret,
  });
  return access_token;
}
// 获取天气情况
const get_weather = async () => {
  let { data: { data: { list } } } = await axiosGet(`http://autodev.openspeech.cn/csp/api/v2.1/weather`, {
    openId: "aiuicus",
    clientType: "h5",
    sign: "h5",
    city: city
  })
  return list[0]
}

// 获取天行数据
const getTianHnag = async type => {
  let { data: { newslist } } = await axiosGet("http://api.tianapi.com/" + type, { key: tian_api })
  console.log(type + ':' + JSON.stringify(newslist));
  return newslist[0].content
}

// 获取当前时间：格式 2022年8月25日 星期五
const getCurrentDate = () => dayjs().format('YYYY-MM-DD') + " " + {
  1: "星期一", 2: "星期二", 3: "星期三", 4: "星期四", 5: "星期五", 6: "星期六", 0: "星期日",
}[dayjs().weekday()]; // 当前星期几

// 计算生日还有多少天
const brthDate = brth => {
  // nowTime:当前时间 birthday:今年的生日
  let nowTime = new Date(), birthday = new Date(nowTime.getFullYear(), brth.split('-')[1] - 1, brth.split('-')[2]);
  //今年生日已过，则计算距离明年生日的天数
  if (birthday < nowTime) birthday.setFullYear(nowTime.getFullYear() + 1);
  return Math.ceil((birthday - nowTime) / (24 * 60 * 60 * 1000))
}

//判断是否为闰年(闰年366天 平年365天)
const isLeap = year => year % 4 == 0 && year % 100 != 0 || year % 400 == 0 ? true : false;

// 判断是否今天生日
const get_birthday = user => {
  let isl = isLeap(new Date().getFullYear());
  let brth = brthDate(user.birthday);
  return isl && brth === 366 || !isl && brth === 365 ? `这是属于${user.name}特别的一天，生日快乐🎉🎉` : `距离${user.name}的生日还有${brth}天`;
}

// 土味情话
const sweetNothings = async () => {
  let { data: { word } } = await axiosGet("https://api.1314.cool/words/api.php?return=json")
  return loveStr ? loveStr : word.replace(/<br>/g, "\n")
}

// 随机颜色
const randomColor = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16);

// 推送模板消息
const templateMessageSend = async () => {
  const token = await getToken();
  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`;
  let weatherInfo = await get_weather(); // 天气信息
  let together_day = dayjs().diff(love_date, "day"); // 计算在一起的天数
  let loveStr = await sweetNothings(); // 每日情话
  let zaoAn = await getTianHnag('zaoan'); // 早安寄语
  let wanAn = await getTianHnag('wanan'); // 晚安寄语
  let pyq = await getTianHnag('pyqwenan'); // 朋友圈文案
  let birth1 = get_birthday(birthday1);// 生日
  let birth2 = get_birthday(birthday2);
  const params = {
    template_id: template_id, // 模板id
    url: 'http://weixin.qq.com/download',
    topcolor: '#FF0000',
    data: {
      // 当前日期
      nowDate: { value: getCurrentDate(), color: randomColor(), },
      // 省份
      province: { value: weatherInfo.province, color: randomColor(), },
      // 城市
      city: { value: weatherInfo.city, color: randomColor(), },
      // 天气
      weather: { value: weatherInfo.weather, color: randomColor(), },
      // 当前气温
      temp: { value: weatherInfo.temp + "°C", color: randomColor(), },
      // 最低气温
      low: { value: weatherInfo.low + "°C", color: randomColor(), },
      // 最高气温
      high: { value: weatherInfo.high + "°C", color: randomColor(), },
      // 风向
      wind: { value: weatherInfo.wind, color: randomColor(), },
      // 空气质量
      airQuality: { value: weatherInfo.airQuality, color: randomColor(), },
      // 湿度
      humidity: { value: weatherInfo.humidity, color: randomColor(), },
      // 生日1
      birthday1: { value: birth1, color: randomColor(), },
      // 生日2
      birthday2: { value: birth2, color: randomColor(), },
      // 在一起的天数
      loveDays: { value: together_day, color: randomColor(), },
      // 早安心语
      zaoan: { value: zaoAn, color: randomColor(), },
      // 晚安心语
      wanan: { value: wanAn, color: randomColor(), },
      // 朋友圈文案
      pyqwenan: { value: pyq, color: randomColor(), },
      // 每日情话
      loveWords: { value: loveStr, color: randomColor(), },
    },
  };
  forEach(async item => {
    params.touser = item;
    let { data: { errcode } } = await axiosPost(url, params);
    console.log({
      40001: "推送消息失败! 请检查 appId/appSecret 是否正确",
      40003: "推送消息失败! 请检查微信号是否正确",
      40037: "推送消息失败! 请检查模板id是否正确",
      0: `${item}: 推送消息成功`,
    }[errcode]);
  })
}
// 调用函数，推送模板消息
// templateMessageSend(); // 第一次执行程序时会推送一次消息，如使用定时器

// 定时器（Cron）：定时推送消息
const schedule = require('node-schedule');
const scheduleCronstyle = () => {
  // 每天的早8点触发（定时器规则：秒/分/时/日/月/年，*号可理解为"每"的意思，如 0 0 8 * 这个*表示每日）
  schedule.scheduleJob('0 0 8 * * *', () => {
    templateMessageSend(); // 定时器执行
  });
}
scheduleCronstyle();
