import { FC } from "react";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile";
import { Server } from "@prisma/client";

import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationAction } from "@/components/navigation/action";
import { NavigationItem } from "@/components/navigation/item";
import { ModeToggle } from "@/components/mode-toggle";

export const NavigationSidebar: FC = async () => {
	const profile = await currentProfile();

	if (!profile) return redirect("/");
	const profileId = profile.id;

	const servers = await db.server.findMany({
		where: {
			members: {
				some: {
					profileId,
				},
			},
		},
	});
	return (
		<div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1f22] bg-[#E3E5E8] py-3">
			<NavigationAction />
			<Separator className="h-[2px] bg-zinc -300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
			<ScrollArea className="flex-1 w-full">
				{servers &&
					servers.map(({ id, name, imageUrl }: Server) => (
						<div key={id} className="mb-4">
							<NavigationItem id={id} name={name} imageUrl={imageUrl} />
						</div>
					))}
			</ScrollArea>
			<div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
				<ModeToggle />
				<UserButton
					afterSignOutUrl="/"
					appearance={{
						elements: {
							avatarBox: "h-[48px] w-[48px]",
						},
					}}
				/>
			</div>
		</div>
	);
};
