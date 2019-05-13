// generateComponent.js`
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const ora = require("ora");
const resolve = (...file) => path.resolve(__dirname, ...file)
const log = message => console.log(chalk.green(`${message}`))
const successLog = message => console.log(chalk.blue(`${message}`))
const errorLog = error => console.log(chalk.red(`${error}`))
const generateFile = (filePath, data) => {
    let pathArr = filePath.split('/');
    pathArr.pop();
    let configPath = path.join(process.cwd(), pathArr.join('\\'))
    if (!fs.existsSync(configPath)) {
        fs.mkdir(configPath)
    }
    if (fs.existsSync(filePath)) {
        errorLog(`${filePath}文件已存在`)
        return Promise.reject();
    }
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, 'utf8', err => {
            if (err) {
                errorLog(err.message)
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
}
module.exports = (cfgPath='publishcfg\\config.json',type='config') => {
    const mapT = {
        config:'./template/configT.js',
        comp:'./template/vueComp.js'
    }
    const temp = require(mapT[type]);
    const spinner = ora('正在生成部署配置文件...').start()
    generateFile(cfgPath, temp)
        .then(function () {
            successLog(`配置文件生成成功,路径：${path.join(process.cwd(), cfgPath)}`)
            spinner.stop();
            process.exit()
        })
        .catch(function (err) {
            errorLog('生成配置文件失败')
            spinner.stop();
            process.exit()
        })
}
