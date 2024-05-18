import { AnyComponent, World } from "@rbxts/matter";
import * as Components from "shared/components";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { ReplicatedStorage } from "@rbxts/services";
import { t } from "@rbxts/t";
import { ClientState } from "shared/clientState";
import { ComponentNames, UnionComponentsMap } from "../../types/serde";
import { replication } from "../../.zap/client";

replication.On(() => {});

export function receiveReplication(world: World, state: ClientState): void {
	const entityIdMap = state.entityIdMap;

	replication.On((respone) => {
		const entities = respone.changes as Map<string, Map<ComponentNames, { data?: UnionComponentsMap }>>;
		assert(t.map(t.string, t.table)(entities));

		for (const [serverEntityId, componentMap] of entities) {
			let clientEntityId = entityIdMap.get(serverEntityId);

			if (clientEntityId !== undefined && next(componentMap)[0] === undefined) {
				world.despawn(clientEntityId);
				entityIdMap.delete(serverEntityId);
				continue;
			}

			const componentsToInsert = new Array<AnyComponent>();
			const componentsToRemove = new Array<ComponentCtor>();

			const insertNames = new Array<string>();
			const removeNames = new Array<string>();

			for (const [name, container] of componentMap) {
				// eslint-disable-next-line roblox-ts/lua-truthiness
				if (container.data) {
					componentsToInsert.push(
						Components[name](container.data as UnionToIntersection<UnionComponentsMap>),
					);
					insertNames.push(name);
				} else {
					componentsToRemove.push(Components[name]);
					removeNames.push(name);
				}
			}

			if (clientEntityId === undefined) {
				clientEntityId = world.spawn(...componentsToInsert);

				entityIdMap.set(serverEntityId, clientEntityId);
			} else {
				if (componentsToInsert.size() > 0) {
					world.insert(clientEntityId, ...componentsToInsert);
				}

				if (componentsToRemove.size() > 0) {
					world.remove(clientEntityId, ...componentsToRemove);
				}
			}
		}
	});
}
