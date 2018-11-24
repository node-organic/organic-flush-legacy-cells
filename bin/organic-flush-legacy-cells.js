#!/usr/bin/env node
const path = require('path')

process.chdir(path.resolve(__dirname, '../'))
const Angel = require('organic-angel')
let angel = new Angel()
require('angelscripts-install-as-daemon')(angel)
angel.do('install ' + process.argv[2])
