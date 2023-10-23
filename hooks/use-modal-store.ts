import { create } from "zustand";

import { Server, ChannelType, Channel } from "@prisma/client";
import { TModalType } from '@/types';

interface IModalData {
	server?: Server;
	channel?: Channel;
	channelType?: ChannelType;
	apiUrl?: string;
	query?: Record<string, any>;
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