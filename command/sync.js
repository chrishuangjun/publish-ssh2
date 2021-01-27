const co = require('co')
const chalk = require('chalk')
const ora = require("ora");
const spinner = ora('开始部署……').start()
const Client = require('ssh2').Client
const { readFile, fileDirExists } = require('./utils/fileUtils')

function sync(config, targetConfig) {
    
    const conn = new Client()
    return new Promise((resolve,reject)=>{
        conn
        .on('ready', function () {
            conn.exec(
                `scp -r ${config.remoteDir}/* apps@${targetConfig.host}:${targetConfig.remoteDir}/`,
                function (err, stream) {
                    if(err){
                        console.log(chalk.red('服务器shell命令执行失败'));
                        reject();
                    }
                    console.log(chalk.green(`服务器${targetConfig.host}同步成功`));
                    resolve('同步成功');
                }
            )
        })
        .connect({
            host: config.host,
            port: config.port,
            username: config.user,
            password: config.password
        })
    })
    
}

module.exports = (cfgPath = 'publishcfg/config.json',targetCfgPath) => {
    co(function* () {
        const fileExist = yield fileDirExists(cfgPath)
        if (!fileExist) {
            console.log(
                chalk.red(
                    '\n发布失败，原因：请在项目根目录执行当前命令，并在publishcfg/config.json里面配置了server服务器信息。'
                )
            )
            process.exit()
        }
        try {
            spinner.text= '读取部署配置文件中……\n';
            const cfg = JSON.parse(yield readFile(cfgPath))
            const targetCfg = JSON.parse(yield readFile(targetCfgPath))
            let promiseArr = [];
            console.log('=======被同步服务器配置信息=========')
            console.log(cfg.servers[0])
            console.log('=======被同步服务器配置信息=========')

            console.log('=======目标服务器配置信息=========')
            console.log(targetCfg.servers)
            console.log('=======目标服务器配置信息=========')
            targetCfg.servers.forEach(server => {
                (function(server){
                    promiseArr.push(sync(cfg.servers[0],server))
                })(server)
            })
            Promise.all(promiseArr).then(()=>{
                spinner.succeed('全部目标服务器同步完成');
                process.exit();
            })

        } catch (ex) {
            console.log(chalk.red(ex))
        }
    })
}
