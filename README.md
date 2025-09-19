# Django URL Helper

A Visual Studio Code extension designed to help Django developers manage and navigate URLs in their projects more efficiently.

## Features

- **URL Explorer**: View all Django URL patterns in a dedicated sidebar
- **Quick Navigation**: Jump to URL pattern definitions with a single click
- **Copy URLs**: Quickly copy URL patterns to clipboard
- **Quick Insert**: Insert URL patterns directly into your code
- **Refresh Support**: Manually refresh URL patterns when your Django URL configuration changes

## Installation

1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X)
3. Search for "Django URL Helper"
4. Click Install

## Usage

### Opening the URL Explorer

1. Click on the Django URL Helper icon in the Activity Bar
2. The URL Explorer will show all your Django URL patterns in a tree view

### Available Commands

- **Refresh Django URLs**: Manually refresh the URL patterns
- **Copy URL**: Copy a URL pattern to clipboard
- **Quick Insert URL**: Insert a URL pattern at the current cursor position

## Requirements

- Visual Studio Code 1.75.0 or higher
- A Django project with properly configured URL patterns

## Extension Settings

This extension contributes the following settings:

* `djangourlhelper.autoRefresh`: Enable/disable automatic refresh of URL patterns (default: `true`)
* `djangourlhelper.urlPatterns`: List of URL pattern files to scan (default: `["urls.py"]`)


## Release Notes

### 0.1.0

Initial release of Django URL Helper with basic URL exploration and navigation features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Enjoy!**
