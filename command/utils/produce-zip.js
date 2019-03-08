const fs = require('fs')
const archiver = require('archiver')
const path = require('path')
// const chalk = require('chalk')
//pathName 生成的zip压缩包的路径及文件名
//targetPath 需要打包的代码路径
//cb 回调函数
module.exports = function(pathName, targetPath, cb) {
  //   console.log(chalk.cyan('  Zip files.\n'))
  //   console.time('key')
  if (!fs.existsSync(pathName)) {
    var tempArr = pathName.split('/')
    tempArr.pop()
    fs.mkdirSync(tempArr.join('/'))
  }
  var output = fs.createWriteStream(pathName)
  var archive = archiver('zip')

  output.on('close', function() {
    // console.log(chalk.cyan('  Zip files.\n'))
    // console.timeEnd('key')
    console.log('compress completed...ready upload')
    cb && typeof cb === 'function' && cb()
  })

  output.on('end', function() {})

  archive.on('error', function(err) {
    throw err
  })

  console.log('zip target lujing:', `${targetPath}`)
  archive.pipe(output)
  archive.directory(`${targetPath}`, false, function(
    //需要压缩文件的目录
    entryData
  ) {
    return entryData //过滤不需要压缩的文件
  })
  archive.finalize()
}
