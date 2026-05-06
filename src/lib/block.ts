import {createHash} from "node:crypto";

class Block {
    readonly index: number;
    readonly timestamp: number;
    readonly data: any;
    readonly previousHash: string | null;
    readonly nonce: number;
    readonly hash: string;

    private constructor(
        index: number,
        data: any,
        previousHash: string | null,
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
        this.hash = this.calculateHash();
    }

    private calculateHash(): string {
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

    isValid(previousHash: string, previousIndex: number, difficulty: number): boolean {
        if (previousHash !== this.previousHash)
            return false

        if (this.index !== previousIndex + 1)
            return false

        if (!this.data)
            return false

        if (this.timestamp < 1)
            return false

        if (this.previousHash !== previousHash)
            return false

        return this.hasValidHash(difficulty);
    }

    private hasValidHash(difficulty: number): boolean {
        return this.hash.startsWith("0".repeat(difficulty))
    }

    static generate(
        index: number,
        data: any,
        previousHash: string,
        nonce: number,
    ): Block {
        const block = new Block(index, data, previousHash, nonce);
        // Congelando o bloco para garantir que do lado javascript seja imutável
        return (Object.freeze(block) as unknown) as Block;
    }

    static generateGenesis(): Block {
        const block = new Block(0, {name: "Genesis Block"}, null, 0);
        // Congelando o bloco para garantir, do lado javascript, que seja imutável
        return (Object.freeze(block) as unknown) as Block;
    }
}

export default Block;
