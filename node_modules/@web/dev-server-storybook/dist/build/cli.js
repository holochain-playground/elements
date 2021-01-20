#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_args_1 = __importDefault(require("command-line-args"));
const path_1 = __importDefault(require("path"));
const build_1 = require("./build");
async function main() {
    const args = command_line_args_1.default([
        {
            name: 'config-dir',
            alias: 'c',
            type: String,
            defaultValue: './.storybook',
        },
        {
            name: 'output-dir',
            alias: 'o',
            type: String,
            defaultValue: 'storybook-static',
        },
        {
            name: 'type',
            alias: 't',
            type: String,
            defaultValue: 'web-components',
        },
    ]);
    const configDir = path_1.default.resolve(args['config-dir']);
    const outputDir = path_1.default.resolve(args['output-dir']);
    await build_1.build({ type: args.type, configDir, outputDir });
}
main();
//# sourceMappingURL=cli.js.map