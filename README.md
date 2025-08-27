# clipboard-mcp

Cross-platform clipboard MCP server.

## Usage

Add to your MCP client config:

### macOS / Windows
```json
{
  "mcpServers": {
    "clipboard": {
      "command": "deno",
      "args": ["run", "-E", "--allow-run", "jsr:@yumafuu/clipboard-mcp"]
    }
  }
}
```

### Linux
```json
{
  "mcpServers": {
    "clipboard": {
      "command": "deno",
      "args": ["run", "-RE", "--allow-run", "jsr:@yumafuu/clipboard-mcp"]
    }
  }
}
```
*Note: -R (read) is required on Linux to check if `xclip` or `xsel` commands exist*

## Tools

- `get_clipboard`: Get current clipboard content
- `set_clipboard`: Set clipboard content

## Requirements

- [Deno](https://deno.land/)

### Platform-specific requirements

- **macOS**: No additional requirements (uses built-in `pbpaste`/`pbcopy`)
- **Windows**: No additional requirements (uses built-in `clip`/`Get-Clipboard`)
- **Linux**: Install `xclip` or `xsel`
  ```bash
  sudo apt install xclip  # Ubuntu/Debian
  sudo dnf install xclip  # Fedora
  sudo pacman -S xclip    # Arch
  ```
