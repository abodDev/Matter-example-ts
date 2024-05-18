import { World, component, useThrottle } from "@rbxts/matter";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { Lasering, Mothership, Renderable, Transform } from "shared/components";

type MothershipModle = Model & {
	Beam: Part;
	Roomba: MeshPart & {
		AlignPosition: BodyPosition;
		Attachment0: Attachment;
		WeldConstraint: WeldConstraint;
	};
};

function spawnMotherShop(world: World) {
	if (useThrottle(10)) {
		const spawnLocation = new Vector3(500, 500, 500).mul(
			new Vector3(math.random(1, 2) === 1 ? 1 : -1, 1, math.random(1, 2) === 1 ? 1 : -1),
		);

		const despawnLocation = new Vector3(500, 500, 500).mul(
			new Vector3(math.random(1, 2) === 1 ? 1 : -1, 1, math.random(1, 2) === 1 ? 1 : -1),
		);

		const goalPosition = new Vector3(math.random(-100, 100), 100, math.random(-100, 100));

		world.spawn(
			Mothership({ goal: goalPosition, nextGoal: despawnLocation }),
			Transform({ cf: new CFrame(spawnLocation) }),
		);
	}

	for (const [id] of world.query(Mothership, Transform).without(Renderable)) {
		const model = ReplicatedStorage.Assets.Mothership.Clone();
		model.Parent = Workspace;
		model.PrimaryPart?.SetNetworkOwner(undefined);

		world.insert(id, Renderable({ model: model }));
	}

	for (const [id, transform, mothership] of world.query(Transform, Mothership).without(Lasering)) {
		const distance = transform.cf.Position.sub(mothership.goal).Magnitude;
		if (distance < 10) {
			if (mothership.lasered) {
				world.despawn(id);
			} else {
				world.insert(
					id,
					Lasering({ remainingTime: 1 }),
					mothership.patch({ goal: mothership.nextGoal, lasered: true }),
				);
			}
		}
	}

	for (const [, mothership, renderable] of world.query(Mothership, Renderable).without(Lasering)) {
		const model = renderable.model as MothershipModle;
		model.Roomba.AlignPosition.Position = mothership.goal;
	}
}

export = {
	system: spawnMotherShop,
};
