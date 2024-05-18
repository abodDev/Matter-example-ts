import { World, useDeltaTime } from "@rbxts/matter";
import { Charge, Lasering, Mothership, Renderable, Roomba, Transform } from "shared/components";

type MothershipModel = Model & {
	Beam: Part;
	Roomba: MeshPart & {
		AlignPosition: BodyPosition;
		Attachment0: Attachment;
		WeldConstraint: WeldConstraint;
	};
};

function mothershipsSpawnRoombas(world: World) {
	// eslint-disable-next-line prefer-const
	for (let [id, renderable, lasering, transform] of world.query(Renderable, Lasering, Transform, Mothership)) {
		const model = renderable.model as MothershipModel;
		model.Beam.Transparency = 1 - lasering.remainingTime;

		const time = lasering.remainingTime - useDeltaTime();
		lasering = lasering.patch({
			remainingTime: time,
		});

		if (!lasering.spawned) {
			const spawnPosition = new Vector3(transform.cf.Position.X, 11, transform.cf.Position.Z);
			world.spawn(Roomba({}), Transform({ cf: new CFrame(spawnPosition) }), Charge({ charge: 50 }));
			lasering = lasering.patch({ spawned: true });
		}

		if (lasering.remainingTime <= 0) {
			world.remove(id, Lasering);
		} else {
			world.insert(id, lasering);
		}
	}
}

export = {
	system: mothershipsSpawnRoombas,
};
