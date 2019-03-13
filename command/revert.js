const Client = require('ssh2').Client
const co = require('co')
function revert(config, remoteDir, zipName) {
	const conn = new Client()
	const cwd = process.cwd()
	conn
		.on('ready', function () {
			conn.exec(
				`rm ${remoteDir}/${zipName}.zip && mv ${remoteDir}/${zipName}.zip.bak ${remoteDir}/${zipName}.zip && unzip -o ${zipName}.zip`,
				function (err, stream) {

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
module.exports = function (config) {
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
				revert(item, cfg.remoteDir, cfg.zipName)
			});
		} catch (error) {
			console.log(chalk.red(error))
		}
	})
}