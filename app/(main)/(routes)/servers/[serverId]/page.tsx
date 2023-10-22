import { FC } from "react";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface IServerIdPageProps {
	params: {
		serverId: string;
	};
}

const ServerIdPage: FC<IServerIdPageProps> = async ({
	params: { serverId },
}) => {
	const profile = await currentProfile();

	if (!profile) return redirectToSignIn();

	const server = await db.server.findUnique({
		where: {
			id: serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
		include: {
			channels: {
				where: {
					name: "general",
				},
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	const initialChannel = server?.channels[0];

	if (initialChannel?.name !== "general") return null;

	return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;
