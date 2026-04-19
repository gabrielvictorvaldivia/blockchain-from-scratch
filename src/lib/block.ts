import { createHash } from "node:crypto";

class Block {
  readonly index: number;
  readonly timestamp: number;
  readonly data: any;
  readonly previousHash: string | undefined;
  readonly nonce: number;
  readonly hash: string;

  private constructor(
    index: number,
    data: any,
    previousHash: string | undefined,
    nonce: number = 0,
    timestamp: number = Date.now(),
  ) {
    if (index < 0) {
      throw new Error("Index can't be negative");
    }

    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.hash = this.#calculateHash();
  }

  #calculateHash(): string {
    const dataStr =
      typeof this.data === "object" && this.data !== null
        ? JSON.stringify(this.data)
        : String(this.data);

    return createHash("sha256")
      .update(
        this.index +
          (this.previousHash ?? "") +
          this.timestamp +
          dataStr +
          this.nonce,
      )
      .digest("hex");
  }

  static generate(index: number, data: any, previousHash: string): Block {
    return new Block(index, data, previousHash);
  }

  static generateGenesis(): Block {
    return new Block(0, { name: "Genesis Block" }, undefined);
  }
}

export default Block;
