// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "testes" is now active!');
	var wsinfo;
	// parte que pega as descrições e urls do projeto
	// por enquanto só vai funcionar com npm do javascript
	// você que sabe ruby adiciona o esquema do gem do ruby, depois vou adicionar python também
	function getProjectInfo(path) {
		let file = fs.readFileSync(path + '/package.json')
		let data = JSON.parse(file.toString());
		return { description: data.description, homepage: data.homepage }
	}

	function getWorkspaceInfo() {
		let { description, homepage } = getProjectInfo(vscode.workspace.rootPath);
		wsinfo = {
				name: vscode.workspace.name,
				path: vscode.workspace.rootPath,
				description: description,
				homepage: homepage,
		};
	}

	
	vscode.workspace.onDidSaveTextDocument(() => {
		if (wsinfo.name !== vscode.workspace.name) {
			getWorkspaceInfo();
		}		
	});

	/* achei melhor deixar assim porque você pode abrir um arquivo que é de fora do projeto
	sem interferir no estado do objeto. */
	vscode.workspace.onDidOpenTextDocument(() => {
		if (wsinfo === undefined) {
			getWorkspaceInfo();
		} 
	});

	// TODO falta montar alguma coisa pra mandar o `wsinfo` pra fora
	// eu olhei e o node não tem named pipes, então precisa ser de outro jeito
	// mas tá tarde, depois vejo isso. Ou você deve manjar dessas coisas também.
	// Tá faltando só isso pra ele funcionar mesmo.

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ProjectTrackerExtension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from ProjectTracker!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
