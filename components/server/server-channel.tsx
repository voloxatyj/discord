"use client";

import { FC } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";

import { Channel, MemberRole, Server } from "@prisma/client";
import { TModalType } from "@/types";

import { useParams, useRouter } from "next/navigation";

import { ActionTooltip } from "@/components/action-tooltip";
import { iconMapServerChannel } from "@/components/constant-icons";

import { Edit, Lock, Trash } from "lucide-react";

interface IServerChannelProps {
	channel: Channel;
	server: Server;
	role?: MemberRole;
}

export const ServerChannel: FC<IServerChannelProps> = ({
	channel,
	server,
	role,
}) => {
	const { onOpen } = useModal();
	const router = useRouter();
	const params = useParams();

	const Icon = iconMapServerChannel[channel.type];

	const handleChannelPage = () => {
		router.push(`/servers/${params.serverId}/channels/${channel.id}`);
	};

	const handleButtonAction = (
		e: React.MouseEvent<SVGSVGElement, MouseEvent>,
		action: TModalType,
	) => {
		e.stopPropagation();
		onOpen(action, { channel, server });
	};

	return (
		<button
			onClick={handleChannelPage}
			className={cn(
				"group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
				params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
			)}
		>
			<Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
			<p
				className={cn(
					"line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
					params?.channelId === channel.id &&
						"text-primary dark:text-zinc-200 dark:group-hover:text-white",
				)}
			>
				{channel.name}
			</p>
			{channel.name !== "general" && role !== MemberRole.GUEST && (
				<div className="ml-auto flex items-center gap-x-2">
					<ActionTooltip label="Edit">
						<Edit
							onClick={(e) => handleButtonAction(e, "editChannel")}
							className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
						/>
					</ActionTooltip>
					<ActionTooltip label="Delete">
						<Trash
							onClick={(e) => handleButtonAction(e, "deleteChannel")}
							className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
						/>
					</ActionTooltip>
				</div>
			)}
			{channel.name === "general" && (
				<Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
			)}
		</button>
	);
};
