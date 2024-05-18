import { RunService, UserInputService } from "@rbxts/services";
import { Debugger, Loop, World, System } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";
import { Context, HotReloader } from "@rbxts/rewire";
import { Renderable } from "./components";
import { ClientState } from "./clientState";

export function start<S>(containers: Array<Instance>, state: S) {
	const world = new World();

	type T = [World, S, Plasma.Widgets];

	const myDebugger = new Debugger<T>(Plasma);
	myDebugger.findInstanceFromEntity = (id): Model | undefined => {
		if (!world.contains(id)) return;

		const model = world.get(id, Renderable);

		return model ? model.model : undefined;
	};

	const loop = new Loop(world, state, myDebugger.getWidgets());
	const hotReloader = new HotReloader();

	let firstRunSystems = new Array<System<T>>();
	const systemsByModule = new Map<ModuleScript, System<T>>();

	function loadModules(module: ModuleScript, context: Context) {
		const orignalModule = context.originalModule;
		const [ok, system] = pcall(require, module) as LuaTuple<[boolean, System<T>]>;

		if (!ok) {
			warn("Error when hot-reloading system", module.Name, system);
			return;
		}

		if (firstRunSystems) {
			firstRunSystems.push(system);
		} else if (systemsByModule.has(orignalModule)) {
			loop.replaceSystem(systemsByModule.get(orignalModule)!, system);
			myDebugger.replaceSystem(systemsByModule.get(orignalModule)!, system);
		} else {
			loop.scheduleSystem(system);
		}
	}

	function unloadModules(module: ModuleScript, context: Context) {
		if (context.isReloading) return;

		const originalModule = context.originalModule;
		if (systemsByModule.has(originalModule)) {
			loop.evictSystem(systemsByModule.get(originalModule)!);
			systemsByModule.delete(originalModule);
		}
	}

	containers.forEach((container) => hotReloader.scan(container, loadModules, unloadModules));

	loop.scheduleSystems(firstRunSystems);
	firstRunSystems = undefined!;

	myDebugger.autoInitialize(loop);

	loop.begin({
		default: RunService.Heartbeat,
		Stepped: RunService.Stepped,
	});

	if (RunService.IsClient()) {
		UserInputService.InputBegan.Connect((input) => {
			(state as ClientState).debugEnabled = myDebugger.enabled;

			if (input.KeyCode === Enum.KeyCode.F4) {
				myDebugger.toggle();

				(state as ClientState).debugEnabled = myDebugger.enabled;
			}
		});
	}

	return $tuple(world, state);
}
