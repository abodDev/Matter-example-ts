import { World } from "@rbxts/matter";
import { Charge, Renderable, Roomba, Target } from "shared/components";

type KillerRoomba = Model & {
	Knife: MeshPart;
	Roomba: MeshPart & {
		WeldConstraint: WeldConstraint;
		Torque: Torque;
		VectorForce: VectorForce;
		Attachment0: Attachment;
	};
};

function roombasMove(world: World) {
	const targets = [];
	for (const [id, renderable] of world.query(Renderable, Target)) {
		if (!renderable.model.PrimaryPart) continue;
		targets.push(renderable.model.PrimaryPart.CFrame.Position);
	}

	for (const [, renderable, , charge] of world.query(Renderable, Roomba, Charge)) {
		if (!renderable.model.PrimaryPart) continue;
		if (charge.charge <= 0) continue;

		let closestPosition: Vector3 | undefined,
			closestDistance = 0;
		const currentPosition = renderable.model.PrimaryPart.CFrame.Position;

		targets.forEach((target) => {
			const distance = currentPosition.sub(target).Magnitude;
			if (!closestPosition || distance < closestDistance) {
				closestPosition = target;
				closestDistance = distance;
			}
		});

		if (closestPosition) {
			const model = renderable.model as KillerRoomba;
			let force = model.Roomba.GetMass() * 20;

			if (closestDistance < 4) {
				force = 0;
			}

			const lookVector = model.Roomba.CFrame.LookVector;
			const desiredLookVector = closestPosition.sub(currentPosition).Unit;

			force = force * lookVector.Dot(desiredLookVector);
			model.Roomba.VectorForce.Force = new Vector3(force, 0, 0);

			const absoluteAngle = math.atan2(desiredLookVector.Z, desiredLookVector.X);
			const roombaAngle = math.atan2(lookVector.Z, lookVector.X);

			let angle = math.deg(absoluteAngle - roombaAngle);

			angle = angle % 360;
			angle = (angle + 360) % 360;
			if (angle > 180) {
				angle -= 360;
			}

			const angularVelocity = model.Roomba.AssemblyAngularVelocity;

			const sign = math.sign(angle);
			const motor = math.sqrt(math.abs(angle)) * sign * -1 * 20;
			const friction = angularVelocity.Y * -12;
			const torque = model.Roomba.GetMass() * (motor + friction);

			model.Roomba.Torque.Torque = new Vector3(0, torque, 0);
		}
	}
}

export = {
	system: roombasMove,
};
