import { Member, Profile, Server } from '@prisma/client';

export type TServerWithMembersWithProfiles = Server & { members: (Member & { profile: Profile })[]; 
};