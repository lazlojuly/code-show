module.exports = (terminal, git, messages) => {

	const module = {
		getState,
		getCurrentCommit,
		getNextCommit,
		startCli,
		cli,
	}
	return module

	function getCurrentCommit() {
		return git.show()
	}

	function getNextCommit(logs, current) {
		return new Promise((resolve, reject) => {
			const first = logs[0]

			for (let x = 0; x < logs.length; x++) {
				const log = logs[x]

				if (current.hash === log.hash) {
					const next = logs[x + 1]
					if (next) {
						resolve({ hash: next.hash, message: next.message })
					} else {
						resolve({ hash: first.hash, message: first.message })
					}
					break
				}
			}

			reject('Could not find next commit.')
		})
	}

	function getState(logs) {
		const state = { logs, current: {}, next: {} }
		return module.getCurrentCommit().then(current => {
			state.current = current
			return module.getNextCommit(logs, current).then(next => {
				state.next = next
				return state
			})
		})
	}

	function startCli(state) {
		messages.printState(state)
		return terminal.promptUser('Type "next" to continue: ')
		.then(input => module.cli(input, state))
	}

	function cli(input, state) {
		let result

		switch (input) {
		case 'exit':
			messages.print('Bye!')
			terminal.close()
			break

		case 'help':
			messages.printHelp()
			result = module.startCli(state)
			break

		case 'next':
			result = git.checkout(state.next.hash)
			.then(() => module.getState(state.logs))
			.then(module.startCli)
			break

		default:
			messages.printCommandNotFound()
			result = module.startCli(state)
			break
		}

		return result
	}

}
