// const Client = require('ssh2').Client
// const spawn = require('cross-spawn')
// const path = require('path')
// const ora = require('ora')
// const glob = require('glob')
// const fs = require('fs')
// const env = process.env.HOST_ENV.split('/')
// const { UploadDir } = require('./utils/sshUtils.js');
// const { readFile, fileDirExists } = require('./utils/fileUtils');
// // uploadDir(env[0])
// module.exports = function() {
//   const configPath = path.join(__dirname, './config/config.js')
//   const configFile = fs.readFileSync(configPath, 'utf-8')
//   console.log(
//     '%cconfigFile: ',
//     'color: yellow; background: black;font-size: 20px;',
//     configFile
//   )
//   /**
//    * 判断文件或者目录是否存在
//    * @param {*} target 文件、目录
//    */
//   function fileDirExists(target) {
//     return new Promise(resolve => {
//       fs.exists(target, function(exists) {
//         resolve(exists)
//       })
//     })
//   }
//   if (!env) {
//     console.log('未传入环境变量')
//     return
//   }
//   if (!fileDirExists(configPath)) {
//     console.log(
//       `找不到部署配置文件,请在项目根目录下新建config目录，然后在该目录下新建config.js文件`
//     )
//     return
//   }
//   const spinner = ora('开始zip压缩').start()
//   const handleError = (err, spinner) => {
//     console.log(err)
//     spinner.stop()
//   }
//   const uploadDir = env => {
//     const cwd = path.dirname(__dirname)
//     const config = configFile[env]
//     const conn = new Client()
//     conn
//       .on('ready', function() {
//         conn.exec(
//           `mv ${config.remotePath}/${config.zipName}.zip ${config.remotePath}/${
//             config.zipName
//           }.zip.bak`,
//           function(err, stream) {
//             glob(
//               '**/*.*',
//               {
//                 cwd: path.join(cwd, config.publishPath)
//               },
//               function(err, files) {
//                 if (err) {
//                   handleError(err, spinner)
//                   return
//                 }
//                 let length = files.length,
//                   index = 0
//                 conn.sftp((err, sftp) => {
//                   if (err) {
//                     handleError(err, spinner)
//                     return
//                   }
//                   const upload = () => {
//                     const currentFile = files[index++]
//                     if (!currentFile || index > length) {
//                       spinner.text = '上传成功……'
//                       conn.exec(
//                         `cd ${config.remotePath} && unzip -o ${
//                           config.zipName
//                         }.zip`,
//                         function(err, stream) {
//                           if (err) {
//                             handleError(err, spinner)
//                             return
//                           }
//                           stream
//                             .on('close', function() {
//                               conn.end()
//                               spinner.stop()
//                             })
//                             .on('data', function() {})
//                         }
//                       )
//                       // conn.end()
//                       return
//                     }
//                     sftp.lstat(config.remotePath, function(err, stat) {
//                       if (err) {
//                         //远程服务器的路径不存在，则创建目录
//                         sftp.mkdir(config.remotePath)
//                       }
//                       sftp.fastPut(
//                         path.join(cwd, config.publishPath, currentFile),
//                         path
//                           .join(config.remotePath, currentFile)
//                           .replace(/\\/g, '/'),
//                         function(err, result) {
//                           if (err) {
//                             console.log(err, '出错了')
//                             conn.end()
//                             return
//                           }
//                           console.log(`${currentFile}上传成功`)
//                           upload()
//                         }
//                       )
//                     })
//                   }
//                   upload()
//                 })
//               }
//             )
//           }
//         )
//       })
//       .connect({
//         host: config.host,
//         port: config.port,
//         username: config.username,
//         password: config.password
//       })
//   }
//   require('./produce-zip')(
//     `${config.publishPath}/${config.zipName}.zip`,
//     'dist',
//     () => {
//       spinner.text = '压缩完成，准备上传……'
//       env.forEach(item => {
//         uploadDir(item)
//       })
//     }
//   )
// }
const co = require('co')
const prompt = require('co-prompt')
const chalk = require('chalk')
const path = require('path')

const { UploadDir } = require('./utils/sshUtils.js')
const { readFile, fileDirExists } = require('./utils/fileUtils')
const produceZip = require('./utils/produce-zip')

module.exports = () => {
  co(function*() {
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
      console.log(chalk.blue('服务器信息:'))
      console.log(cfg.servers)

      const publishAnswer = yield prompt('是否发布（yes/no): ')

      if (publishAnswer === 'yes') {
        console.log(chalk.blue('zip压缩中...'))
        const cwd = process.cwd()
        produceZip(
          path.join(cwd, `${cfg.zipSavePath}/${cfg.zipName}.zip`),
          path.join(cwd, cfg.localDir),
          () => {
            console.log(chalk.blue('zip压缩完成,发布中...'))
            cfg.servers.forEach(server => {
              UploadDir(server, cfg.zipName, cfg.zipSavePath, res => {
                process.exit()
              })
            })
          }
        )
      } else {
        process.exit()
      }
    } catch (ex) {
      console.log(chalk.red(ex))
    }
  })
}
