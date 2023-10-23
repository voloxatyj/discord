"use client";

import { FC, useEffect, useState } from "react";

import { CreateServerModal } from "@/components/modals/create-server";
import { InviteModal } from "@/components/modals/invite";
import { EditServerModal } from "@/components/modals/edit-server";
import { MembersModal } from "@/components/modals/members";
import { CreateChannelModal } from "@/components/modals/create-channel";
import { LeaveServerModal } from "@/components/modals/leave-server";
import { DeleteServerModal } from "@/components/modals/delete-server";
import { DeleteChannelModal } from "@/components/modals/delete-channel";
import { EditChannelModal } from "@/components/modals/edit-channel ";
import { MessageFileModal } from "@/components/modals/message-file";

export const ModalProvider: FC = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			<CreateServerModal />
			<InviteModal />
			<EditServerModal />
			<MembersModal />
			<CreateChannelModal />
			<LeaveServerModal />
			<DeleteServerModal />
			<DeleteChannelModal />
			<EditChannelModal />
			<MessageFileModal />
		</>
	);
};
