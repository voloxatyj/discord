import { FC } from "react";
import { redirect } from "next/navigation";
import { ChannelType, Profile } from "@prisma/client";

import { currentProfile } from "@/lib/profile";
import { db } from "@/lib/db";

import { ServerHeader } from "@/components/server/server-header";

interface IServerSidebarProps {
	serverId: string;
}

export const ServerSidebar: FC<IServerSidebarProps> = async ({ serverId }) => {
	const profile: Profile | null = await currentProfile();

	if (!profile) return redirect("/");

	const server = await db.server.findUnique({
		where: {
			id: serverId,
		},
		include: {
			channels: {
				orderBy: {
					createdAt: "asc",
				},
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: "asc",
				},
			},
		},
	});

	const textChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.TEXT,
	);
	const audioChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.AUDIO,
	);
	const videoChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.VIDEO,
	);
	const members = server?.members.filter(
		(member) => member.profileId !== profile.id,
	);

	if (!server) return redirect("/");

	const role = server?.members.find(
		(member) => member.profileId === profile.id,
	)?.role;

	return (
		<div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
			<ServerHeader server={server} role={role} />
		</div>
	);
};
