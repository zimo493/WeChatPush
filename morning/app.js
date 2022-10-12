const config = require("./config")
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
  const params = {
    grant_type: 'client_credential',
    appid: config.app_id,
    secret: config.app_secret,
  };
  let res = await axiosGet('https://api.weixin.qq.com/cgi-bin/token', params);
  return res.data.access_token;
}
// 获取天气情况
const get_weather = async () => {
  const params = {
    openId: "aiuicus",
    clientType: "h5",
    sign: "h5",
    city: config.city
  }
  let res = await axiosGet(`http://autodev.openspeech.cn/csp/api/v2.1/weather`, params)
  return res.data.data.list[0]
}
get_weather()

// 获取天行数据
const getTianHnag = async type => {
  let params = {
    key: config.tian_api
  }
  let res = await axiosGet("http://api.tianapi.com/" + type, params)
  console.log(type + ':' + JSON.stringify(res.data.newslist));
  return res.data.newslist[0].content
}

// 获取当前时间：格式 2022年8月25日 星期五
const getCurrentDate = () => {
  let days = ""
  switch (dayjs().weekday()) { // 当前星期几
    case 1:
      days = '星期一';
      break;
    case 2:
      days = '星期二';
      break;
    case 3:
      days = '星期三';
      break;
    case 4:
      days = '星期四';
      break;
    case 5:
      days = '星期五';
      break;
    case 6:
      days = '星期六';
      break;
    case 0:
      days = '星期日';
      break;
  }
  return dayjs().format('YYYY-MM-DD') + " " + days
}

// 计算生日还有多少天
const brthDate = brth => {
  let month = brth.split('-')[1];
  let day = brth.split('-')[2];
  let nowTime = new Date();
  let thisYear = nowTime.getFullYear();
  //今年的生日
  let birthday = new Date(thisYear, month - 1, day);

  //今年生日已过，则计算距离明年生日的天数
  if (birthday < nowTime) birthday.setFullYear(nowTime.getFullYear() + 1);
  let timeDec = birthday - nowTime;
  let days = timeDec / (24 * 60 * 60 * 1000);
  return Math.ceil(days);
}

// 土味情话
const sweetNothings = async () => {
  let res = await axiosGet("https://api.1314.cool/words/api.php?return=json")
  let str = ""
  config.loveStr ? str = config.loveStr : str = res.data.word
  return str.replace(/<br>/g, "\n")
}
sweetNothings()

// 随机颜色
const randomColor = () => {
  return "#" + parseInt(Math.random() * 0x1000000).toString(16).padStart(6, "0")
}

// 疫情数据
const yq = async () => {
  let params = {
    city: config.city,
  }
  let res = await axiosGet("https://covid.myquark.cn/quark/covid/data", params)
  let data = void 0;
  if (["北京", "上海", "天津", "重庆", "香港", "澳门", "台湾"].includes(config.city)) data = res.data.provinceData
  else data = res.data.cityData
  let sure_new_loc = `新增本土：${data.sure_new_loc}`;
  let sure_new_hid = `新增无症状：${data.sure_new_hid}`;
  let sure_cnt = `累计确诊：${data.sure_cnt}`;
  let cure_cnt = `累计治愈：${data.cure_cnt}`;
  let present = `现有确诊：${data.present === '-' ? 0 : data.present}`;
  let danger = `中/高风险区：${data.danger["1"]}/${data.danger["2"]}`;
  let statistics_time = res.data.time
  return `${config.city}疫情数据，${sure_new_loc}，${sure_new_hid}，${sure_cnt}，${cure_cnt}，${present}，${danger}，${statistics_time}`
}
const templateMessageSend = async () => {
  const token = await getToken();
  const url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token;
  // 天气信息
  let weatherInfo = await get_weather()
  // 计算在一起的天数
  let together_day = dayjs().diff(config.love_date, "day")
  // 每日情话
  let loveStr = await sweetNothings()
  // 早安寄语
  let zaoAn = await getTianHnag('zaoan');
  // 晚安寄语
  let wanAn = await getTianHnag('wanan');
  // 朋友圈文案
  let pyq = await getTianHnag('pyqwenan');
  // 疫情数据
  let yqData = await yq();
  // 模板id 配置项
  const params = {
    // touser: config.user,
    template_id: config.template_id,
    url: 'http://weixin.qq.com/download',
    topcolor: '#FF0000',
    data: {
      // 当前日期
      nowDate: {
        value: getCurrentDate(),
        color: randomColor(),
      },
      // 省份
      province: {
        value: weatherInfo.province,
        color: randomColor(),
      },
      // 城市
      city: {
        value: weatherInfo.city,
        color: randomColor(),
      },
      // 天气
      weather: {
        value: weatherInfo.weather,
        color: randomColor(),
      },
      // 当前气温
      temp: {
        value: weatherInfo.temp + "°C",
        color: randomColor(),
      },
      // 最低气温
      low: {
        value: weatherInfo.low + "°C",
        color: randomColor(),
      },
      // 最高气温
      high: {
        value: weatherInfo.high + "°C",
        color: randomColor(),
      },
      // 风向
      wind: {
        value: weatherInfo.wind,
        color: randomColor(),
      },
      // 空气质量
      airQuality: {
        value: weatherInfo.airQuality,
        color: randomColor(),
      },
      // 湿度
      humidity: {
        value: weatherInfo.humidity,
        color: randomColor(),
      },
      // 宝贝的名字
      dearName: {
        value: config.birthday1.name,
        color: randomColor(),
      },
      // 我的名字
      myName: {
        value: config.birthday2.name,
        color: randomColor(),
      },
      // 距离宝贝生日
      dearBrthDays: {
        value: brthDate(config.birthday1.birthday),
        color: randomColor(),
      },
      // 距离我的生日
      myBrthDays: {
        value: brthDate(config.birthday2.birthday),
        color: randomColor(),
      },
      // 在一起的天数
      loveDays: {
        value: together_day,
        color: randomColor(),
      },
      // 早安寄语
      zaoan: {
        value: zaoAn,
        color: randomColor(),
      },
      // 晚安寄语
      wanan: {
        value: wanAn,
        color: randomColor(),
      },
      // 朋友圈文案
      pyqwenan: {
        value: pyq,
        color: randomColor(),
      },
      // 疫情数据
      yq_data: {
        value: yqData,
        color: '#000'
      },
      // 每日情话
      loveWords: {
        value: loveStr,
        color: randomColor(),
      },

    },
  };
  config.user.forEach(async item => {
    params.touser = item;
    let res = await axiosPost(url, params);
    switch (res.data.errcode) {
      case 40001:
        console.log("推送消息失败,请检查 appId/appSecret 是否正确");
        break
      case 40003:
        console.log("推送消息失败,请检查微信号是否正确");
        break
      case 40037:
        console.log("推送消息失败,请检查模板id是否正确");
        break
      case 0:
        console.log("推送消息成功");
        break
    }
  })
}
// 调用函数，推送模板消息
templateMessageSend(); // 第一次执行程序时会推送一次消息，如使用定时器

// 定时器（Cron）：定时推送消息
const schedule = require('node-schedule');
const scheduleCronstyle = () => {
  // 每天的早8点触发（定时器规则：秒/分/时/日/月/年，*号可理解为"每"的意思，如 0 0 8 * 这个*表示每日）
  schedule.scheduleJob('0 0 8 * * *', () => {
    templateMessageSend(); // 定时器执行
  });
}
// scheduleCronstyle();