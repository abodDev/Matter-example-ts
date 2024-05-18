interface ServerScriptService extends Instance {
	TS: Folder & {
		systems: Folder & {
			[name: string]: ModuleScript;
		};
	};
}

interface StarterPlayer extends Instance {
	StarterPlayerScripts: Folder & {
		TS: Folder & {
			systems: Folder & {
				[name: string]: ModuleScript;
			};
		};
	};
}

interface ReplicatedStorage extends Instance {
	TS: Folder & {
		systems: Folder & {
			[name: string]: ModuleScript;
		};
	};
}
