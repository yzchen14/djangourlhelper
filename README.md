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

## Known Issues

- Large URL configurations may take a moment to load
- Dynamic URL patterns (those generated at runtime) may not be detected

## Release Notes

### 0.1.0

Initial release of Django URL Helper with basic URL exploration and navigation features.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

***

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).

* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).

* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)

* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
