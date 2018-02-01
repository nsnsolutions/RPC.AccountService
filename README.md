# RPC.AccountService

A service for authority, authorization and account details.


## Quick Start

To run the service locally:

```bash
nvm use
npm install
npm start
```

For automatic code reloading in development:

```bash
npm install
npm run nodemon
```

Please use the Postman collection [RPC_AccountService](https://velma-postmen.postman.co/collections/312820-f577eafb-0a9f-72ca-b6d3-d67b5d605913) to test this service. Please keep the postman collection up to date with new methods.

## Other NPM options

To run Unit Tests:

```bash
npm test
```

To run lint check:

```bash
npm run lint
```

## Quick Start Troubleshooting

__TypeError: util.promisify is not a function__

If you recieved this error while running `npm start`, you are most likely not running the correct version of node. Make sure you are running the version of node specified in the `.nvmrc` file.

__N/A: version "[some version] -> N/A" is not yet installed.__

If you recieved this error while running `nvm use`, you have not installed the required version of node. Using nvm, type `nvm install [some version]` where `[some version]` is the text from the error message.

__nvm is not installed__

If you are using osx, you can install nvm with brew or using the curl command from https://github.com/creationix/nvm.

If you are using windows, nvm is not available. You will need to install the correct version of node for your envionment. You can determin the correct version of node by opening the `.nvmrc` file located at the root of the project.