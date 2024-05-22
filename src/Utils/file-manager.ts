export class FileManager {
  public static async readFile(path: string) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
  }

  public static async writeFile(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    a.click();
  }
}