import { createToolsServer } from "jsr:@mizchi/mcp-helper@^0.0.4";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@1.5.0/server/stdio.js";
import { z } from "npm:zod@3.24.2";
import $ from "jsr:@david/dax@^0.42.0";
import type { Server } from "npm:@modelcontextprotocol/sdk@1.5.0/server/index.js";

const tools = [
  {
    name: "get_clipboard",
    description: "Get current clipboard content",
    inputSchema: z.object({}),
    outputSchema: z.string(),
  },
  {
    name: "set_clipboard",
    description: "Set clipboard content",
    inputSchema: z.object({
      content: z.string().describe("Content to set in clipboard"),
    }),
    outputSchema: z.string(),
  },
] as const;

async function getClipboardContent(): Promise<string> {
  const os = Deno.build.os;
  
  try {
    switch (os) {
      case "darwin": // macOS
        return await $`pbpaste`.text();
      
      case "windows":
        return await $`powershell -command "Get-Clipboard"`.text();
      
      case "linux":
        // Try xclip first, then xsel
        if (await $.commandExists("xclip")) {
          return await $`xclip -selection clipboard -o`.text();
        } else if (await $.commandExists("xsel")) {
          return await $`xsel --clipboard --output`.text();
        } else {
          throw new Error("No clipboard utility found. Please install xclip or xsel.");
        }
      
      default:
        throw new Error(`Unsupported operating system: ${os}`);
    }
  } catch (error) {
    throw new Error(`Failed to get clipboard content: ${(error as Error).message}`);
  }
}

async function setClipboardContent(content: string): Promise<void> {
  const os = Deno.build.os;
  
  try {
    switch (os) {
      case "darwin": // macOS
        await $`pbcopy`.stdinText(content);
        break;
      
      case "windows":
        await $`clip`.stdinText(content);
        break;
      
      case "linux":
        // Try xclip first, then xsel
        if (await $.commandExists("xclip")) {
          await $`xclip -selection clipboard`.stdinText(content);
        } else if (await $.commandExists("xsel")) {
          await $`xsel --clipboard --input`.stdinText(content);
        } else {
          throw new Error("No clipboard utility found. Please install xclip or xsel.");
        }
        break;
      
      default:
        throw new Error(`Unsupported operating system: ${os}`);
    }
  } catch (error) {
    throw new Error(`Failed to set clipboard content: ${(error as Error).message}`);
  }
}

const server: Server = createToolsServer(
  {
    name: "clipboard-mcp",
    version: "1.0.0",
  },
  tools,
  {
    async get_clipboard() {
      return await getClipboardContent();
    },
    async set_clipboard(params: { content: string }) {
      await setClipboardContent(params.content);
      return "Clipboard content set successfully";
    },
  }
);

if (import.meta.main) {
  await server.connect(new StdioServerTransport());
}

export default server;
export { getClipboardContent, setClipboardContent };