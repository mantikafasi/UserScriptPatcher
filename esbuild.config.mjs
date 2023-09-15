import * as esbuild from "esbuild";

const userScriptHeader = `
// ==UserScript==
// @name            UserScriptPatcher
// @description     User script to monkey patch js functions
// @version         1.0.0
// @author          mantikafasi (https://github.com/mantikafasi)
// @namespace       https://github.com/mantikafasi/UserScriptPatcher
// @license         GPL-3.0
// @match           *://*/*
// @grant           none
// @run-at          document-start
// ==/UserScript==
`;

await esbuild.buildSync({
    entryPoints: ["./src/index.js"],
    outfile: "./build/UserScriptPatcher.user.js",
    format: "iife",
    globalName: "UserScriptPatcher",
    bundle: true,
    logLevel: "info",
    banner: {
        js: userScriptHeader,
    },
    plugins: [],
});

