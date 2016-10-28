module.exports = (simpleGit) => {

	return {
		log,
		show,
		checkout,
	}

	function log() {
		return getLogs().then(mapLogs)
	}

	function getLogs() {
		return new Promise((resolve, reject) => {
			simpleGit.log(['--reverse'], (err, logs) => {
				if (err) return reject(err)
				return resolve(logs)
			})
		})
	}

	function mapLogs(logs) {
		return logs.all.map(entry => {
			entry.hash = entry.hash.substring(0, 7)
			return entry
		}, [])
	}

	function show() {
		return new Promise((resolve, reject) => {
			simpleGit.show(['--quiet', '--format=%h@@@%s'], (err, res) => {
				if (err) return reject(err)
				const c = res.split('@@@')
				const current = { hash: c[0], message: c[1].trim() }
				return resolve(current)
			})
		})
	}

	function checkout(hash) {
		return new Promise((resolve, reject) => {
			simpleGit.checkout([hash, '--force'], err => (err ? reject(err) : resolve()))
		})
	}

}
