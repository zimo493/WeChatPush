# WeChatPush 项目说明

## 项目介绍
这是一个基于 Node.js 的微信公众号推送项目，支持早安问候、天气预报、星座运势、疫情数据以及彩虹屁等内容的定时推送。项目分为两个部分：
- **morning**: 负责早安和天气推送
- **noon**: 负责中午的星座运势和疫情数据推送

GitHub 地址：[WeChatPush](https://github.com/zimo493/WeChatPush)  
Gitee 地址：[WeChatPush](https://gitee.com/zimo493/WeChatPush)

## 准备工作

### 1. 微信公众平台接口测试账号申请
前往 [微信公众平台接口测试账号申请页面](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login) 申请测试账号。

### 2. 配置微信公众号信息
在 `morning/config.js` 和 `noon/config.js` 文件中填写微信公众号的 `app_id` 和 `app_secret`。

### 3. 注册天行数据 API
访问 [天行数据注册页面](https://www.tianapi.com/signup.html) 注册账号，并申请以下接口：
- 早安心语
- 晚安心语
- 朋友圈文案
- 彩虹屁
- 星座运势

### 4. 配置天行数据 API Key
在 `morning/config.js` 和 `noon/config.js` 文件中配置天行数据的 `tian_api`。

## 配置文件示例

### morning/config.js
```javascript
const config = {
  // 公众号配置
  app_id: "", // 公众号appId
  app_secret: "", // 公众号appSecret
  user: ["wx"], // 接收公众号消息的微信号，多个用户请使用","分割 如 ["wx1","wx2"]
  template_id: "", // 发送模板 id
  // 信息配置
  city: "黄山", // 所在城市
  birthday1: { "name": "张三", "birthday": "2022-10-11" }, // 宝贝生日，姓名和生日，生日格式为"年-月-日"
  birthday2: { "name": "李四", "birthday": "2022-10-11" }, // 我的生日，同上
  love_date: "2022-01-01", // 在一起的日期，年月日以"-"分隔
  loveStr: "", // 如果填写,则以填写内容为主，如果不填写则自动获取土味情话语句
  tian_api: "", // 天行数据apikey
}
module.exports = config
```

### noon/config.js
```javascript
const config = {
  // 公众号配置
  app_id: "", // 公众号appId
  app_secret: "", // 公众号appSecret
  user: ["wx"], // 接收公众号消息的微信号，多个用户请使用","分割 如 ["wx1","wx2"]
  template_id: "", // 发送模板 id
  // 信息配置
  user_name: '张三', // 她或他的名字
  /* aries 白羊座, taurus 金牛座, gemini 双子座, cancer 巨蟹座 leo 狮子座, virgo 处女座 libra 天秤座, scorpio 天蝎座 sagittarius 射手座, capricorn 摩羯座, aquarius 水瓶座, pisces 双鱼座 */
  constellation: '',
  city: "合肥", // 所在城市(可精确到市/区)
  tian_api: "", // 天行数据apikey
}
module.exports = config
```

## 推送模板

### 早安推送模板
```text
{{nowDate.DATA}}
所在地：{{city.DATA}}  {{weather.DATA}}  {{wind.DATA}}
当前气温：{{temp.DATA}}
今日气温：{{low.DATA}} ~ {{high.DATA}}
湿度：{{humidity.DATA}} 空气质量：{{airQuality.DATA}}

今天是我们恋爱的第{{loveDays.DATA}}天
{{birthday1.DATA}}
{{birthday2.DATA}}

早安心语：{{zaoan.DATA}}
晚安心语：{{wanan.DATA}}
朋友圈文案：{{pyqwenan.DATA}}

{{loveWords.DATA}}
```

### 中午提醒模板
```text
中午好！{{dearName.DATA}}

{{dayluck.DATA}}

{{yq_data.DATA}}

彩虹屁：{{caihongpi.DATA}}
```

## 如何运行

### 安装 Node.js
请确保您的电脑已安装 [Node.js](https://nodejs.org/zh-cn/download/)。安装时采用默认设置，无需更改任何选项。

### 安装依赖
在项目根目录下执行以下命令安装依赖：
```bash
npm install
```

### 启动项目
在项目根目录下执行以下命令启动项目：
```bash
node morning/app.js
node noon/app.js
```

这将启动早安和中午的定时推送服务。

## 效果图
<table>
  <tr>
    <td><img src="https://huzimo.vip/morning.jpg"/></td>
    <td><img src="https://huzimo.vip/remind.jpg"/></td>
  </tr>
</table>

## 注意事项
- `...` 表示内容过多而显示不全，您可以根据需要自行配置模板内容。
- 如果您遇到任何问题，请参考 [详细教程](https://mp.weixin.qq.com/s/5Yv_0rP34y9AfLZf3R7ppg)。

## 许可证
本项目遵循 MIT 许可证。详情请查看项目根目录下的 LICENSE 文件。

## 贡献者
欢迎贡献代码和建议！有关贡献指南，请参阅 [GitHub 项目页面](https://github.com/zimo493/WeChatPush)。

## 联系方式
如有疑问或建议，请联系作者。

---

**Enjoy!**
