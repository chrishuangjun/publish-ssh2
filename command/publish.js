const co = require('co')
const prompt = require('co-prompt')
const chalk = require('chalk')
const path = require('path')

const { UploadDir } = require('./utils/sshUtils.js')
const { readFile, fileDirExists } = require('./utils/fileUtils')
const produceZip = require('./utils/produce-zip')

function publish (cfg) {
    console.log(chalk.blue('zip压缩中...'))
    const cwd = process.cwd()
    produceZip(
        path.join(cwd, `${cfg.localDir}/${cfg.zipName}.zip`),
        path.join(cwd, cfg.localDir),
        () => {
            console.log(chalk.blue('zip压缩完成,发布中...'))
            cfg.servers.forEach(server => {
                UploadDir(server, cfg.zipName, cfg.localDir, res => {
                    process.exit()
                })
            })
        }
    )
}

module.exports = (cfgPath = 'publishcfg\\config.json',isPrompt = 'N') => {
    console.log(cfgPath)
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
            const cfg = JSON.parse(yield readFile(cfgPath))
            console.log(chalk.blue('服务器信息:'))
            console.log(cfg.servers)
            if(isPrompt.toUpperCase()==='Y'){
                const publishAnswer = yield prompt('是否发布（y/n): ')
                if (publishAnswer.toLowerCase() === 'y') {
                    publish(cfg);
                } else {
                    process.exit();
                }
            }else{
                publish(cfg);
            }
            
        } catch (ex) {
            console.log(chalk.red(ex))
        }
    })
}
