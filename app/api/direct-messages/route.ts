import { db } from '@/lib/db';
import { currentProfile } from "@/lib/profile";
import { DirectMessage } from '@prisma/client';

import { NextResponse } from "next/server";

export async function GET(req: Request) {
	try {
		const profile = await currentProfile();

		if (!profile) return new NextResponse("Profile is missing", { status: 401 });

		const { searchParams } = new URL(req.url);

		const cursor = searchParams.get("cursor");
		const conversationId = searchParams.get("conversationId");

		if (!conversationId)
			return new NextResponse("Conversation ID is missing", { status: 400 });

		let messages: DirectMessage[] = [];
		
		if (cursor) {
			messages = await db.directMessage.findMany({
				take: +(process.env.MESSAGES_BATCH as string),
				skip: 1,
				cursor: {
					id: cursor,
				},
				where: {
					conversationId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		} else {
				messages = await db.directMessage.findMany({
					take: +(process.env.MESSAGES_BATCH as string),
					where: {
						conversationId,
					},
					include: {
						member: {
							include: {
								profile: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				});
			}

			let nextCursor = null;

			if (messages.length === +(process.env.MESSAGES_BATCH as string)) {
				nextCursor = messages[+(process.env.MESSAGES_BATCH as string) - 1].id;
			}
		
			return NextResponse.json({
				items: messages,
				nextCursor
			})
	} catch (error) {
		console.log("[DIRECT_MESSAGES_GET]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}