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
    .command('publish')
    .description('发布到服务器')
    .alias('p')
    .action(() => {
        require('../command/publish')()
    })

commander
    .command('generator_config')
    .description('生成配置文件')
    .alias('gcfg')
    .action((filePath) => {
        require('../command/generator_config')(filePath)
    })

commander
    .command('revert')
    .description('恢复至上个版本')
    .alias('rv')
    .action(() => {
        require('../command/revert')()
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
    console.log(chalk.green('    publish-ssh2-cli gcfg'))
    console.log()
    console.log(chalk.grey('    根据部署配置文件说明填写信息，然后部署代码，命令如下：'))
    console.log()
    console.log(chalk.green('    publish-ssh2-cli p '))
    console.log()
    console.log(chalk.grey('    部署完成后，发现有问题，马上可以通过命令恢复至上个版本，命令如下：'))
    console.log()
    console.log(chalk.green('    publish-ssh2-cli rv'))
    console.log()
}
commander.on('--help', help)
