const hash = '01181c6843e02161e682d7c95c243321d08a4b52'
const shortHash = '01181c6'

const commit = {
	hash: 'dfd2dd9f198a309b7d94619a054370a55a6837a8',
	message: 'Add Routing',
}

const logs = [
	{ hash: '01181c6843e02161e682d7c95c243321d08a4b52', message: 'Initial commit' },
	{ hash: '6f1655e1fb389859b89aa00ce6410514068518b1', message: 'Add README.md' },
	{ hash: 'cdee66c82d5d7d3f9552d20be92e6e5639415d41', message: 'Feature 1' },
	{ hash: '4a543e014f35c960c0659c65185b32a3fc139a21', message: 'Bugfix' },
]

module.exports = {
	shortHash,
	hash,
	logs,
	commit,
	state: {
		logs,
		current: logs[1],
		next: logs[2],
	},
}
