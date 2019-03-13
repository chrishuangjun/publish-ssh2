const Client = require('ssh2').Client
const co = require('co')
const chalk = require('chalk')
const { readFile, fileDirExists } = require('./utils/fileUtils')
function revert(config, zipName) {
	const conn = new Client()
	conn
		.on('ready', function () {
			conn.exec(
				`rm -rf ${config.remoteDir}/${zipName}.zip && mv ${config.remoteDir}/${zipName}.zip.bak ${config.remoteDir}/${zipName}.zip && unzip -o ${zipName}.zip`,
				function (err, stream) {
					if (err) {
						console.log(err)
					}
					stream
						.on('close', function () {
							conn.end()
						})
						.on('data', function () { })
				}
			)
		})
		.connect({
			host: config.host,
			port: config.port,
			username: config.user,
			password: config.password
		})
}
module.exports = function () {
	co(function* () {
		const fileExist = yield fileDirExists('./config/config.json')

		if (!fileExist) {
			console.log(
				chalk.red(
					'\n发布失败，原因：请在项目根目录执行当前命令，并在config/config.json里面配置了server服务器信息。'
				)
			)
			process.exit()
		}
		try {
			const cfg = JSON.parse(yield readFile('./config/config.json'))
			cfg.servers.forEach(item => {
				revert(item, cfg.zipName)
			});
		} catch (error) {
			console.log(chalk.red(error))
		}
	})
}