#!/usr/bin/env node --harmony

'use strict'

const commander = require('commander')

// 定义脚手架的文件路径
process.env.NODE_PATH = __dirname + '/../node_modules/'

// 定义当前版本
commander.version(require('../package').version)

// 定义使用方法
commander.usage('<command>')

commander
    .command('publish [cfgPath] [isPrompt]')
    .description('发布到服务器')
    .alias('p')
    .action((cfgPath,isPrompt) => {
        //isPrompt 真正开始部署前是否让用户确认部署服务器信息，默认不需要，设置为’Y‘,则会让用户确认服务器信息
        require('../command/publish')(cfgPath,isPrompt)
    })

commander
    .command('generator_config [cfgPath]')
    .description('生成配置文件')
    .alias('gcfg')
    .action((cfgPath) => {
        console.log('生成配置文件:cfgPath:',cfgPath)
        require('../command/generator_config')(cfgPath)
    })

commander
    .command('revert [cfgPath]')
    .description('恢复至上个版本')
    .alias('rv')
    .action((cfgPath) => {
        require('../command/revert')(cfgPath)
    })

commander
    .command('init [repoUrl] [dist]')
    .description('初始化项目')
    .alias('i')
    .action((repoUrl,dist) => {
        require('../command/initProject')(repoUrl,dist)
    })

commander
    .command('compress  [cfgPath]')
    .description('将指定文件夹生成压缩包')
    .alias('c')
    .action((cfgPath) => {
        require('../command/compress')(cfgPath)
    })    

// 错误命令时的显示帮助
commander.parse(process.argv)
if (!commander.args.length) {
    commander.help()
}

const help = function () {
    console.log()
    console.log(chalk.red('  Examples:'))
    console.log()
    console.log(chalk.gray('    生成部署配置文件,命令如下：'))
    console.log()
    console.log(chalk.green('    publish-ssh2-cli gcfg [cfgPath]'))
    console.log()
    console.log(chalk.grey('    根据部署配置文件说明填写信息，然后部署代码，命令如下：'))
    console.log()
    console.log(chalk.green('    publish-ssh2-cli p [cfgPath]'))
    console.log()
    console.log(chalk.grey('    部署完成后，发现有问题，马上可以通过命令恢复至上个版本，命令如下：'))
    console.log()
    console.log(chalk.green('    publish-ssh2-cli rv [cfgPath]'))
    console.log()
    console.log(chalk.grey('    初始化项目，命令内置了两个模板一个是H5（移动端开发模板），一个是PC(pc端开发模板)，命令如下：'))
    console.log()
    console.log(chalk.green('    publish-ssh2-cli i [repoUrl]'))
    console.log()
    console.log(chalk.grey('    将指定文件夹生成压缩包，命令如下：'))
    console.log()
    console.log(chalk.green('    publish-ssh2-cli c [cfgPath]'))
}
commander.on('--help', help)
