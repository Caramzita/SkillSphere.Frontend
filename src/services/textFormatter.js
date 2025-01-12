export function trimAndFormatContent(content) {
    if (!content) return "";
    
    return content
      .split("\n")
      .map(line => line.trim().replace(/\s+/g, " "))
      .filter(line => line.length > 0)
      .join("\n");
  }