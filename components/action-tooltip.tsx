"use client";

import { FC } from "react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface IActionTooltipProps {
	label: string;
	children: React.ReactNode;
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
}

export const ActionTooltip: FC<IActionTooltipProps> = ({
	label,
	children,
	side,
	align,
}) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent side={side} align={align}>
					<p className="font-semibold text-sm capitalize">
						{label.toLowerCase()}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
