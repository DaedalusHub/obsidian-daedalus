# Daedalus

An interface between Obsidian and Project Daedalus

## Plugin Usage
Add your OpenAI API key in the plugin settings, and optionally specifying max keys (output max length), and desired output folder for responses. 

To use the plugin, select the text you wish to send then from the command palette run "Daedalus: Send to ChatGPT". It will write the response from ChatGPT to the folder specified previously or the root directory if unspecified. 

## Building

- Install NodeJS, then run `yarn install` in the command line under your repo folder.
- Run `yarn run build` to compile `daedalus.ts` to `main.js`.
- Make changes to `daedalus.ts` (or create new `.ts` files). Those changes should be automatically compiled
  into `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
- For updates to the Obsidian API run `yarn update` in the command line under your repo folder.

## Releasing new releases

- This repo performs automatic versioning and CHANGELOG.ms creation.
- Use HUMANLOG.md to write descriptions for humans.

## Manually installing the plugin

- Copy over `main.js`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## API Documentation

See https://github.com/obsidianmd/obsidian-api
