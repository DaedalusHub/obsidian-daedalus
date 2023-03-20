import { App, Editor, MarkdownView, Notice, TFile, Vault, View } from "obsidian";

export async function createNewFile(contents: string, app: App, folderName: string): Promise<TFile> {
  const vault = getVault(app);
  if (!vault) {
    throw new Error("No active vault found.");
  }

  const fileName = generateFileName();
  const file = await vault.create(folderName + "/" + fileName, contents);
  new Notice(`New file created: ${file.path}`, 10000);
  console.log("New file created:", file.path);
  return file;
}

export function generateFileName(): string {
  const now = new Date();
  const dateTimeString = now.toISOString().replace(/[-T:]/g, "").slice(0, -5);
  return `ChatGPT Response ${dateTimeString}.md`;
}

export function getActiveEditor(app: App): Editor | null {
  const view = app.workspace.getActiveViewOfType(MarkdownView);
  if (view) {
    return view.editor;
  }
  return null;
}

function getVault(app: App): Vault | null {
  const { vault } = app;
  if (vault) {
    return vault;
  }
  return null;
}

export function addDaedalusStatusBarItem(view: View, statusBar: HTMLDivElement): void {
  const statusBarItemElement = statusBar.createDiv();
  statusBarItemElement.setText("Status Bar Text");
}
