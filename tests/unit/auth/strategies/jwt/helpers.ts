import jwt, { PrivateKey, PublicKey, } from "jsonwebtoken";
import crypto from "crypto";
// Supported algorithms
export const ALGORITHMS = ["RS256", "ES256"] as const;

// Generate ephemeral RSA key pair for RS256
export function generateRS256KeyPair(): { publicKey: PublicKey; privateKey: PrivateKey } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
    });
    return {
        publicKey: publicKey.export({ type: "spki", format: "pem" }).toString(),   
        privateKey: privateKey.export({ type: "pkcs8", format: "pem" }).toString(), 
    };
}

// Generate ephemeral EC key pair for ES256
export function generateES256KeyPair(): { publicKey: PublicKey; privateKey: PrivateKey } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", {
        namedCurve: "P-256",
    });
    return {
        publicKey: publicKey.export({ type: "spki", format: "pem" }),
        privateKey: privateKey.export({ type: "pkcs8", format: "pem" }),
    };
}

// Randomly pick an algorithm per test run
export function pickRandomAlgorithm(): typeof ALGORITHMS[number] {
    const idx = Math.floor(Math.random() * ALGORITHMS.length);
    return ALGORITHMS[idx];
}

// Map to store generated key pairs per algorithm
export const keyPairs: Record<typeof ALGORITHMS[number], { publicKey: PublicKey; privateKey: PrivateKey }> = {
    RS256: generateRS256KeyPair(),
    ES256: generateES256KeyPair(),
};