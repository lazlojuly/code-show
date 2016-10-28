const sinon = require('sinon')
require('should')
require('should-sinon')

const readlineIntefaceMock = { question() {}, close() {} }
const readlineMock = { createInterface() { return readlineIntefaceMock } }
const terminal = require('../terminal')(readlineMock)


context('git', () => {

	describe('.promptUser()', () => {

		beforeEach(() => {
			sinon.stub(readlineIntefaceMock, 'question', (question, callback) => {
				callback(null, 'input')
			})
		})

		afterEach(() => {
			readlineIntefaceMock.question.restore()
		})

		it('returns a promise', () => {
			return terminal.promptUser().should.be.Promise()
		})

		it('calls readline.question() with "testString"', () => {
			return terminal.promptUser('testString')
			.then(() => readlineIntefaceMock.question.should.be.calledWith('testString'))
		})

	})


	describe('.close()', () => {

		beforeEach(() => {
			sinon.spy(readlineIntefaceMock, 'close')
		})

		afterEach(() => {
			readlineIntefaceMock.close.restore()
		})

		it('calls readline.close() with readline as context', () => {
			terminal.close()
			return readlineIntefaceMock.close.should.be.called()
		})

	})

})
