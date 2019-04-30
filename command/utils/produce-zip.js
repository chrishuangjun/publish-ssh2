const fs = require('fs')
const archiver = require('archiver')
// const chalk = require('chalk')
//pathName 生成的zip压缩包的路径及文件名
//targetPath 需要打包的代码路径
//cb 回调函数
module.exports = function (pathName, targetPath, cb) {
    try {
        var output = fs.createWriteStream(pathName)
    } catch (error) {
        console.log('创建zip文件失败', error)
    }
    var archive = archiver('zip',{
        zlib: { level: 9 } // 设置压缩级别
    })

    output.on('close', function () {
        cb && typeof cb === 'function' && cb()
    })

    output.on('end', function () { })

    archive.on('error', function (err) {
        throw err
    })
    archive.pipe(output)
    archive.directory(`${targetPath}`, '/')
    archive.finalize()
}
