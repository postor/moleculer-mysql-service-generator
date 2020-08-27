#!/usr/bin/env node

/**
 * 通过输入构造配置文件，数据库连接，表模型等
 */
var Promise = require("bluebird");
var promisePrompt = require('./lib/cli/promise-prompt')
var tableUtil = require('./lib/cli/table')
var getConnectionConfig = require('./lib/cli/connection')
var path = require('path')
var mysql = require('mysql')
var mysqlUtilities = require('mysql-utilities')

var config = {
  db: {
    client: 'mysql',
    connection: {},
  },
  tables: [],
  generatePath: ''
}
var restfulPath = ''
var configFilePath = ''
var mysqlConnection = null
var tableDetails = null

//保存路径
promisePrompt([{
  name: 'generatePath',
  default: 'services',
  description: 'path for generated restful files (services)'
}])
  .then((result) => {
    restfulPath = path.join(process.cwd(), result.generatePath)
    config.generatePath = restfulPath
    configFilePath = path.join(restfulPath, 'config.json')
  })
  //连接配置
  .then(getConnectionConfig)
  //连接数据库
  .then((connection) => {
    config.db.connection = connection
    var conn = mysql.createConnection(connection)
    return Promise.promisify(conn.connect, { context: conn })()
      .then(() => {
        return conn
      })
  })
  //show tables
  .then((connection) => {
    // Mix-in for Data Access Methods and SQL Autogenerating Methods
    mysqlUtilities.upgrade(connection)
    // Mix-in for Introspection Methods
    mysqlUtilities.introspection(connection)
    mysqlConnection = connection

    return Promise.promisify(connection.tables, { context: connection })()
  })
  //遍历表并生成model和router文件
  .then((tables) => {
    tableDetails = tables
    var tableNames = Object.keys(tables)
    if (!tableNames.length) {
      return getReject('no table found! create your tables then run this')
    }
    config.tables = tableNames
    return Promise.all(tableNames.map((tableName) => {
      return tableUtil.generateTableFiles(restfulPath, tableName, mysqlConnection)
    }))
  })
  //结果
  .then(() => {
    promisePrompt.close()
    console.log('done! files generated in ' + restfulPath)
    process.exit()
  }, (err) => {
    console.log(err)
    process.exit()
  })


function getReject(err) {
  return new Promise((resolve, reject) => {
    reject(err)
  })
}