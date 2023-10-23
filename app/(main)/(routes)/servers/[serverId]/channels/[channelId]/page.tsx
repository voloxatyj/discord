import { FC } from "react";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ChatHeader } from "@/components/chat/header";
import { ChatInput } from "@/components/chat/input";
import { ChatMessages } from "@/components/chat/messages";

interface IChannelIdPageProps {
	params: {
		serverId: string;
		channelId: string;
	};
}

const ChannelIdPage: FC<IChannelIdPageProps> = async ({
	params: { channelId, serverId },
}) => {
	const profile = await currentProfile();

	if (!profile) return redirectToSignIn();

	const channel = await db.channel.findUnique({
		where: {
			id: channelId,
		},
	});

	const member = await db.member.findFirst({
		where: {
			serverId,
			profileId: profile.id,
		},
	});

	if (!channel || !member) {
		redirect("/");
	}

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader name={channel.name} serverId={serverId} type="channel" />
			<ChatMessages
				member={member}
				name={channel.name}
				chatId={channel.id}
				type="channel"
				apiUrl="/api/messages"
				socketUrl="/api/socket/messages"
				socketQuery={{
					channelId: channel.id,
					serverId: channel.serverId,
				}}
				paramKey="channelId"
				paramValue={channel.id}
			/>
			<ChatInput
				name={channel.name}
				type="channel"
				apiUrl="/api/socket/messages"
				query={{
					channelId: channel.id,
					serverId: channel.serverId,
				}}
			/>
		</div>
	);
};

export default ChannelIdPage;
