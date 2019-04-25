# 安装命令
yarn/cnpm/npm install publish-by-ssh2 -g

# 使用命令

## 配置文件

### 配置文件说明
```配置文件模板
{
  "localDir": "dist/",//本地需要发布的代码目录
  "zipName": "dist",//代码压缩后的文件名
  "servers": [
    {
      "host": "",//服务器ip
      "user": "",//用户名
      "port": "",//端口
      "password": "",//密码
      "remoteDir": ""//代码在服务器端的存放路径
    }
  ]
}
```
### 初始化项目
publish-ssh2-cli init [repoUrl] [dist] //repoUrl 模板名称（H5、PC）或者仓库地址 dist目标目录一定要是空目录才行

### 用命令生成配置文件模板
publish-ssh2-cli gcfg [cfgPath] //cfgPath为配置文件路径，可选,例如publishcfg/config.json

### 部署代码命令
publish-ssh2-cli publish [cfgPath] [isPrompt] //cfgPath为配置文件路径，可选,例如publishcfg/config.json; isPrompt 真正开始部署前是否让用户确认部署服务器信息，默认不需要，设置为’Y‘,则会让用户确认服务器信息

### 恢复至上个版本
publish-ssh2-cli revert [cfgPath] //cfgPath为配置文件路径，可选,例如publishcfg/config.json