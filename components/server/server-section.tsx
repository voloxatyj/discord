"use client";

import { FC } from "react";
import { useModal } from "@/hooks/use-modal-store";

import { ChannelType, MemberRole } from "@prisma/client";
import { TServerWithMembersWithProfiles } from "@/types";

import { Plus, Settings } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";

interface IServerSectionProps {
	label: string;
	role?: MemberRole;
	sectionType: "channels" | "members";
	channelType?: ChannelType;
	server?: TServerWithMembersWithProfiles;
}

export const ServerSection: FC<IServerSectionProps> = ({
	label,
	role,
	sectionType,
	channelType,
	server,
}) => {
	const { onOpen } = useModal();
	console.log("channelType", channelType);
	return (
		<div className="flex items-center justify-between py-2">
			<p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
				{label}
			</p>
			{role !== MemberRole.GUEST && sectionType == "channels" && (
				<ActionTooltip label="Create Channel" side="top">
					<button
						onClick={() => onOpen("createChannel", { channelType })}
						className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
					>
						<Plus className="h-4 w-4" />
					</button>
				</ActionTooltip>
			)}
			{role !== MemberRole.ADMIN && sectionType == "members" && (
				<ActionTooltip label="Create Channel" side="top">
					<button
						onClick={() => onOpen("members", { server })}
						className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
					>
						<Settings className="h-4 w-4" />
					</button>
				</ActionTooltip>
			)}
		</div>
	);
};
