import { db } from "@/lib/db";
import { initialProfile } from "@/lib/profile";

import { redirect } from "next/navigation";

import { InitialModal } from "@/components/modals/initial";

const SetupPage = async () => {
	const profile = await initialProfile();
	const profileId = profile.id;

	const server = await db.server.findFirst({
		where: {
			members: {
				some: {
					profileId,
				},
			},
		},
	});

	if (server) {
		return redirect(`/servers/${server.id}`);
	}

	return <InitialModal />;
};

export default SetupPage;
