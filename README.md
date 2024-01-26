# bun-self

Let's say you have a file called `script.ts` with the following content:

```ts
import { $ } from "bun";
await $`curl -s wttr.in`;
```

And you really want your friend to run it, so you decide to share a gist with them, but they are not as cool as you and don't have Bun installed yet. A problem.

But you won't even believe what happens next:

```sh
bunx bun-self script.ts
```

And you send this beauty to your friend instead (`script.run.ts`):

```ts
#!/usr/bin/env bash

/*/.this-doesnt-exist 2>/dev/null
## Please do not edit this part of the script, this is a loader created by "bunx bun-self"
if ! [ -x "$(command -v bun)" ]; then
    echo "Installing bun.sh"
    sleep 2
    curl -fsSL https://bun.sh/install | bash
    echo "Now let's run the script"
    echo ""
fi
bun $0
exit 0
#*/

// Script starts here
import { $ } from "bun";
await $`curl -s wttr.in`;
```

Your friend just has to run it either with

```sh
bash script.run.ts
```
or

```sh
chmod +x ./script.run.ts
./script.run.ts
```

They won't even know what hit them.

Of course it doesn't have to be a friend, you can hide that stuff in plain sight at your job with an innocent-looking "bash script.run.ts" in the "scripts" section of your package.json and no one even will notice that they are now happy Bun users.

# References

- [makeself.io](https://github.com/megastep/makeself)
- [created with DTN](https://jlarky.vercel.app/posts/how-to-create-npm-package)
