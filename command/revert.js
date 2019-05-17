const Client = require('ssh2').Client
const co = require('co')
const chalk = require('chalk')
const { readFile, fileDirExists } = require('./utils/fileUtils')
const ora = require("ora");
const spinner = ora('开始回滚……').start()
function revert(config, zipName) {
    const conn = new Client()
    conn
        .on('ready', function () {
            conn.exec(
                `cd ${config.remoteDir} && rm -rf ${config.remoteDir}/${zipName} && mv ${config.remoteDir}/${zipName}.bak ${config.remoteDir}/${zipName} && unzip -o ${zipName}`,
                function (err, stream) {
                    if (err) {
                        spinner.fail('回滚失败');
                    }
                    stream
                        .on('close', function () {
                            spinner.succeed('回滚完成');
                            conn.end()
                        })
                        .on('data', function () { })
                }
            )
        })
        .connect({
            host: config.host,
            port: config.port,
            username: config.user,
            password: config.password
        })
}
module.exports = function (cfgPath = 'publishcfg/config.json') {
    co(function* () {
        const fileExist = yield fileDirExists(cfgPath)

        if (!fileExist) {
            console.log(
                chalk.red(
                    '\n发布失败，原因：请在项目根目录执行当前命令，并在config/config.json里面配置了server服务器信息。'
                )
            )
            process.exit()
        }
        try {
            const cfg = JSON.parse(yield readFile(cfgPath));
            if(cfg.zipName.indexOf('.')===-1){
                // 如果用户未写压缩文件后缀，则默认添加.zip后缀名
                cfg.zipName=`${cfg.zipName}.zip`
            }
            cfg.servers.forEach(item => {
                revert(item, cfg.zipName)
            });
        } catch (error) {
            console.log(chalk.red(error))
        }
    })
}