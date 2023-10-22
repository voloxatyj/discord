import { Member, Profile, Server } from '@prisma/client';

export type TServerWithMembersWithProfiles = Server & { members: (Member & { profile: Profile })[]; 
};

export type TModalType =
	| "createServer"
	| "invite"
	| "editServer"
	| "members"
	| "createChannel"
	| "leaveServer"
	| "deleteServer"
	| "deleteChannel"
	| "editChannel";