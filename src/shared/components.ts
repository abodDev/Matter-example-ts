import { component } from "@rbxts/matter";

export const Roomba = component<{}>("Roomba");
export type Roomba = ReturnType<typeof Roomba>;

export const Renderable = component<{ model: Model }>("Renderable");
export type Renderable = ReturnType<typeof Renderable>;

export const Health = component<{}>("Health");
export type Health = ReturnType<typeof Health>;

export const Target = component<{}>("Target");
export type Target = ReturnType<typeof Target>;

export const Transform = component<{ cf: CFrame; doNotReconcile?: boolean }>("Transform");
export type Transform = ReturnType<typeof Transform>;

export const Mothership = component<{ goal: Vector3; nextGoal: Vector3; lasered?: boolean }>("Mothership");
export type Mothership = ReturnType<typeof Mothership>;

export const Lasering = component<{ remainingTime: number; spawned?: boolean }>("Lasering");
export type Lasering = ReturnType<typeof Lasering>;

export const DebugLabel = component<{}>("DebugLabel");
export type DebugLabel = ReturnType<typeof DebugLabel>;

export const Spinner = component<{}>("Spinner");
export type Spinner = ReturnType<typeof Spinner>;

export const Charge = component<{ charge: number }>("Charge");
export type Charge = ReturnType<typeof Charge>;
