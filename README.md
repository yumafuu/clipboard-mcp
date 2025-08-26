# clipboard-mcp

Cross-platform clipboard MCP server.

## Usage

Add to your MCP client config:

```json
{
  "mcpServers": {
    "clipboard": {
      "command": "deno",
      "args": ["run", "-A", "jsr:@yumafuu/clipboard-mcp"]
    }
  }
}
```

## Tools

- `get_clipboard`: Get current clipboard content
- `set_clipboard`: Set clipboard content

## Requirements

- [Deno](https://deno.land/)

- **Linux**: Install `xclip` or `xsel`
  ```bash
  sudo apt install xclip  # Ubuntu/Debian
  sudo dnf install xclip  # Fedora
  sudo pacman -S xclip    # Arch
  ```
