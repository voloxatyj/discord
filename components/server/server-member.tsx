"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";

import { Member, Profile, Server } from "@prisma/client";

import { useParams, useRouter } from "next/navigation";

import { roleIconMap } from "@/components/constant-icons";
import { UserAvatar } from "../user-avatar";

interface IServerMemberProps {
	member: Member & { profile: Profile };
	server: Server;
}

export const ServerMember: FC<IServerMemberProps> = ({ member, server }) => {
	const params = useParams();
	const router = useRouter();

	const icon = roleIconMap[member.role];

	return (
		<button
			className={cn(
				"group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
				params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700",
			)}
		>
			<UserAvatar
				src={member.profile.imageUrl}
				className="h-8 w-8 md:h-8 md:w-8"
			/>
			<p
				className={cn(
					"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
					params?.channelId === member.id &&
						"text-primary dark:text-zinc-200 dark:group-hover:text-white",
				)}
			>
				{member.profile.name}
			</p>
			{icon}
		</button>
	);
};
