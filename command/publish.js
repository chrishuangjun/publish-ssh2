const co = require('co')
const prompt = require('co-prompt')
const chalk = require('chalk')
const path = require('path')

const { UploadDir } = require('./utils/sshUtils.js')
const { readFile, fileDirExists } = require('./utils/fileUtils')
const produceZip = require('./utils/produce-zip')
const fs = require('fs');
const ora = require("ora");
const spinner = ora('开始部署……').start()

function publish (cfg) {
    spinner.text = 'zip压缩中...'
    const cwd = process.cwd();
    try {
        fs.statSync(path.join(cwd, `/${cfg.zipName}`));
        fs.unlink(path.join(cwd, `/${cfg.zipName}`), function (err) {
            if (err) {
                spinner.fail('删除原有压缩包失败');
                return;
            }
            produceZip(
                path.join(cwd, `/${cfg.zipName}`),
                path.join(cwd, cfg.localDir),
                () => {
                    spinner.text='zip压缩完成,发布中...'
                    cfg.servers.forEach(server => {
                        UploadDir(server, cfg.zipName, '/', res => {
                            spinner.succeed('部署完成');
                            process.exit();
                        })
                    })
                }
            )
        })
    } catch (error) {
        produceZip(
            path.join(cwd, `/${cfg.zipName}`),
            path.join(cwd, cfg.localDir),
            () => {
                spinner.text='zip压缩完成,发布中...';
                console.log(chalk.blue('zip压缩完成,发布中...'))
                cfg.servers.forEach(server => {
                    UploadDir(server, cfg.zipName, '/', res => {
                        spinner.succeed('部署完成');
                        process.exit()
                    })
                })
            }
        )
    }


}

module.exports = (cfgPath = 'publishcfg/config.json', isPrompt = 'N') => {
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
            spinner.text= '读取部署配置文件中……';
            const cfg = JSON.parse(yield readFile(cfgPath))
            if(cfg.zipName.indexOf('.')===-1){
                // 如果用户未写压缩文件后缀，则默认添加.zip后缀名
                cfg.zipName=`${cfg.zipName}.zip`
            }
            if (isPrompt.toUpperCase() === 'Y') {
                const publishAnswer = yield prompt('是否发布（y/n): ')
                if (publishAnswer.toLowerCase() === 'y') {
                    publish(cfg);
                } else {
                    process.exit();
                }
            } else {
                publish(cfg);
            }

        } catch (ex) {
            console.log(chalk.red(ex))
        }
    })
}
