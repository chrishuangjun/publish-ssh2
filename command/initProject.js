const download = require('download-git-repo');
const path = require('path');
const chalk = require('chalk');
const ora = require("ora");
const fs = require('fs');
//替换storage.ts文件里面的时间戳标识为真实时间戳
function replaceStorageTimeStamp(dist,cb){
    const modifyPath = path.join(process.cwd(),`${dist}/src/js/storage.ts`)
    fs.readFile(modifyPath,function(err,file){
        if(err){
            console.log(chalk.red('读取storage.ts文件失败'))
            process.exit();
        }
        const result = file.toString().replace(/timeStamp/g,new Date().getTime());
        fs.writeFile(modifyPath, result, 'utf8', function (err) {
            if (err) return console.log(chalk.red('写入storage.ts文件失败'));
            cb && typeof cb === 'function' && cb();
       });
    })
}
module.exports = (repoUrl,dist) => {
    dist = dist || ''
    if(!repoUrl) {
        console.log('请提供模板名称或者仓库地址，模板名称支持H5、PC')
        return;
    }
    if(repoUrl === 'H5'){
        repoUrl = 'http://10.16.28.73/financial-center/vue-template-h5.git#perreadme';
    }else if(repoUrl === 'PC'){
        repoUrl = 'http://10.16.28.73/financial-center/vue-template-h5.git'
    }
    const spinner = ora('正在初始化项目...').start()
    download(`direct:${repoUrl}`, path.join(process.cwd(),dist), { clone: true }, function (err) {
        replaceStorageTimeStamp(dist,function(){
            spinner.stop()
            console.log(err ? chalk.red('项目初始化失败') : chalk.green('项目初始化成功'))
        })
    })
}