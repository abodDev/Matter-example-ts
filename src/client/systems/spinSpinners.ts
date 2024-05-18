import { World } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";
import slider from "@rbxts/plasma/src/widgets/slider";
import { Renderable, Spinner } from "shared/components";

function spinSpinner(world: World, _: {}, ui: Plasma.Widgets) {
	if (ui.checkbox("Disable Spining").checked()) return;

	ui.label("transparency");
	const transparency = ui.slider({ min: 0, max: 1, initial: 1 });

	ui.label("speed");
	const speed = ui.slider({ min: 0, max: 4, initial: 2 });

	const randomize = ui.button("Randomize").clicked();

	for (const [id, _, renderable] of world.query(Spinner, Renderable)) {
		if (!renderable.model.PrimaryPart) continue;

		renderable.model.PrimaryPart.CFrame = renderable.model.PrimaryPart.CFrame.mul(
			CFrame.Angles(0, math.rad(25) * speed, 0),
		);
		renderable.model.PrimaryPart.Transparency = 1 - transparency;

		if (randomize) {
			renderable.model.PrimaryPart.BrickColor = BrickColor.random();
		}
	}
}

export = {
	system: spinSpinner,
};
