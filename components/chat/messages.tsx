"use client";

import { FC, Fragment } from "react";
import { useChatQuery } from "@/hooks/chat-query";
import { format } from "date-fns";

import { Member, Message, Profile } from "@prisma/client";

import { ChatWelcome } from "@/components/chat/welcome";
import { ChatItem } from "@/components/chat/item";

import { Loader2, ServerCrash } from "lucide-react";

type TMessageWithMemberWithProfile = Message & {
	member: Member & {
		profile: Profile;
	};
};

interface IChatMessagesProps {
	name: string;
	member: Member;
	chatId: string;
	apiUrl: string;
	socketUrl: string;
	socketQuery: Record<string, any>;
	paramKey: "channelId" | "conversationId";
	paramValue: string;
	type: "channel" | "conversation";
}

export const ChatMessages: FC<IChatMessagesProps> = ({
	name,
	member,
	chatId,
	apiUrl,
	socketQuery,
	socketUrl,
	paramKey,
	paramValue,
	type,
}) => {
	const queryKey = `chat:${chatId}`;

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useChatQuery({
			queryKey,
			apiUrl,
			paramKey,
			paramValue,
		});

	if (status === "loading") {
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					Hold your horses we are loading messages...
				</p>
			</div>
		);
	}

	if (status === "error") {
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					Houston we got a problem!
				</p>
			</div>
		);
	}
	return (
		<div className="flex-1 flex flex-col py-4 overflow-y-auto">
			<div className="flex-1" />
			<ChatWelcome type={type} name={name} />
			<div className="flex flex-col-reverse mt-auto">
				{data?.pages?.map((group, i) => (
					<Fragment key={i}>
						{group.items.map(
							({
								id,
								content,
								fileUrl,
								deleted,
								createdAt,
								updatedAt,
								member,
							}: TMessageWithMemberWithProfile) => (
								<ChatItem
									key={id}
									id={id}
									currentMember={member}
									member={member}
									content={content}
									fileUrl={fileUrl}
									deleted={deleted}
									timestamp={format(new Date(createdAt), "d MMM yyyy, HH:mm")}
									isUpdated={updatedAt !== createdAt}
									socketUrl={socketUrl}
									socketQuery={socketQuery}
								/>
							),
						)}
					</Fragment>
				))}
			</div>
		</div>
	);
};
