import { describe, test, expect } from "vitest";
import Block from "../src/lib/block";

describe("Blockclear", () => {
  test("deve criar um bloco genesis corretamente", () => {
    const genesisBlock = Block.generateGenesis();
  
    expect(genesisBlock).toBeInstanceOf(Block);
    expect(genesisBlock.index).toBe(0);
    expect(genesisBlock.previousHash).toBe(undefined);
    expect(genesisBlock.data).toEqual({name: "Genesis Block"});
    expect(genesisBlock.hash).toHaveLength(64);
  });


  test("deve lançar erro se index for negativo",()=> {
    expect(() => Block.generate(-1, "dados inválidos", "")).toThrow(
      "Index can't be negative"
    );
  });
});
