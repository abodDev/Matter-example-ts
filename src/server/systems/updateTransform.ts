import { World } from "@rbxts/matter";
import { Renderable, Transform } from "shared/components";
import removeMissingModels from "./removeMissingModels";

const updateTransforms = (world: World) => {
	// Handle Transform added/changed to existing entity with Model
	for (const [id, transformRecord] of world.queryChanged(Transform)) {
		if (!world.contains(id)) {
			continue;
		}

		const model = world.get(id, Renderable);

		if (!model) {
			continue;
		}

		// eslint-disable-next-line roblox-ts/lua-truthiness
		if (transformRecord.new && !transformRecord.new.doNotReconcile) {
			model.model.PivotTo(transformRecord.new.cf);
		}
	}

	// Handle Model added/changed on existing entity with Transform
	for (const [id, modelRecord] of world.queryChanged(Renderable)) {
		if (!world.contains(id)) {
			continue;
		}

		const transform = world.get(id, Transform);

		if (!transform) {
			continue;
		}

		if (modelRecord.new) {
			modelRecord.new.model.PivotTo(transform.cf);
		}
	}

	// Update Transform on unanchored Models
	for (const [id, renderable, transform] of world.query(Renderable, Transform)) {
		if (!renderable.model.PrimaryPart) continue;

		if (renderable.model.PrimaryPart.Anchored) {
			continue;
		}

		const existingCFrame = transform.cf;
		const currentCFrame = renderable.model.PrimaryPart.CFrame;

		// Despawn models that fall into the void
		if (currentCFrame.Y < -400) {
			world.despawn(id);
			continue;
		}

		if (currentCFrame !== existingCFrame) {
			world.insert(
				id,
				Transform({
					cf: currentCFrame,
					doNotReconcile: true,
				}),
			);
		}
	}
};

export = {
	system: updateTransforms,
	after: [removeMissingModels],
};
