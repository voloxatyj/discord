import { FC } from "react";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";

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
			<div className="flex-1">Future Messages</div>
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
