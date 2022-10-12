const config = require("./config")
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
  const params = {
    grant_type: 'client_credential',
    appid: config.app_id,
    secret: config.app_secret,
  };
  let res = await axiosGet('https://api.weixin.qq.com/cgi-bin/token', params);
  return res.data.access_token;
}

/**
 * 获取今日运势(也可直接使用中文,例如：astro: '天蝎座') 
 * 
 * aries 白羊座, taurus 金牛座, gemini 双子座, cancer 巨蟹座
 * leo 狮子座, virgo 处女座 libra 天秤座, scorpio 天蝎座
 * sagittarius 射手座, capricorn 摩羯座, aquarius 水瓶座, pisces 双鱼座
 */
const get_dayluck_data = async () => {
  let params = {
    key: config.tian_api,
    astro: 'scorpio'
  }
  let res = await axiosGet("http://api.tianapi.com/star/index", params);
  if (res.data.code !== 200) return console.log('获取今日运势失败！！');
  console.log(res.data.newslist);
  return res.data.newslist[res.data.newslist.length - 1].content
}

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
  let danger = `中/高风险区：${data.danger["1"]} / ${data.danger["2"]}`;
  let statistics_time = res.data.time
  return `${config.city}市本地疫情数据\n${sure_new_loc}，${sure_new_hid}\n${sure_cnt}，${cure_cnt}\n${present}\n${danger}\n${statistics_time}`
}

// 彩虹屁
const get_caihongpi_data = async () => {
  let params = {
    key: config.tian_api,
  }
  let res = await axiosGet("http://api.tianapi.com/caihongpi/index", params);
  if (res.data.code !== 200) return console.log('获取彩虹屁数据失败！！');
  console.log('彩虹屁：', res.data.newslist[0].content);
  return res.data.newslist[0].content;
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
    // touser: config.user,
    template_id: config.template_id,
    url: 'http://weixin.qq.com/download',
    topcolor: '#FF0000',
    data: {
      // 宝贝的名字
      dearName: {
        value: config.user_name,
        color: randomColor(),
      },
      // 今日运势
      dayluck: {
        value: dayluck_data,
        color: randomColor(),
      },
      // 疫情数据
      yq_data: {
        value: yqData,
        color: '#000'
      },
      // 彩虹屁
      caihongpi: {
        value: caihongpi_data,
        color: randomColor(),
      }
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
templateMessageSend(); // 第一次执行程序时会推送一次消息

// 定时器（Cron）：定时推送消息
const schedule = require('node-schedule');
const scheduleCronstyle = () => {
  // 每天的 11:30 触发（定时器规则：秒/分/时/日/月/年，*号可理解为"每"的意思，如 0 0 8 * 这个*表示每日）
  schedule.scheduleJob('0 30 11 * * *', () => {
    templateMessageSend(); // 定时器执行
  });
}
scheduleCronstyle();
