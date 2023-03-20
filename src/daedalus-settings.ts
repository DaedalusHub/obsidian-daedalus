import { App, PluginSettingTab, Setting } from "obsidian";
import Daedalus from "./daedalus";

export interface DaedalusSettings {
  apiKey: string;
  responseFolder: string;
  maxTokens: number;
}

export const DEFAULT_SETTINGS: DaedalusSettings = {
  apiKey: "",
  responseFolder: "ChatGPT",
  maxTokens: 200,
};

export class DaedalusSettingTab extends PluginSettingTab {
  plugin: Daedalus;

  constructor(app: App, plugin: Daedalus) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for Daedalus Plugin." });

    new Setting(containerEl)
      .setName("OpenAI API Key")
      .setDesc("Needed to send requests to OpenAI API.")
      .addText((text) =>
        text
          .setPlaceholder("Enter your API key here...")
          .setValue(this.plugin.settings.apiKey)
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("ChatGPT Responses folder")
      .setDesc("The folder where ChatGPT response files will be saved.")
      .addText((text) =>
        text
          .setPlaceholder("Enter your folder name here...")
          .setValue(this.plugin.settings.responseFolder)
          .onChange(async (value) => {
            this.plugin.settings.responseFolder = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Max Tokens")
      .setDesc("The maximum number of tokens to generate in the response.")
      .addText((text) =>
        text
          .setPlaceholder("Enter the maximum number of tokens...")
          .setValue(String(this.plugin.settings.maxTokens))
          .onChange(async (value) => {
            const maxTokens = parseInt(value);
            if (!isNaN(maxTokens)) {
              this.plugin.settings.maxTokens = maxTokens;
              await this.plugin.saveSettings();
            }
          })
      );
  }
}
