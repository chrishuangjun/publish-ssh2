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
	.action(() => {
		require('../command/generator_config')()
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
