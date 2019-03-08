const fs = require('fs')
const request = require('request')

/**
 * 判断文件或者目录是否存在
 * @param {*} target 文件、目录
 */
function fileDirExists(target) {
  return new Promise((resolve) => {
    fs.exists(target, function(exists){
      resolve(exists);
    });
  });
}

/**
 * 读取文件
 */
function readFile (filePath,encoding="utf-8") {
  return new Promise((resolve,reject) => {
    fs.readFile(filePath,{encoding:encoding}, function (err, fr) {
      if (err) {
        reject(err);
        console.log(err);
       }else {
        resolve(fr);
       }
    });
  });
}

/**
 * 下载文件
 * @param 文件地址 uri 
 * @param 文件名 filename 
 * @param 回调函数 callback 
 */
function downloadFile(uri, filename, callback){
  const stream = fs.createWriteStream(filename);
  request(uri).pipe(stream).on('close', callback);
}

module.exports =　{
  fileDirExists: fileDirExists,
  readFile: readFile,
  downloadFile: downloadFile
}