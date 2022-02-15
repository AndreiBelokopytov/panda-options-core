# Description
Edit for yourself:
- package.json
- /tests/
- /contracts
- /migrations
- /storage

```
./storage - prod storage
./tests/storage - dev storage

```

# Requirements

- Installed NodeJS (v14+)
- Installed Docker (v20.10+)
- Installed VSCode with Remote - Containers extension [https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

# Setup
Use "Open Folder in Container..." command from VSCode command palette.

![Remote Conainers commands](https://microsoft.github.io/vscode-remote-release/images/remote-command-palette.png)

# Quick Start tests

```
npm test
```

# Compile contracts

```
npm run compile
```

# Compile single contract

```
npm run compile example.ligo
```

# Deploy contract

```
npm run migrate --network localhost
```
Possible networks are:
* localhost
* testnet (Hangzhou)
* mainnet
