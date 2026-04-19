import { describe, test, expect } from "vitest";
import Block from "../src/lib/block";

describe("Blockclear", () => {
  test("deve criar um bloco genesis corretamente", () => {
    const genesisBlock = Block.generateGenesis();

    expect(genesisBlock).toBeInstanceOf(Block);
    expect(genesisBlock.index).toBe(0);
    expect(genesisBlock.previousHash).toBe(undefined);
    expect(genesisBlock.data).toEqual({ name: "Genesis Block" });
    expect(genesisBlock.hash).toHaveLength(64);
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
    const block1 = Block.generate(1, "dados originais", "prev",0);
    const block2 = Block.generate(1, "dados diferentes", "prev",0);

    expect(block1.hash).not.toBe(block2.hash);
  });

  test("deve calcular hash corretamente com objeto complexo", () => {
    const complexData = {
      transactions: [
        { from: "A", to: "B", amount: 100 },
        { from: "B", to: "C", amount: 50 },
      ],
      version: 1,
    };

    const block = Block.generate(2, complexData, "previous-hash-123", 72853);

    expect(block.hash).toHaveLength(64);
  });

  // test("hasValidHash deve retornar true quando hash tem dificuldade atendida", () => {
  //   const block = Block.generate(1, "teste", "prev", 12345);

  //   (block as any).hash = "0000abc123..."; // Simulando um hash que atende a dificuldade

  //   expect(block.hasValidHash(4)).toBeTruthy();
  //   expect(block.hasValidHash(5)).toBeFalsy();
  // });

  test("bloco deve ser imutável (propriedades readonly)", ()=> {
    const block = Block.generate(1, "teste", "prev", 0);

    // @ts-expect-error - Silenciando typescript para testar a imutabilidade em tempo de execução
    expect(()=>block.index = 10).toThrow();
    // @ts-expect-error
    expect(()=>block.data = "novo dado").toThrow();
    expect(Object.isFrozen(block)).toBeTruthy();
  })

});
