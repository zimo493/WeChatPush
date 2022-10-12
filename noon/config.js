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
