/* Copyright 2021, Milkdown by Mirone.*/
import { defineConfig } from 'tsup';

export default defineConfig([
    {
        clean: true,
        entry: {
            extension: 'src/extension.ts',
        },
        external: ['vscode'],
        format: ['cjs'],
        shims: false,
        dts: false,
        minify: true,
        platform: 'node',
    }
]);
