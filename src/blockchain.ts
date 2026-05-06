import Block from "./lib/block";

export default class Blockchain {
    readonly blocks: Block[];
    private nextIndex: number = 0;

    constructor() {
        this.blocks = [Block.generateGenesis()]
        this.nextIndex++;
    }

    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    addBlock(block: Block, difficulty: number): boolean {
        const lastBlock = this.getLastBlock();

        if (!block.isValid(lastBlock.hash, lastBlock.index, difficulty)) return false;

        this.blocks.push(block);
        this.nextIndex++;

        return true;
    }

    isValid(): boolean {
        for (let i = 1; i < this.blocks.length; i++) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const result: boolean = currentBlock.isValid(previousBlock.hash, previousBlock.index, 0)
            if (!result)
                return false;
        }
        return true;
    }
}