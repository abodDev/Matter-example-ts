import { ReplicatedStorage, ServerScriptService } from "@rbxts/services";
import { setupTags } from "shared/setupTags";
import { start } from "shared/start";

const [world, state] = start([ServerScriptService.TS.systems, ReplicatedStorage.TS.systems], {});
setupTags(world);
