import {describe, test, expect, beforeAll} from "vitest";
import Blockchain from "../src/blockchain";
import Block from "../src/lib/block";
import block from "../src/lib/block";

describe('Blockchain tests', () => {
    let blockchain: Blockchain;
    beforeAll(() => {
        blockchain = new Blockchain();
    })

    test('Deve conter bloco genesis', () => {
        expect(blockchain.blocks.length).toEqual(1);
    })

    test('Deve ser valida', () => {
        const blockchain = new Blockchain();
        expect(blockchain.isValid()).toEqual(true);
    })

    test('Deve adicionar um novo bloco', () => {
        const blockchain = new Blockchain();
        const genesisBlock = blockchain.getLastBlock();
        const block = Block.generate(1, {amount: 100}, genesisBlock.hash, 55357);
        expect(blockchain.isValid()).toEqual(true);

    })
})