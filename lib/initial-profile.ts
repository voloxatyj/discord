import { db } from "@/lib/db";
import { currentUser, redirectToSignIn } from '@clerk/nextjs';

export const initialProfile = async () => {
	const user = await currentUser();

	if (!user) {
		return redirectToSignIn();
	}

	const userId = +user.id;

	const profile = await db.profile.findUnique({
		where: {
			userId
		}
	});

	if (profile) {
		return profile;
	}

	const newProfile = await db.profile.create({
		data: {
			userId,
			name: `${user.firstName} ${user.lastName}`,
			imageUrl: user.imageUrl,
			email: user.emailAddresses[0]?.emailAddress
		}
	});

	return newProfile;
}