/**
 * 获取数据库配置文件
 */
var _ = require('lodash')
var fs = require('fs-extra')
var path = require('path')

module.exports.generateTableFiles = generateTableFiles

/**
 * 生成表的文件
 */
function generateTableFiles(folder, tableName, connection) {
  return getFields(connection, tableName)
    .then((tableFields) => {
      return generateService(folder, tableName, tableFields)
    })
}

/**
 * 获取主键
 */
function getFields(connection, tableName) {
  return new Promise((resolve, reject) => {
    connection.fields(tableName, (err, fields) => {
      if (err) {
        reject(err)
      } else {
        let t1 = Object.assign({}, fields)
        delete t1['id']
        let t2 = Object.keys(t1)
        t2.unshift('_id')
        resolve(t2)
      }
    })
  })
}


/**
 * 生成服务
 */
function generateService(folder, tableName, tableFields) {
  var templatePath = path.join(__dirname, 'templates', 'service.tmpl')
  var filePath = path.join(folder, tableName + '.service.js')
  return fs.readFile(templatePath, { encoding: 'utf8' })
    .then((template) => {
      var content = _.template(template)({
        tablefields: JSON.stringify(tableFields),
        tablename: tableName
      })
      return fs.writeFile(filePath, content)
    })
}