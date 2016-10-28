const sinon = require('sinon')
require('should')
require('should-sinon')
const fixtures = require('./fixtures')

const showFixture = `${fixtures.hash}@@@initial commit`
const simpleGitMock = { log() {}, show() {}, checkout() {} }
const git = require('../git')(simpleGitMock)


context('git', () => {

	describe('.log()', () => {

		beforeEach(() => {
			sinon.stub(simpleGitMock, 'log', (options, callback) => {
				callback(null, { all: fixtures.logs })
			})
		})

		afterEach(() => {
			simpleGitMock.log.restore()
		})

		it('returns a promise', () => {
			return git.log().should.be.Promise()
		})

		it('calls simpleGit.log() with --reverse', () => {
			return git.log()
			.then(() => simpleGitMock.log.should.be.calledWith(['--reverse']))
		})

		it('returns mapped logs', () => {
			return git.log()
			.then(logs => logs[0].hash.should.be.eql(fixtures.shortHash))
		})

	})


	describe('.show()', () => {

		beforeEach(() => {
			sinon.stub(simpleGitMock, 'show', (options, callback) => {
				callback(null, showFixture)
			})
		})

		afterEach(() => {
			simpleGitMock.show.restore()
		})

		it('returns a promise', () => {
			return git.show().should.be.Promise()
		})

		it('calls simpleGit.show() with --quiet --format=%h@@@%s', () => {
			return git.show()
			.then(() => {
				return simpleGitMock.show.should.be.calledWith([
					'--quiet',
					'--format=%h@@@%s',
				])
			})
		})

	})


	describe('.checkout()', () => {

		beforeEach(() => {
			sinon.stub(simpleGitMock, 'checkout', (options, callback) => {
				callback(null)
			})
		})

		afterEach(() => {
			simpleGitMock.checkout.restore()
		})

		it('returns a promise', () => {
			return git.checkout().should.be.Promise()
		})

		it('calls simpleGit.checkout() with --force', () => {
			return git.checkout(fixtures.hash)
			.then(() => {
				return simpleGitMock.checkout.should.be.calledWith([
					fixtures.hash, '--force',
				])
			})
		})

	})

})
