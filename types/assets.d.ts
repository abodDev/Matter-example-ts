interface ReplicatedStorage extends Instance {
	Assets: Assets;
}

interface Assets extends Folder {
	KillerRoomba: Model & {
		Knife: MeshPart;
		Roomba: MeshPart & {
			WeldConstraint: WeldConstraint;
			Torque: Torque;
			VectorForce: VectorForce;
			Attachment0: Attachment;
		};
	};
	Mothership: Model & {
		Beam: Part;
		Roomba: MeshPart & {
			AlignPosition: BodyPosition;
			Attachment0: Attachment;
			WeldConstraint: WeldConstraint;
		};
	};
	Battery: Model;
	BillboardGui: BillboardGui & {
		TextLabel: TextLabel;
	};
}
