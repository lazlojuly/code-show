# Code Show

## Introduction

Code Show is a command-line tool for code presentation.

It requires you to organise your coding increments in meaningful commits.

By typing `next`, code-show will checkout the next commit for you.
(It will also inform you about your current and next commit)

With this tool you can focus on your presentation rather than manually switching
between code examples.

**NOTE:**

Code Show `next` command will throw away local changes. Please make sure you
are using this for presentation purposes only.

## Installation

```
npm i code-show -g
```

## Usage

```
// checkout your demo source code to a folder
// eg.: git clone git@github.com:lazlojuly/my-demo-app.git
cd my-demo-app
code-show
```

* Type "next" for next commit
* Type "help" for list of commands
* Type "exit" to exit at current commit
