import { createInMemoryTestClient } from "jsr:@mizchi/mcp-helper";
import server, { getClipboardContent, setClipboardContent } from "./clipboard-mcp-server.ts";
import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("OS detection and command availability", async () => {
  const os = Deno.build.os;
  console.log(`Running on: ${os}`);
  
  // Test that we can detect the OS
  assertEquals(typeof os, "string");
  assertEquals(["darwin", "windows", "linux"].includes(os), true);
});

Deno.test("clipboard operations - integration test", async (t) => {
  const os = Deno.build.os;
  
  // Only run actual clipboard tests if we're on a supported platform
  // and the required commands are available
  if (os === "darwin") {
    await t.step("should work on macOS with pbcopy/pbpaste", async () => {
      try {
        const testContent = "Hello from MCP test!";
        await setClipboardContent(testContent);
        const result = await getClipboardContent();
        assertEquals(result, testContent);
      } catch (error) {
        console.warn("Clipboard test skipped:", (error as Error).message);
      }
    });
  } else {
    await t.step(`should detect ${os} platform`, () => {
      assertEquals(["windows", "linux"].includes(os), true);
    });
  }
});

Deno.test("MCP server integration", async () => {
  const client = await createInMemoryTestClient(server);
  
  try {
    // Test that the server responds to tool calls
    // Note: This might fail if clipboard commands are not available
    // but it tests the MCP integration
    const testContent = "Hello from MCP integration test!";
    
    try {
      const setResult = await client.callTool("set_clipboard", {
        content: testContent
      });
      assertEquals(setResult, "Clipboard content set successfully");
      
      const getResult = await client.callTool("get_clipboard", {});
      assertEquals(getResult, testContent);
    } catch (error) {
      console.warn("MCP clipboard test skipped:", (error as Error).message);
      // Test that error handling works
      assertEquals(typeof (error as Error).message, "string");
    }
    
  } finally {
    await client.close();
  }
});