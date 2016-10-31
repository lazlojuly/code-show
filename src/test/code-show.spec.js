const sinon = require('sinon')
const should = require('should')
require('should-sinon')
const fixtures = require('./fixtures')

const truePromise = () => { return new Promise(resolve => resolve(true)) }
const gitMock = {
	show() {},
	checkout() { return truePromise() },
}
const messagesMock = {
	print() {},
	printState() {},
	printHelp() {},
	printCommandNotFound() {},
}
const terminalMock = {
	promptUser() { return new Promise(resolve => resolve('exit')) },
	close() {},
}
const codeShow = require('../code-show')(terminalMock, gitMock, messagesMock)


context('code-show', () => {

	describe('.getCurrentCommit()', () => {

		before(() => sinon.spy(gitMock, 'show'))
		after(() => gitMock.show.restore())

		it('calls git.show()', () => {
			codeShow.getCurrentCommit()
			return gitMock.show.should.be.called()
		})

	})

	describe('.getNextCommit()', () => {

		it('returns a promise', () => {
			const current = fixtures.logs[0]
			return codeShow.getNextCommit(fixtures.logs, current).should.be.Promise()
		})

		it('finds next commit', () => {
			const current = fixtures.logs[2]
			const next = fixtures.logs[3]
			return codeShow.getNextCommit(fixtures.logs, current)
			.then(commit => commit.should.be.deepEqual(next))
		})

		it('returns logs[0] if current is last commit', () => {
			const current = fixtures.logs[3]
			const next = fixtures.logs[0]
			return codeShow.getNextCommit(fixtures.logs, current)
			.then(commit => {
				return commit.should.be.deepEqual(next)
			})
		})

		it('rejects promise if current commit is not found', () => {
			const current = fixtures.commit // not in logs
			return codeShow.getNextCommit(fixtures.logs, current)
			.should.be.rejected()
		})

	})


	describe('.getState()', () => {

		beforeEach(() => {
			sinon.stub(codeShow, 'getCurrentCommit', () => {
				return new Promise(resolve => resolve(fixtures.state.current))
			})
			sinon.stub(codeShow, 'getNextCommit', () => {
				return new Promise(resolve => resolve(fixtures.state.next))
			})
		})

		afterEach(() => {
			codeShow.getCurrentCommit.restore()
			codeShow.getNextCommit.restore()
		})

		it('returns a valid state object', () => {
			return codeShow.getState(fixtures.logs).then(state => {
				return state.should.deepEqual(fixtures.state)
			})
		})

	})


	describe('.startCli()', () => {

		before(() => {
			sinon.spy(messagesMock, 'printState')
			sinon.spy(terminalMock, 'promptUser')
			sinon.spy(codeShow, 'cli')
		})

		after(() => {
			messagesMock.printState.restore()
			terminalMock.promptUser.restore()
			codeShow.cli.restore()
		})

		it('prints initial state', () => {
			return codeShow.startCli(fixtures.state)
			.then(() => messagesMock.printState.should.be.calledWith(fixtures.state))
		})

		it('prompts user for input', () => {
			return codeShow.startCli(fixtures.state)
			.then(() => terminalMock.promptUser.should.be.calledWith('Type "next" to continue: '))
		})

		it('starts cli()', () => {
			return codeShow.startCli(fixtures.state)
			.then(() => codeShow.cli.should.be.calledWith('exit'))
		})

	})


	describe('.cli()', () => {

		beforeEach(() => {
			sinon.stub(codeShow, 'getState', () => truePromise())
			sinon.stub(codeShow, 'startCli', () => truePromise())
			sinon.spy(gitMock, 'checkout')
		})

		afterEach(() => {
			codeShow.getState.restore()
			codeShow.startCli.restore()
			gitMock.checkout.restore()
		})

		describe('when called with "exit"', () => {

			it('it prints "Bye"', () => {
				sinon.spy(messagesMock, 'print')
				codeShow.cli('exit', fixtures.state)
				messagesMock.print.should.be.calledWith('Bye!')
				messagesMock.print.restore()
			})

			it('closes terminal', () => {
				sinon.spy(terminalMock, 'close')
				codeShow.cli('exit', fixtures.state)
				terminalMock.close.should.be.calledOnce()
				terminalMock.close.restore()
			})

			it('returns undefined', () => {
				should(codeShow.cli('exit', fixtures.state)).be.equal(undefined)
			})

		})

		describe('when called with "help"', () => {

			it('it prints help', () => {
				sinon.spy(messagesMock, 'printHelp')
				codeShow.cli('help', fixtures.state)
				messagesMock.printHelp.should.be.called()
				messagesMock.printHelp.restore()
			})

			it('re-runs startCli', () => {
				codeShow.cli('help', fixtures.state)
				codeShow.startCli.should.be.calledWith(fixtures.state)
			})

		})

		describe('when called with "next"', () => {

			it('checks out next commit hash', () => {
				return codeShow.cli('next', fixtures.state).then(() => {
					return gitMock.checkout.should.be.calledWith(fixtures.state.next.hash)
				})
			})

			it('gets current state', () => {
				return codeShow.cli('next', fixtures.state).then(() => {
					return codeShow.getState.should.be.called()
				})
			})

			it('re-runs startCli', () => {
				return codeShow.cli('next', fixtures.state).then(() => {
					return codeShow.startCli.should.be.called()
				})
			})

		})

		describe('when called with unknown command', () => {

			beforeEach(() => {
				sinon.spy(messagesMock, 'printCommandNotFound')
			})

			afterEach(() => {
				messagesMock.printCommandNotFound.restore()
			})

			it('prints command not found', () => {
				return codeShow.cli('blah', fixtures.state).then(() => {
					return messagesMock.printCommandNotFound.should.be.called()
				})
			})

			it('re-runs startCli', () => {
				return codeShow.cli('next', fixtures.state).then(() => {
					return codeShow.startCli.should.be.called()
				})
			})

		})

	})

})
