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
        public readonly iconPath?: vscode.ThemeIcon,
        public readonly name?: string,
        public readonly urlPath?: string,
		public readonly subPath?: string
    ) {
        super(label, collapsibleState);
        this.tooltip = this.path || '';
    }
}

class DjangoUrlProvider implements vscode.TreeDataProvider<UrlItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<UrlItem | undefined | null | void> = new vscode.EventEmitter<UrlItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<UrlItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private urls: { [key: string]: { urlPath: string; name: string }[] } = {};
	public urlNameSpace: { [key: string]: string } = {};

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
				const nameSpaceDict = this.parseNameSpace(content);
				Object.assign(this.urlNameSpace, nameSpaceDict);
                if (urlPatterns.length > 0) {
                    this.urls[file.fsPath] = urlPatterns;
                }
            } catch (error) {
                console.error(`Error reading ${file.fsPath}:`, error);
            }
        }
        this.refresh();
    }

	private parseNameSpace(content: string){
		const includeRegex = /include\s*\(\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"][^'"]+['"]\s*\)\s*,\s*namespace\s*=\s*['"]([^'"]+)['"]\s*\)/g;
		const nameSpaceDict: { [key: string]: string } = {};
		let nameSpaceMatch;
		while ((nameSpaceMatch = includeRegex.exec(content)) !== null) {
			const urlFilename = nameSpaceMatch[1].replace(".", "/");
			const namespace = nameSpaceMatch[2] || '';
			nameSpaceDict[urlFilename] = namespace;
		}
		return nameSpaceDict;
	}

    private parseUrlPatterns(content: string): { urlPath: string; name: string }[] {
        const urlPatterns: { urlPath: string; name: string }[] = [];
        const pathRegex = /path\s*\(\s*['"]([^'"]+)['"]\s*,\s*[^,()]+(?:,\s*name\s*=\s*['"]([^'"]+)['"])?\s*\)/g;
		let pathMatch;
		while ((pathMatch = pathRegex.exec(content)) !== null) {
			const urlPath = pathMatch[1];
			const name = pathMatch[2] || '';
			urlPatterns.push({"urlPath": urlPath, "name": name});
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
			const parts = element.path!.split("\\");
			const subPath = parts.slice(-2).join("\\").replace("\\", "/").replace(".py", "");

            return patterns.map(pattern => {
				const name = pattern['name'];
				const urlPath = pattern['urlPath'];
				
                return new UrlItem(
                    pattern['urlPath'] + "[" + pattern['name'] + "]",
                    vscode.TreeItemCollapsibleState.None,
                    undefined,
                    {
                        command: 'djangourlhelper.copyUrl',
                        title: 'Open URL',
                        arguments: [subPath, pattern]
                    },
                    new vscode.ThemeIcon('link'),
					pattern['name'],
					pattern['urlPath'],
					subPath
                );
            });
        }
    }

	quickInsertUrl(){

	}
}



function fetchUrlSnipplet(filePath: string, element: {"urlPath": string; "name": string}, urlNameSpace: { [key: string]: string }){
	let urlSnipplet = "";
	if (filePath in urlNameSpace) {
		urlSnipplet =  `const url_${element.name} = "{% url '${urlNameSpace[filePath]}:${element.name}'%}"`;
	}else{
		urlSnipplet =  `const url_${element.name} = "${element.name}"`;
	}
	return urlSnipplet;
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
    
    const openUrlCommand = vscode.commands.registerCommand('djangourlhelper.copyUrl', (filePath: string, element: {"urlPath": string; "name": string}) => {
        const urlSnipplet = fetchUrlSnipplet(filePath, element, urlProvider.urlNameSpace);
		// copy urlSnipplet to clipboard
        vscode.env.clipboard.writeText(urlSnipplet);
        vscode.window.showInformationMessage("URL snippet copied to clipboard.");


    });
    
    // Initial update
    urlProvider.updateUrls();
    
    // Watch for changes in urls.py files
    const watcher = vscode.workspace.createFileSystemWatcher('**/urls.py');
    watcher.onDidChange(() => urlProvider.updateUrls());
    
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
