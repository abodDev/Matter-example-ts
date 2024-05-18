import { World } from "@rbxts/matter";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { Renderable, Roomba, Transform } from "shared/components";

function spawnRoomba(world: World): void {
	for (const [id] of world.query(Roomba, Transform).without(Renderable)) {
		const model = ReplicatedStorage.Assets.KillerRoomba.Clone();
		model.Parent = Workspace;

		world.insert(id, Renderable({ model }));
	}
}

export = {
	system: spawnRoomba,
};
