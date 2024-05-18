import { World, useEvent } from "@rbxts/matter";
import { Renderable } from "shared/components";

function removeMissingModels(world: World) {
	for (const [id, model] of world.query(Renderable)) {
		for (const _ of useEvent(model.model, "AncestryChanged")) {
			if (!model.model.IsDescendantOf(game)) {
				world.remove(id, Renderable);
				break;
			}
		}
		if (!model.model.PrimaryPart) {
			world.remove(id, Renderable);
		}
	}

	for (const [_id, modelRecord] of world.queryChanged(Renderable)) {
		if (modelRecord.new === undefined) {
			if (modelRecord.old && modelRecord.old.model) {
				modelRecord.old.model.Destroy();
			}
		}
	}
}

export = {
	system: removeMissingModels,
};
