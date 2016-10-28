module.exports = (terminal, git, messages) => {

	return {
		getState,
		getCurrentCommit,
		getNextCommit,
		startCli,
	}

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
		return getCurrentCommit().then(current => {
			state.current = current
			return getNextCommit(logs, current).then(next => {
				state.next = next
				return state
			})
		})
	}

	function startCli(state) {
		messages.printState(state)
		return terminal.promptUser('Type "next" to continue: ').then(input => {
			let result

			switch (input) {
			case 'exit':
				messages.print('Bye!')
				terminal.close()
				break

			case 'next':
				messages.print('Next!')
				result = git.checkout(state.next.hash)
				.then(() => getState(state.logs))
				.then(startCli)
				break

			case 'help':
				messages.printHelp()
				result = startCli(state)
				break

			default:
				messages.printCommandNotFound()
				result = startCli(state)
				break
			}

			return result
		})
	}

}
