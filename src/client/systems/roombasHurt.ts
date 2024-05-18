import { World, useEvent } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { ClientState } from "shared/clientState";
import { Renderable, Roomba } from "shared/components";

function roombasHurt(world: World, state: ClientState) {
	for (const [, , renderable] of world.query(Roomba, Renderable)) {
		if (!renderable.model.PrimaryPart) continue;

		for (const [_, part] of useEvent(renderable.model.PrimaryPart, "Touched")) {
			const touchModel = part.FindFirstAncestorWhichIsA("Model");
			if (!touchModel) continue;

			const player = Players.GetPlayerFromCharacter(touchModel);
			if (!player) continue;
			if (player !== Players.LocalPlayer) continue;

			const humanoid = touchModel.FindFirstChildOfClass("Humanoid");
			if (!humanoid) continue;

			humanoid.Health -= 5;
		}
	}
}

export = {
	system: roombasHurt,
};
