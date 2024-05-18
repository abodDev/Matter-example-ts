import { World, useEvent } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { Renderable, Target } from "shared/components";

function playersAreTargets(world: World): void {
	for (const player of Players.GetPlayers()) {
		for (const [_, Character] of useEvent(player, "CharacterAdded")) {
			world.spawn(Target(), Renderable({ model: Character }));
		}
	}

	for (const [id] of world.query(Target).without(Renderable)) {
		world.despawn(id);
	}
}

export = {
	system: playersAreTargets,
};
