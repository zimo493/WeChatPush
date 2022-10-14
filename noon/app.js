const { app_id, app_secret, city, constellation, template_id, tian_api, user, user_name } = require("./config")
const axios = require('axios');

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

// 获取今日运势
const get_dayluck_data = async () => {
  let { data: { code, newslist } } = await axiosGet("http://api.tianapi.com/star/index", {
    key: tian_api,
    astro: constellation
  });
  console.log(newslist);
  return (code !== 200) ? console.log('获取今日运势失败！！') : newslist[newslist.length - 1].content;
}

// 随机颜色
const randomColor = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16);

// 疫情数据
const yq = async () => {
  let { data: { cityData, provinceData, time } } = await axiosGet("https://covid.myquark.cn/quark/covid/data", { city: city })
  let { cure_cnt, danger, present, sure_cnt, sure_new_hid, sure_new_loc } = ([
    "北京", "上海", "天津", "重庆", "香港", "澳门", "台湾"
  ].includes(city)) ? provinceData : cityData
  return `${city}本地疫情数据\n新增本土: ${sure_new_loc}\n新增无症状: ${sure_new_hid}\n累计确诊: ${sure_cnt}，累计治愈: ${cure_cnt}\n现有确诊: ${present === '-' ? 0 : present}\n中/高风险区：${danger["1"]}/${danger["2"]}\n${time}`
}

// 彩虹屁
const get_caihongpi_data = async () => {
  let { data: { code, newslist } } = await axiosGet("http://api.tianapi.com/caihongpi/index", { key: tian_api, });
  return code !== 200 ? console.log('获取彩虹屁数据失败！！') : newslist[0].content;
}

const templateMessageSend = async () => {
  const token = await getToken();
  const url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + token;
  // 今日运势
  let dayluck_data = await get_dayluck_data();
  // 疫情数据
  let yqData = await yq();
  // 彩虹屁
  let caihongpi_data = await get_caihongpi_data()
  // 模板id 配置项
  const params = {
    template_id: template_id,
    url: 'http://weixin.qq.com/download',
    topcolor: '#FF0000',
    data: {
      // 宝贝的名字
      dearName: { value: user_name, color: randomColor(), },
      // 今日运势
      dayluck: { value: dayluck_data, color: randomColor(), },
      // 疫情数据
      yq_data: { value: yqData, color: '#000' },
      // 彩虹屁
      caihongpi: { value: caihongpi_data, color: randomColor(), }
    },
  };
  for (const item of user) {
    params.touser = item;
    let { data: { errcode } } = await axiosPost(url, params);
    console.log({
      40001: "推送消息失败! 请检查 appId/appSecret 是否正确",
      40003: "推送消息失败! 请检查微信号是否正确",
      40037: "推送消息失败! 请检查模板id是否正确",
      0: `${item}: 推送消息成功`,
    }[errcode]);
  }
}
// 调用函数，推送模板消息
// templateMessageSend(); // 第一次执行程序时会推送一次消息

// 定时器（Cron）：定时推送消息
const schedule = require('node-schedule');
const scheduleCronstyle = () => {
  // 每天的 11:30 触发（定时器规则：秒/分/时/日/月/年，*号可理解为"每"的意思，如 0 0 8 * 这个*表示每日）
  schedule.scheduleJob('0 30 11 * * *', () => {
    templateMessageSend(); // 定时器执行
  });
}
scheduleCronstyle();
