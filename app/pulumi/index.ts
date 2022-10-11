import * as digitalocean from "@pulumi/digitalocean";
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' })

export const timebook = new digitalocean.App("timebook", {
    spec: {
        domainNames: [
            { name: "timebook.pascalhelbig.de" },
            { name: "timebook2.progwise.net" }
        ],
        name: "timebook",
        region: "fra1",
        services: [{
            environmentSlug: "node-js",
            git: {
                branch: "main",
                repoCloneUrl: "https://github.com/progwise/timebook",
            },
            instanceCount: 1,
            name: "timebook",
            instanceSizeSlug: "basic-xxs",
            sourceDir: "/app",
            buildCommand: "npm install && npm run build",
            runCommand: "npm run start",
            envs: [
                { key: "NEXTAUTH_URL", value: "timebook.pascalhelbig.de" },
                { key: "NEXTAUTH_SECRET", value: process.env.NEXTAUTH_SECRET, type: "SECRET" },
                { key: "GITHUB_CLIENT_ID", value: "3b6bc09f7f39df1dfd4b" },
                { key: "GITHUB_CLIENT_SECRET", value: process.env.GITHUB_CLIENT_SECRET, type: "SECRET" },
                { key: "DATABASE_URL", value: "${db.DATABASE_URL}" },
            ]
        }],
        databases: [{ engine: "PG", name: "db" }],
    },
});
