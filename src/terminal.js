module.exports = (readline) => {

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	function promptUser(question) {
		return new Promise(resolve => rl.question(question, input => resolve(input)))
	}

	return {
		promptUser,
		close() { rl.close() },
	}

}
