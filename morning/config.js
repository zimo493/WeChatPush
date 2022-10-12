const config = {
  // 公众号配置
  app_id: "", // 公众号appId
  app_secret: "", // 公众号appSecret
  user: ["wx"], // 接收公众号消息的微信号，多个用户请使用","分割 如 ["wx1","wx2"]
  template_id: "", // 发送模板 id
  // 信息配置
  city: "合肥", // 所在城市(可精确到市/区)
  birthday1: { "name": "张三", "birthday": "2022-10-11" }, // 宝贝生日，姓名和生日，生日格式为"年-月-日"
  birthday2: { "name": "李四", "birthday": "2022-10-11" }, // 我的生日，同上
  love_date: "2022-01-01", // 在一起的日期，年月日以"-"分隔
  loveStr: "", // 如果填写,则以填写内容为主，如果不填写则自动获取土味情话语句
  tian_api: "",// 天行数据apikey
}
module.exports = config