import { AnyEntity, World } from "@rbxts/matter";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { Renderable, Spinner, Transform } from "./components";
import { CollectionService } from "@rbxts/services";

const boundTags = new Set([Spinner]);

export function setupTags(world: World): void {
	function spawnBound(model: Model, componet: ComponentCtor) {
		const id = world.spawn(componet(), Renderable({ model }), Transform({ cf: model.GetPivot() }));

		model.SetAttribute("serverEntityId", id);
	}

	for (const component of boundTags) {
		const tagName = tostring(component);

		for (const instance of CollectionService.GetTagged(tagName)) {
			spawnBound(instance as Model, component);
		}

		CollectionService.GetInstanceAddedSignal(tagName).Connect((instance) => {
			spawnBound(instance as Model, component);
		});

		CollectionService.GetInstanceRemovedSignal(tagName).Connect((instance) => {
			const id = instance.GetAttribute("serverEntityId") as AnyEntity;

			if (id !== undefined) world.despawn(id);
		});
	}
}
