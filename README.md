# `@ocupop/prettier-config`

> My personal [Prettier](https://prettier.io) config.

## Usage

**Install**:

```bash
$ yarn add --dev ocupop-prettier-config
```

**Edit `package.json`**:

```jsonc
{
  // ...
  "prettier": "ocupop-prettier-config"
}
```

**Update**:
```bash
$ yarn upgrade ocupop-prettier-config
```

**publish to npm**:
```bash
$ npm login <login with ocupop creds>
# Make sure to push changes to git first
$ npm publish
```

## Known Issues
https://github.com/prettier/prettier/issues/3460

Currently we can't ignore files. To ignore files for now we have to:
**Add .prettierignore file to root**
```bash
cd <root-of-project>
touch .prettierignore
```

**Open file and add the following**
```
# .prettierignore
.cache
package.json
package-lock.json
public
*.html
```
