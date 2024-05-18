import { World, useEvent } from "@rbxts/matter";
import { AnyComponent, ComponentCtor } from "@rbxts/matter/lib/component";
import { Players } from "@rbxts/services";
import { Charge, Health, Mothership, Renderable, Roomba, Spinner, Target } from "shared/components";
import { ComponentNames } from "../../../types/serde";
import server from "../../../.zap/server";

const REPLICATED_COMPONENTS = new Set<ComponentCtor>([Renderable, Roomba, Health, Target, Mothership, Spinner, Charge]);

function replication(world: World): void {
	for (const [, player] of useEvent(Players, "PlayerAdded")) {
		const payload = new Map<string, Map<ComponentNames, { data: AnyComponent }>>();

		for (const [id, entityData] of world) {
			const entityPayload = new Map<ComponentNames, { data: AnyComponent }>();
			payload.set(tostring(id), entityPayload);

			for (const [component, componentInstance] of entityData) {
				if (REPLICATED_COMPONENTS.has(component)) {
					entityPayload.set(tostring(component) as ComponentNames, { data: componentInstance });
				}
			}
		}

		server.replication.Fire(player, { changes: payload });
	}

	const changes = new Map<string, Map<ComponentNames, { data: AnyComponent }>>();

	for (const component of REPLICATED_COMPONENTS) {
		for (const [entityId, record] of world.queryChanged(component)) {
			const key = tostring(entityId);
			const name = tostring(component) as ComponentNames;

			if (!changes.has(key)) {
				changes.set(key, new Map());
			}

			if (world.contains(entityId)) {
				changes.get(key)?.set(name, { data: record.new! });
			}
		}
	}

	if (!changes.isEmpty()) {
		server.replication.FireAll({ changes });
	}
}

export = {
	system: replication,
	priority: math.huge,
};
