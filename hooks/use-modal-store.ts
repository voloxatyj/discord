import { create } from "zustand";

import { Server } from "@prisma/client";

export type TModalType = "createServer" | "invite" | "editServer" | "members";

interface IModalData {
	server?: Server
}

interface IModalStore {
	type: TModalType | null;
	data: IModalData;
	isOpen: boolean;
	onOpen: (type: TModalType, data?: IModalData) => void;
	onClose: () => void;
}

export const useModal = create<IModalStore>((set) => ({
	type: null,
	data: {},
	isOpen: false,
	onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
	onClose: () => set({ type: null, isOpen: false }),
}));