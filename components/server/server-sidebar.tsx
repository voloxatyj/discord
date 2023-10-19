import { FC } from "react";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { redirect } from "next/navigation";
import { ChannelType, MemberRole, Profile } from "@prisma/client";

import { currentProfile } from "@/lib/profile";
import { db } from "@/lib/db";

import { ServerHeader } from "@/components/server/server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "@/components/server/server-search";

interface IServerSidebarProps {
	serverId: string;
}

const iconMap = {
	[ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
	[ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
	[ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
	),
	[MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

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
			<ScrollArea className="flex-1 px-3">
				<div className="mt-2">
					<ServerSearch
						data={[
							{
								label: "Text Channels",
								type: "channel",
								data: textChannels?.map(({ id, name, type }) => ({
									id,
									name,
									icon: iconMap[type],
								})),
							},
							{
								label: "Audio Channels",
								type: "channel",
								data: audioChannels?.map(({ id, name, type }) => ({
									id,
									name,
									icon: iconMap[type],
								})),
							},
							{
								label: "Video Channels",
								type: "channel",
								data: videoChannels?.map(({ id, name, type }) => ({
									id,
									name,
									icon: iconMap[type],
								})),
							},
							{
								label: "Members",
								type: "member",
								data: members?.map(({ id, profile: { name }, role }) => ({
									id,
									name,
									icon: roleIconMap[role],
								})),
							},
						]}
					/>
				</div>
			</ScrollArea>
		</div>
	);
};
