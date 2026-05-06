import {vi, describe, test, expect, beforeAll} from "vitest";
import Block from "../src/lib/block";


describe("Block tests", () => {
    let genesisBlock: Block;
    const FIXED_TIMESTAMP = 1778036531388
    beforeAll(() => {
        vi.spyOn(Date, "now").mockReturnValue(FIXED_TIMESTAMP)
        genesisBlock = Block.generateGenesis(); // cria o genesis após mock do Date.now
    })

    test("deve criar um bloco genesis corretamente", () => {
        expect(genesisBlock).toBeInstanceOf(Block);
        expect(genesisBlock.index).toBe(0);
        expect(genesisBlock.previousHash).toBe(null);
        expect(genesisBlock.data).toEqual({name: "Genesis Block"});
        expect(genesisBlock.hash).toHaveLength(64);
        expect(genesisBlock.isValid(null, null, 0))
    });

    test("deve lançar erro se index for negativo", () => {
        expect(() => Block.generate(-1, "dados inválidos", "", 0)).toThrow(
            "Index can't be negative",
        );
    });

    test("hash deve mudar quando nonce mudar", () => {
        const block1 = Block.generate(1, "teste", "abc123", 0);
        const block2 = Block.generate(1, "teste", "abc123", 5);

        expect(block1.hash).not.toBe(block2.hash);
    });

    test("hash deve mudar quando data mudar", () => {
        const block1 = Block.generate(1, "dados originais", "prev", 0);
        const block2 = Block.generate(1, "dados diferentes", "prev", 0);

        expect(block1.hash).not.toBe(block2.hash);
    });

    test("deve calcular hash corretamente com objeto complexo", () => {
        const complexData = {
            transactions: [
                {from: "A", to: "B", amount: 100},
                {from: "B", to: "C", amount: 50},
            ],
            version: 1,
        };

        const block = Block.generate(2, complexData, "previous-hash-123", 72853);

        expect(block.hash).toHaveLength(64);
    });

    test("hasValidHash deve retornar true quando requisitos forem atendidos", () => {

        const block = Block.generate(1, {amount: 100}, genesisBlock.hash, 55357);

        expect(block.isValid(genesisBlock.hash, genesisBlock.index, 4)).toBeTruthy();
        expect(block.isValid("sadadasdad", genesisBlock.index, 4)).toBeFalsy();
        expect(block.isValid(genesisBlock.hash, 2, 4)).toBeFalsy();
        expect(block.isValid(genesisBlock.hash, genesisBlock.index, 5)).toBeFalsy();
    });

    test("bloco deve ser imutável (propriedades readonly)", () => {
        const block = Block.generate(1, "teste", "prev", 0);

        // @ts-expect-error - Silenciando typescript para testar a imutabilidade em tempo de execução
        expect(() => block.index = 10).toThrow();
        // @ts-expect-error
        expect(() => block.data = "novo dado").toThrow();
        expect(Object.isFrozen(block)).toBeTruthy();
    })

});
