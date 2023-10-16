import { create } from 'zustand';

export type TModalType = 'createServer';

interface IModalStore {
	type: TModalType | null;
	isOpen: boolean;
	onOpen: (type: TModalType) => void;
	onClose: () => void;
}

export const useModal = create<IModalStore>((set) => ({
	type: null,
	isOpen: false,
	onOpen: (type) => set({ isOpen: true, type }),
	onClose: () => set({ type: null, isOpen: false }),
}));