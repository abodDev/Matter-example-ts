import { receiveReplication } from "./receiveReplication";
import { start } from "../shared/start";
import { ReplicatedStorage, StarterPlayer } from "@rbxts/services";
import { AnyEntity } from "@rbxts/matter";

const [world, state] = start([StarterPlayer.StarterPlayerScripts.TS.systems, ReplicatedStorage.TS.systems], {
	debugEnabled: false,
	entityIdMap: new Map<string, AnyEntity>(),
});

receiveReplication(world, state);
