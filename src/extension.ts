// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

class UrlItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly path?: string,
        public readonly command?: vscode.Command,
        public readonly iconPath?: vscode.ThemeIcon
    ) {
        super(label, collapsibleState);
        this.tooltip = this.path || '';
    }
}

class DjangoUrlProvider implements vscode.TreeDataProvider<UrlItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<UrlItem | undefined | null | void> = new vscode.EventEmitter<UrlItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<UrlItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private urls: { [key: string]: string[] } = {};

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    async updateUrls() {
        this.urls = {};
        const urlsFiles = await vscode.workspace.findFiles('**/urls.py');
        
        for (const file of urlsFiles) {
            try {
                const content = fs.readFileSync(file.fsPath, 'utf8');
                const urlPatterns = this.parseUrlPatterns(content);
                if (urlPatterns.length > 0) {
                    this.urls[file.fsPath] = urlPatterns;
                }
            } catch (error) {
                console.error(`Error reading ${file.fsPath}:`, error);
            }
        }
        this.refresh();
    }

    private parseUrlPatterns(content: string): string[] {
        const urlPatterns: string[] = [];
        const urlPatternsRegex = /urlpatterns\s*=\s*\[(.|\n)*?\]/;
        const pathRegex = /path\s*\(\s*['"]([^'"]+)['"]\s*,\s*[^,)]+\s*(?:,\s*name\s*=\s*['"]([^'"]+)['"])?/g;
        
        const match = content.match(urlPatternsRegex);
        if (match) {
            const urlPatternsBlock = match[0];
            let pathMatch;
            while ((pathMatch = pathRegex.exec(urlPatternsBlock)) !== null) {
                const urlPath = pathMatch[1];
                const name = pathMatch[2] || '';
                urlPatterns.push(name ? `${name} (${urlPath})` : urlPath);
            }
        }
        
        return urlPatterns;
    }

    getTreeItem(element: UrlItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: UrlItem): vscode.ProviderResult<UrlItem[]> {
        if (!element) {
            // Root level - show all urls.py files
            return Object.entries(this.urls).map(([filePath, patterns]) => {
                const fileName = path.basename(filePath);
                const dirName = path.basename(path.dirname(filePath));
                const label = `${dirName}/${fileName}`;
                return new UrlItem(
                    label,
                    patterns.length > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
                    filePath,
                    undefined,
                    new vscode.ThemeIcon('file-code')
                );
            });
        } else {
            // Child level - show URL patterns for the selected urls.py
            const patterns = this.urls[element.path!] || [];
            return patterns.map(pattern => {
                return new UrlItem(
                    pattern,
                    vscode.TreeItemCollapsibleState.None,
                    undefined,
                    {
                        command: 'djangourlhelper.openUrl',
                        title: 'Open URL',
                        arguments: [pattern]
                    },
                    new vscode.ThemeIcon('link')
                );
            });
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Django URL Helper is now active!');

    const urlProvider = new DjangoUrlProvider();
    
    // Register the tree data provider
    const treeView = vscode.window.createTreeView('djangoUrlExplorer', {
        treeDataProvider: urlProvider,
        showCollapseAll: true
    });
    
    // Register commands
    const disposable = vscode.commands.registerCommand('djangourlhelper.refresh', () => {
        urlProvider.updateUrls();
    });
    
    const openUrlCommand = vscode.commands.registerCommand('djangourlhelper.openUrl', (url: string) => {
        vscode.window.showInformationMessage(`Opening URL: ${url}`);
        // Add your URL opening logic here
    });
    
    // Initial update
    urlProvider.updateUrls();
    
    // Watch for changes in urls.py files
    const watcher = vscode.workspace.createFileSystemWatcher('**/urls.py');
    watcher.onDidChange(() => urlProvider.updateUrls());
    watcher.onDidCreate(() => urlProvider.updateUrls());
    watcher.onDidDelete(() => urlProvider.updateUrls());
    
    // Register disposables
    context.subscriptions.push(
        treeView,
        disposable,
        openUrlCommand,
        watcher,
        vscode.window.registerTreeDataProvider('djangoUrlExplorer', urlProvider)
    );
}

export function deactivate() {}
