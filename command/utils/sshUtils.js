'use strict'
var ssh2 = require('ssh2')
var util = require('util')
var events = require('events')
var Client = require('ssh2').Client
var fs = require('fs')
var path = require('path')
var chalk = require('chalk')

/**
 * 描述：连接远程电脑
 * 参数：server 远程电脑凭证；then 回调函数
 * 回调：then(conn) 连接远程的client对象
 */
function Connect(server, then) {
    var conn = new Client()
    conn
        .on('ready', function () {
            then(conn)
        })
        .on('error', function () {
            //console.log("connect error!");
        })
        .on('end', function () {
            //console.log("connect end!");
        })
        .on('close', function () {
            //console.log("connect close");
        })
        .connect(server)
}

/**
 * 描述：运行shell命令
 * 参数：server 远程电脑凭证；cmd 执行的命令；then 回调函数
 * 回调：then(err, data) ： data 运行命令之后的返回数据信息
 */
function Shell(server, cmd, then) {
    Connect(server, function (conn) {
        conn.shell(function (err, stream) {
            if (err) {
                then(err)
            } else {
                // end of if
                var buf = ''
                stream
                    .on('close', function () {
                        conn.end()
                        then(err, buf)
                    })
                    .on('data', function (data) {
                        buf = buf + data
                    })
                    .stderr.on('data', function (data) {
                        console.log('stderr: ' + data)
                    })
                stream.end(cmd)
            }
        })
    })
}

/**
 * 描述：上传文件
 * 参数：server 远程电脑凭证；localPath 本地路径；remotePath 远程路径；then 回调函数
 * 回调：then(err, result)
 */
function UploadFile(server, localPath, remotePath, then) {
    Connect(server, function (conn) {
        conn.sftp(function (err, sftp) {
            if (err) {
                then(err)
            } else {
                sftp.fastPut(localPath, remotePath, function (err, result) {
                    conn.end()
                    then(err, result)
                })
            }
        })
    })
}

/**
 * 描述：下载文件
 * 参数：server 远程电脑凭证；remotePath 远程路径；localPath 本地路径；then 回调函数
 * 回调：then(err, result)
 */
function DownloadFile(server, remotePath, localPath, then) {
    Connect(server, function (conn) {
        conn.sftp(function (err, sftp) {
            if (err) {
                then(err)
            } else {
                sftp.fastGet(remotePath, localPath, function (err, result) {
                    if (err) {
                        then(err)
                    } else {
                        conn.end()
                        then(err, result)
                    }
                })
            }
        })
    })
}

/**
 * 描述：获取远程文件路径下文件列表信息
 * 参数：server 远程电脑凭证；
 *		remotePath 远程路径；
 *		isFile 是否是获取文件，true获取文件信息，false获取目录信息；
 *		then 回调函数
 * 回调：then(err, dirs) ： dir, 获取的列表信息
 */
function GetFileOrDirList(server, remotePath, isFile, then) {
    var cmd =
        'find ' +
        remotePath +
        ' -type ' +
        (isFile == true ? 'f' : 'd') +
        '\r\nexit\r\n'
    Shell(server, cmd, function (err, data) {
        var arr = []
        var remoteFile = []
        arr = data.split('\r\n')
        arr.forEach(function (dir) {
            if (dir.indexOf(remotePath) == 0) {
                remoteFile.push(dir)
            }
        })
        then(err, remoteFile)
    })
}

/**
 * 描述：控制上传或者下载一个一个的执行
 */
function Control() {
    events.EventEmitter.call(this)
}
util.inherits(Control, events.EventEmitter) // 使这个类继承EventEmitter

var control = new Control()

control.on('donext', function (todos, then) {
    if (todos.length > 0) {
        var func = todos.shift()
        func(function (err) {
            if (err) {
                then(err)
            } else {
                control.emit('donext', todos, then)
            }
        })
    } else {
        then(null)
    }
})

/**
 * 描述：下载目录到本地
 * 参数：server 远程电脑凭证；
 *		remotePath 远程路径；
 *		localDir 本地路径，
 *		then 回调函数
 * 回调：then(err)
 */
function DownloadDir(server, remoteDir, localDir, then) {
    GetFileOrDirList(server, remoteDir, false, function (err, dirs) {
        if (err) {
            throw err
        } else {
            GetFileOrDirList(server, remoteDir, true, function (err, files) {
                if (err) {
                    throw err
                } else {
                    dirs.shift()
                    dirs.forEach(function (dir) {
                        var tmpDir = path
                            .join(localDir, dir.slice(remoteDir.length))
                            .replace(/[//]\g/, '\\')
                        // 创建目录
                        fs.mkdirSync(tmpDir)
                    })
                    var todoFiles = []
                    files.forEach(function (file) {
                        var tmpPath = path
                            .join(localDir, file.slice(remoteDir.length))
                            .replace(/[//]\g/, '\\')
                        todoFiles.push(function (done) {
                            DownloadFile(server, file, tmpPath, done)
                            console.log('downloading the ' + file)
                        }) // end of todoFiles.push
                    })
                    control.emit('donext', todoFiles, then)
                }
            })
        }
    })
}

/**
 * 描述：获取windows上的文件目录以及文件列表信息
 * 参数：destDir 本地路径，
 *		dirs 目录列表
 *		files 文件列表
 */
function GetFileAndDirList(localDir, dirs, files) {
    var dir = fs.readdirSync(localDir)
    for (var i = 0; i < dir.length; i++) {
        var p = path.join(localDir, dir[i])
        var stat = fs.statSync(p)
        if (stat.isDirectory()) {
            dirs.push(p)
            GetFileAndDirList(p, dirs, files)
        } else {
            files.push(p)
        }
    }
}

/**
 * 描述：上传文件夹到远程目录
 * 参数：server 远程电脑凭证；
 *		localDir 本地路径，
 *		remotePath 远程路径；
 *		then 回调函数
 * 回调：then(err)
 */
function UploadDir(config, zipName, zipSavePath, cb) {
    const conn = new Client()
    const cwd = process.cwd()
    conn
        .on('ready', function () {
            conn.exec(
                `mv ${config.remoteDir}/${zipName} ${
                config.remoteDir
                }/${zipName}.bak`,
                function (err, stream) {
                    if(err){
                        console.log(chalk.red('服务器shell命令执行失败'));
                        process.exit();
                    }
                    conn.sftp((err, sftp) => {
                        if (err) {
                            console.log(chalk.red('sftp异常:'))
                            console.log(chalk.red(JSON.stringify(err)))
                            process.exit();
                        }
                        const upload = () => {
                            sftp.lstat(config.remoteDir, function (err, stat) {
                                if (err) {
                                    //远程服务器的路径不存在，则创建目录
                                    sftp.mkdir(config.remoteDir)
                                }
                                sftp.fastPut(
                                    path.join(cwd, zipSavePath, `${zipName}`),
                                    path
                                        .join(config.remoteDir, `${zipName}`)
                                        .replace(/\\/g, '/'),
                                    function (err, result) {
                                        if (err) {
                                            console.log(chalk.red('上传文件报错:'))
                                            console.log(chalk.red(JSON.stringify(err)))
                                            conn.end()
                                            process.exit();
                                        }
                                        conn.exec(
                                            `cd ${config.remoteDir} && unzip -o ${zipName}`,
                                            function (err, stream) {
                                                if (err) {
                                                    console.log(chalk.red('执行服务器命令报错:'))
                                                    console.log(chalk.red(JSON.stringify(err)))
                                                    process.exit();
                                                }
                                                stream
                                                    .on('close', function () {
                                                        conn.end()
                                                        cb && typeof cb === 'function' && cb()
                                                        process.exit();
                                                    })
                                                    .on('data', function () { })
                                            }
                                        )
                                    }
                                )
                            })
                        }
                        upload()
                    })
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
// function UploadDir(server, localDir, remoteDir, then) {
//   var dirs = []
//   var files = []
//   GetFileAndDirList(localDir, dirs, files)

//   // 创建远程目录
//   var todoDir = []
//   dirs.forEach(function(dir) {
//     todoDir.push(function(done) {
//       var to = path
//         .join(remoteDir, dir.slice(localDir.length))
//         .replace(/[\\]/g, '/')
//       var cmd = 'mkdir -p ' + to + '\r\nexit\r\n'
//       console.log(cmd)
//       Shell(server, cmd, done)
//     }) // end of push
//   })

//   // 上传文件
//   var todoFile = []
//   files.forEach(function(file) {
//     todoFile.push(function(done) {
//       var to = path
//         .join(remoteDir, file.slice(localDir.length))
//         .replace(/[\\]/g, '/')
//       console.log('从' + file + '上传到' + to)
//       UploadFile(server, file, to, done)
//     })
//   })

//   control.emit('donext', todoDir, function(err) {
//     if (err) {
//       throw err
//     } else {
//       control.emit('donext', todoFile, then)
//     }
//   })
// }

exports.Shell = Shell
exports.UploadFile = UploadFile
exports.DownloadFile = DownloadFile
exports.GetFileOrDirList = GetFileOrDirList
exports.DownloadDir = DownloadDir
exports.UploadDir = UploadDir
