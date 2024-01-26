#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run
// Copyright 2018-2022 the oak authors. All rights reserved. MIT license.

/**
 * This is the build script for building npm package.
 *
 * @module
 */

import { build, emptyDir } from "https://deno.land/x/dnt@0.39.0/mod.ts";

async function start() {
  await emptyDir("./npm");

  await build({
    entryPoints: [
      "./mod.ts",
      {
        kind: "bin",
        name: "bun-self",
        path: "./cli.ts",
      },
    ],
    outDir: "./npm",
    shims: {
      deno: true,
    },
    test: false,
    typeCheck: "both",
    compilerOptions: {
      importHelpers: false,
      sourceMap: true,
      target: "ES2021",
      lib: ["ESNext", "DOM", "DOM.Iterable"],
    },
    package: {
      name: "bun-self",
      version: Deno.args[0],
      description:
        "Do you sometimes wish that you could just run javascript as if it was bash?",
      license: "MIT",
      keywords: ["bun"],
      engines: {
        node: ">=8.0.0",
      },
      repository: {
        type: "git",
        url: "git+https://github.com/JLarky/bun-self.git",
      },
      bugs: {
        url: "https://github.com/JLarky/bun-self/issues",
      },
      dependencies: {},
      devDependencies: {},
    },
  });

  await Deno.copyFile("LICENSE", "npm/LICENSE");
  await Deno.copyFile("README.md", "npm/README.md");
}

start();
