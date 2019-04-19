const download = require('download-git-repo');
const path = require('path');
const chalk = require('chalk');
const ora = require("ora");
module.exports = (repoUrl) => {
    if(!repoUrl) {
        console.log('请提供模板名称或者仓库地址，模板名称支持H5、PC')
        return;
    }
    if(repoUrl === 'H5'){
        repoUrl = 'http://10.16.28.73/financial-center/vue-template-h5.git';
    }else if(repoUrl === 'PC'){
        repoUrl = 'http://10.16.28.73/financial-center/vue-template-h5.git'
    }
    const spinner = ora('正在初始化项目...').start()
    download(`direct:${repoUrl}`, path.join(process.cwd(),'initProject'), { clone: true }, function (err) {
        spinner.stop()
        console.log(err ? chalk.red('项目初始化失败') : chalk.green('项目初始化成功'))
    })
}