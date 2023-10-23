import { FC } from "react";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile";

import { ChannelType, Profile } from "@prisma/client";

import { iconMapServerSidebar, roleIconMap } from "@/components/constant-icons";
import { ServerChannel } from "@/components/server/channel";
import { ServerHeader } from "@/components/server/header";
import { ServerMember } from "@/components/server/member";
import { ServerSearch } from "@/components/server/search";
import { ServerSection } from "@/components/server/section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { redirect } from "next/navigation";

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
									icon: iconMapServerSidebar[type],
								})),
							},
							{
								label: "Audio Channels",
								type: "channel",
								data: audioChannels?.map(({ id, name, type }) => ({
									id,
									name,
									icon: iconMapServerSidebar[type],
								})),
							},
							{
								label: "Video Channels",
								type: "channel",
								data: videoChannels?.map(({ id, name, type }) => ({
									id,
									name,
									icon: iconMapServerSidebar[type],
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
				<Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
				{!!textChannels?.length && (
					<div className="mb-2">
						<ServerSection
							sectionType="channels"
							channelType={ChannelType.TEXT}
							role={role}
							label="Text Channels"
						/>
						<div className="space-y-[2px]">
							{textChannels.map((channel) => (
								<ServerChannel
									key={channel.id}
									channel={channel}
									role={role}
									server={server}
								/>
							))}
						</div>
					</div>
				)}
				{!!audioChannels?.length && (
					<div className="mb-2">
						<ServerSection
							sectionType="channels"
							channelType={ChannelType.AUDIO}
							role={role}
							label="Audio Channels"
						/>
						<div className="space-y-[2px]">
							{audioChannels.map((channel) => (
								<ServerChannel
									key={channel.id}
									channel={channel}
									role={role}
									server={server}
								/>
							))}
						</div>
					</div>
				)}
				{!!videoChannels?.length && (
					<div className="mb-2">
						<ServerSection
							sectionType="channels"
							channelType={ChannelType.VIDEO}
							role={role}
							label="Video Channels"
						/>
						<div className="space-y-[2px]">
							{videoChannels.map((channel) => (
								<ServerChannel
									key={channel.id}
									channel={channel}
									role={role}
									server={server}
								/>
							))}
						</div>
					</div>
				)}
				{!!members?.length && (
					<div className="mb-2">
						<ServerSection
							sectionType="members"
							role={role}
							server={server}
							label="Members"
						/>
						<div className="space-y-[2px]">
							{members.map((member) => (
								<ServerMember key={member.id} member={member} server={server} />
							))}
						</div>
					</div>
				)}
			</ScrollArea>
		</div>
	);
};
