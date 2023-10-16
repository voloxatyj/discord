"use client";

import { FC } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface INavigationItemProps {
	id: string;
	imageUrl: string;
	name: string;
}

export const NavigationItem: FC<INavigationItemProps> = ({
	id,
	imageUrl,
	name,
}) => {
	const { serverId } = useParams();
	const router = useRouter();

	const handleClickChannel = () => {
		router.push(`/servers/${id}`);
	};

	return (
		<ActionTooltip side="right" align="center" label={name}>
			<button
				onClick={handleClickChannel}
				className="group relative flex items-center"
			>
				<div
					className={cn(
						"absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
						serverId !== id && "group-hover:h-[20px]",
						serverId === id ? "h-[36px]" : "h-[8px]",
					)}
				/>
				<div
					className={cn(
						"relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
						serverId === id && "bg-primary/10 text-primary rounded-[16px]",
					)}
				>
					<Image fill src={imageUrl} alt="Channel" />
				</div>
			</button>
		</ActionTooltip>
	);
};
