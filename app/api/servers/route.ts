import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { MemberRole, Profile } from '@prisma/client';

import { db } from '@/lib/db';
import { currentProfile } from '@/lib/profile';

export async function POST(req: Request) {
	try {
		const { name, imageUrl } = await req.json();
		const profile: Profile | null = await currentProfile();

		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const profileId = profile.id;
		const inviteCode = uuidv4(); 

		const server = await db.server.create({
			data: {
				profileId,
				name,
				imageUrl,
				inviteCode,
				channels: {
					create: [{ name: "general", profileId }],
				},
				members: {
					create: [{ profileId, role: MemberRole.ADMIN }],
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log('[SERVERS_POST]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}