# Ocupop Prettier Config
Sets up prettier config within `npx` across projects

## Setup
Run the following `npx` command to install prettier

```
npx @ocupop/prettier-config
```

### Options
```
  --version        Show version number                                 [boolean]
  -h, --help       Show help                                           [boolean]
  --remove, --rm   Remove prettier from application   [boolean] [default: false]
  --upgrade, --up  Upgrade prettier config            [boolean] [default: false]
  ```

## Using
### Files
Once installed, the package will add two new files:
`prettier.config.js` where we can add addtional config [options](https://prettier.io/docs/en/options.html) per project, and `.prettierignore` in which we can ignore files/directories when using prettier.

### Scripts
Within `package.json` two new scrips are installed.
```
$ yarn checkFormat  # will run prettier and validate files
$ yarn format       # formats all files (with specified extensions) 
```

### Prettier Extension
By default we do not require that the pretty extension be installed. Simply running `yarn format` will run prettier within our code base. However a step up, we can install the [prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) which will help format as you develop.

With it installed you can setup (under settings) `"editor.formatOnSave": true` which will format your files each save. You can also run `Format Document` from your command pallet

## Publishing
```
$ npm login <login with ocupop creds>
# [ ] Make sure to push changes to git first
# [ ] Make sure to bump the version number
$ npm publish
```