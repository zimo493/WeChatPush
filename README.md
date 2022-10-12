# morning 公众号天气推送

## 项目介绍
nodejs 项目（公众号推送早安问候、天气预报、星座运势、疫情数据）

## 准备工作
1. 微信公众平台接口测试账号申请：https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login
2. 在 config.js 文件中，填写微信公众号信息
3. 注册天行数据获取apikey(已注册略过) [注册地址](https://www.tianapi.com/signup.html)
4. 在 config.js 文件中，配置天行数据apikey 申请"星座运势、早安心语、晚安心语、朋友圈文案、彩虹屁"这几个接口

## 早安推送模板内容如下
```text
{{nowDate.DATA}}
所在地：{{city.DATA}}  {{weather.DATA}}  {{wind.DATA}}
当前温度：{{temp.DATA}}
今日温度：{{low.DATA}} ~ {{high.DATA}}
空气质量：{{airQuality.DATA}}
湿度：{{humidity.DATA}}

今天是我爱你的第{{loveDays.DATA}}天
距离{{dearName.DATA}}的生日还有{{dearBrthDays.DATA}}天
距离{{myName.DATA}}的生日还有{{myBrthDays.DATA}}天

早安心语：{{zaoan.DATA}}
晚安心语：{{wanan.DATA}}
朋友圈文案：{{pyqwenan.DATA}}

{{yq_data.DATA}}

{{loveWords.DATA}}
```


# noon 公众号今日提醒推送

## 今日提醒模板内容如下
```text
中午好！{{dearName.DATA}}

{{dayluck.DATA}}

{{yq_data.DATA}}

彩虹屁：{{caihongpi.DATA}}
```  

## 如何运行
执行 node app.js 命令，启动项目即可实现消息推送

## 小白可能需要看的
1. 电脑需要安装 nodejs，[nodejs 下载地址](https://nodejs.org/zh-cn/download/)
2. 安装 nodejs 时，傻瓜式安装 一直点下一步，不需要做任何选项的勾选。[可参考教程](https://www.runoob.com/nodejs/nodejs-install-setup.html)
3. 安装成功后，在项目根目录(app.js所在目录)，执行 node app.js 命令

### 早上推送
![](./morning/img/morning.jpg)

### 今日提醒
![](./noon/img/remind.jpg)