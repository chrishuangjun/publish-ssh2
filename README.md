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
publish-ssh2-cli i [repoUrl] //repoUrl可以为模板名称（H5、PC）或者仓库地址

### 用命令生成配置文件模板
publish-ssh2-cli gcfg [cfgPath] //cfgPath为配置文件路径，可选,例如publishcfg/config.json

### 部署代码命令
publish-ssh2-cli publish [cfgPath] //cfgPath为配置文件路径，可选,例如publishcfg/config.json

### 恢复至上个版本
publish-ssh2-cli revert [cfgPath] //cfgPath为配置文件路径，可选,例如publishcfg/config.json
