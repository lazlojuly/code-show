# code-show

## Introduction

code-show is a command-line tool for code presentation.

It works best on a project with meaningful commits where each commit represents the next code example.

By typing `next`, code-show will checkout the next commit for you.  
(It will also inform you about your current and next commit)

![usage example gif](https://media.giphy.com/media/l0HlGwmWyEvzItOZW/source.gif)

By using this tool you can focus on your presentation rather than having to manually switch between code examples.

## Origin of code-show

I was doing a talk on APIs at [London Node.js User Group](https://lnug.org/) and was using a bash script for checking out specific git commits for my [code demo part](https://twitter.com/OwenDods/status/791345222412361728).  
As it turned out, people were more interested in the "next" script rather than API documentations :)

## Important Note

The current version of code-show will throw away your local changes.  
It is using `git checkout` with the `--force` command.  
Please make sure you are using this tool for presentation purposes only.

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
**Commands:**
* Type "next" for next commit
* Type "help" for list of commands
* Type "exit" to exit at current commit
