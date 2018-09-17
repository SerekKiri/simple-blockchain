const SHA256 = require("crypto-js/sha256")
const readline = require('readline')

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash
        this.timestamp = timestamp
        this.transactions = transactions
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++
            this.hash = this.calculateHash()
        }

        console.log("BLOCK MINED: " + this.hash)
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2
        this.pendingTransactions = []
        this.miningReward = 1
    }

    createGenesisBlock() {
        return new Block(Date.parse("2017-01-01"), "Test", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress){
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward)
        this.pendingTransactions.push(rewardTx)
        
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
        block.mineBlock(this.difficulty)

        console.log('Block successfully mined!')
        this.chain.push(block)

        this.pendingTransactions = []
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction)
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.hash = newBlock.calculateHash()
        this.chain.push(newBlock)
    }


    getBalanceOfAddress(address){
        let balance = 0

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount
                }

                if(trans.toAddress === address){
                    balance += trans.amount
                }
            }
        }

        return balance
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false
            }
        }

        return true
    }
}

let saveCoin = new Blockchain()
console.log('\n Starting the miner...')

saveCoin.addBlock(new Block(0, 'ddd'))

console.log(JSON.stringify(saveCoin.chain, null, 4))