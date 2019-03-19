# 安装命令
yarn/cnpm/npm install publish-ssh2 -g

# 使用命令

## 配置文件

### 配置文件说明
```配置文件模板
{
  "localDir": "dist/",//本地需要发布的代码目录
  "zipSavePath": "publish",//压缩代码的存放目录
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

### 用命令生成配置文件模板
publish-ssh2-cli gcfg [filePath] // filePath为配置文件路径，可选

## 部署代码命令
publish-ssh2-cli publish

## 恢复至上个版本
publish-ssh2-cli revert
