#!/usr/bin/env node
const messages = require('./messages')

const readline = require('readline')
const terminal = require('./terminal')(readline)

const simpleGit = require('simple-git')('.')
const git = require('./git')(simpleGit)

const codeShow = require('./code-show')(terminal, git, messages)


git.log()
.then(codeShow.getState)
.then(codeShow.startCli)
.catch(err => {
	messages.print(err)
	terminal.close()
})
