import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
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
	| "editChannel"
	| "messageFile";

export type TNextApiResponseServerIO = NextApiResponse & {
	socket: Socket & {
		server: NetServer & {
			io: SocketIOServer;
		};
	};
};