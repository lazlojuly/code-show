const sinon = require('sinon')
require('should')
require('should-sinon')
const fixtures = require('./fixtures')

const gitMock = {
	show: sinon.spy(),
	getNextCommit() {},
	getState() {},
}
const codeShow = require('../code-show')({}, gitMock, {})


context('code-show', () => {

	describe('.getCurrentCommit()', () => {

		it('calls git.show()', () => {
			codeShow.getCurrentCommit()
			return gitMock.show.should.be.called()
		})

	})

	describe('.getNextCommit()', () => {

		beforeEach(() => {
			sinon.stub(gitMock, 'getNextCommit', () => { })
		})

		afterEach(() => {
			gitMock.getNextCommit.restore()
		})

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

})
