import { Notice, Plugin, PluginSettingTab } from "obsidian";
import { addDaedalusStatusBarItem, createNewFile, getActiveEditor } from "./editor-helpers";
import { sendRequestToChatGPT } from "./chatgpt";
import { DaedalusSettings, DaedalusSettingTab, DEFAULT_SETTINGS } from "./daedalus-settings";

export default class Daedalus extends Plugin {
  settings: DaedalusSettings = DEFAULT_SETTINGS;
  statusBarItemElement: HTMLElement = this.addStatusBarItem();

  async onload(): Promise<void> {
    await this.loadSettings();

    this.statusBarItemElement.setText("Daedalus Plugin Loaded.");

    this.addCommand({
      id: "daedalus-send-to-chatgpt",
      name: "Send to ChatGPT",
      callback: async () => {
        const editor = getActiveEditor(this.app);
        if (!editor) {
          console.error("No active editor found.");
          return;
        }

        const text = editor.getSelection();

        if (!text) {
          this.statusBarItemElement.setText("No text selected.");
          console.error("No text selected.");
          return;
        }

        this.statusBarItemElement.setText("Sending request to ChatGPT...");

        const apiKey = this.settings.apiKey;
        const maxTokens = this.settings.maxTokens;
        const response = await sendRequestToChatGPT(text, apiKey, maxTokens);

        if (!response) {
          this.statusBarItemElement.setText("Error sending request to ChatGPT.");
          console.error("Error sending request to ChatGPT.");
          return;
        } else {
          this.statusBarItemElement.setText("Response received from ChatGPT.");
          console.log("Response received from ChatGPT.");
        }

        const folder = this.settings.responseFolder;
        const file = await createNewFile(response, this.app, folder);

        const message = `ChatGPT response saved to <a href="${file.path}">${file.name}</a>.`;
        new Notice(message, 10000);
        this.statusBarItemElement.setText(message);
        console.log("ChatGPT response saved to file:", file.path);
      },
    });

    this.addSettingTab(new DaedalusSettingTab(this.app, this) as PluginSettingTab);

    const leaf = this.app.workspace.getLeafById("right");
    if (leaf) {
      const statusBar = leaf.view.containerEl.createDiv("status-bar");
      addDaedalusStatusBarItem(leaf.view, statusBar);
    }
  }

  async loadSettings(): Promise<void> {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
