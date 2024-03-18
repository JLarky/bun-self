import path from "node:path";

export async function createRunnable() {
  const [filename] = Deno.args;

  if (!filename) {
    console.log("This command requires filename as an argument");
    Deno.exit(1);
  }
  const exists = await fileExists(filename);
  if (!exists) {
    console.log(`File ${filename} does not exist.`);
    Deno.exit(1);
  }

  const outputFilename = getOutputFilename(filename);
  const outputExists = await fileExists(outputFilename);
  if (outputExists) {
    console.log(
      `Output file ${outputFilename} already exists. Please remove it and try again.`
    );
    Deno.exit(1);
  }
  const input = await Deno.readTextFile(filename);
  const output = getTempalte() + input;
  await Deno.writeTextFile(outputFilename, output, {
    mode: 0o755,
  });
  console.log(`File ${outputFilename} created.`);
  console.log(`You can now run it with "./${outputFilename}"`);
  console.log();
  console.log(
    `If you want to share it with others, they might need to "chmod +x ${outputFilename}" it first or run it with "bash ${outputFilename}"`
  );
}

async function fileExists(filename: string) {
  try {
    await Deno.lstat(filename);
    return true;
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
    return false;
  }
}

function getOutputFilename(filename: string) {
  const extension = path.extname(filename);
  const baseName = path.basename(
    filename,
    [".ts", ".js"].includes(extension) ? extension : undefined
  );

  return path.format({
    name: baseName,
    ext: extension === ".ts" ? ".run.ts" : ".run.js",
  });
}

function getTempalte() {
  return `
#!/bin/sh

/*/.this-doesnt-exist 2>/dev/null
## Please do not edit this part of the script, this is a loader created by "npx bun-self"
if ! [ -x "$(command -v bun)" ]; then
    ## it's possible that bun is installed but not in the PATH, let's check if BUN_INSTALL is set
    if [ -z "$BUN_INSTALL" ]; then
        export BUN_INSTALL="$HOME/.bun"
        export PATH="$BUN_INSTALL/bin:$PATH"
    fi
    if ! [ -x "$(command -v bun)" ]; then
        echo "Installing bun.sh"
        [ -z "$CI" ] && sleep 2
        curl -fsSL https://bun.sh/install | bash
        echo "Now let's run the script"
        echo ""
    fi >&2
fi
bun "$0" "$@"
exit 0
#*/

// Script starts here
`.trimStart();
}
