module.exports = {
	print,
	printCommandNotFound,
	printHelp,
	printState,
}

function print(message) {
	console.log(message)
}

function printCommandNotFound() {
	console.log(
		`\n?` +
		`\nCommand not found. Type "help" to list all valid commands.` +
		`\n?`
	)
}

function printHelp() {
	console.log(
		`\n------------------------------------------------------------------` +
		`\nSupported commands:` +
		`\n"help" - to show this screen` +
		`\n"next" - to checkout next commit` +
		`\n"exit" - exit at current commit` +
		`\n------------------------------------------------------------------`
	)
}

function printState(state) {
	console.log(
		`\n------------------------------------------------------------------` +
		`\nCurrent: ${state.current.hash} - ${state.current.message}` +
		`\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++` +
		`\nNext: ${state.next.hash} - ${state.next.message}` +
		`\n------------------------------------------------------------------`
	)
}
