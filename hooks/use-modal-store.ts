import { create } from "zustand";

import { Server, ChannelType, Channel } from "@prisma/client";

export type TModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel" | "editChannel";

interface IModalData {
	server?: Server;
	channel?: Channel;
	channelType?: ChannelType;
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