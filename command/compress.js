const co = require('co')
const chalk = require('chalk')
const path = require('path')

const { readFile, fileDirExists } = require('./utils/fileUtils')
const produceZip = require('./utils/produce-zip')
const fs = require('fs');
const ora = require("ora");
const spinner = ora('开始部署……').start()

function compress (cfg,suffix) {
    spinner.text = 'zip压缩中...'
    const cwd = process.cwd();
    try {
        fs.statSync(path.join(cwd, `/${cfg.zipName}`));
        fs.unlink(path.join(cwd, `/${cfg.zipName}`), function (err) {
            if (err) {
                console.log('delete file error:', err);
                return;
            }
            produceZip(
                path.join(cwd, `/${cfg.zipName}`),
                path.join(cwd, cfg.localDir),
                () => {
                    spinner.succeed('压缩完成');
                }
            )
        })
    } catch (error) {
        produceZip(
            path.join(cwd, `/${cfg.zipName}`),
            path.join(cwd, cfg.localDir),
            () => {
                spinner.succeed('压缩完成');
            }
        )
    }


}

module.exports = (cfgPath = 'publishcfg/config.json') => {
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
            compress(cfg);
        } catch (ex) {
            console.log(chalk.red(ex))
        }
    })
}
