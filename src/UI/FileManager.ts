export class FileManager {
  public static async readFile(path: string): Promise<string> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Error reading file:", error);
      throw error;
    }
  }

  public static async writeFile(
    filename: string,
    content: string
  ): Promise<void> {
    try {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error writing file:", error);
      throw error;
    }
  }

  public static loadImage(
    path: string,
    callback: (img: HTMLImageElement) => void
  ): HTMLImageElement {
    const img = new Image();
    img.src = path;
    img.crossOrigin = "anonymous"; // Adjust this as needed for your CORS policy
    img.onload = () => callback(img);
    img.onerror = (e) => {
      console.error(`Failed to load image from path: ${path}`, e);
    };
    return img;
  }
}
