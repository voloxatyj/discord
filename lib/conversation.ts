import { db } from '@/lib/db';

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
	let conversation =
		(await findConversaion(memberOneId, memberTwoId)) ||
		(await findConversaion(memberTwoId, memberOneId));
	
	if (!conversation) {
		conversation = await createConversation(memberOneId, memberTwoId);
	}

	return conversation;
}

const findConversaion = async (memberOneId: string, memberTwoId: string) => {
	try {
		return await db.conversation.findFirst({
			where: {
				AND: [{ memberOneId }, { memberTwoId }],
			},
			include: {
				memberOne: {
					include: {
						profile: true,
					},
				},
				memberTwo: {
					include: {
						profile: true,
					},
				},
			},
		});
	} catch (error) {
		return null;	
	}
}

const createConversation = async ( memberOneId: string, memberTwoId: string ) => {
	try {
		return await db.conversation.create({
			data: {
				memberOneId,
				memberTwoId,
			},
			include: {
				memberOne: {
					include: {
						profile: true,
					},
				},
				memberTwo: {
					include: {
						profile: true,
					},
				},
			},
		});
	} catch (error) {
		return null;
	}
}