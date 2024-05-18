import * as Components from "shared/components";
import { GenericOfComponent } from "@rbxts/matter";

export type ComponentNames = keyof typeof Components;

export type ComponentsMap = { [K in ComponentNames]: MappedComponentToName<K> };

export type MappedComponentToName<T extends ComponentNames> = GenericOfComponent<ReturnType<(typeof Components)[T]>>;
type UnionComponentsMap = ComponentsMap[ComponentNames];
