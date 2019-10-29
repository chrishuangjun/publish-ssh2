const download = require('download-git-repo');
const path = require('path');
const chalk = require('chalk');
const ora = require("ora");
const fs = require('fs');
//替换storage.ts文件里面的时间戳标识为真实时间戳
function replaceStorageTimeStamp (dist, cb) {
    const modifyPath = path.join(process.cwd(), `${dist}/src/js/storage.ts`)
    fs.readFile(modifyPath, function (err, file) {
        if (err) {
            console.log(chalk.red('读取storage.ts文件失败'))
            process.exit();
        }
        const result = file.toString().replace(/#timeStamp#/g, new Date().getTime());
        fs.writeFile(modifyPath, result, 'utf8', function (err) {
            if (err) return console.log(chalk.red('写入storage.ts文件失败'));
            cb && typeof cb === 'function' && cb();
        });
    })
}
module.exports = (repoUrl, dist) => {
    let defaultTemplate = false;
    dist = dist || ''
    if (!repoUrl) {
        console.log('请提供模板名称或者仓库地址，模板名称支持H5、PC')
        return;
    }
    if (repoUrl.toUpperCase() === 'H5') {
        defaultTemplate = true;
        repoUrl = 'http://git.midea.com/financial-center/vue-template-h5.git#perreadme';
    } else if (repoUrl.toUpperCase() === 'PC') {
        defaultTemplate = true;
        repoUrl = 'http://git.midea.com/financial-center/vue-template-pc.git'
    }
    const spinner = ora('正在初始化项目...').start()
    console.log('repoUrl:',repoUrl)
    download(`direct:${repoUrl}`, path.join(process.cwd(), dist), { clone: true }, function (err) {
        if(err){
            spinner.fail('初始化项目失败');
        }
        if (defaultTemplate) { // 默认项目模板才需要调用此方法
            replaceStorageTimeStamp(dist, function () {
                spinner.succeed('初始化项目完成');
            })
        }else{
            spinner.succeed('初始化项目完成');
        }
    })
}