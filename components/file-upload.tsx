"use client";

import { FC } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";

interface IFileUploadProps {
	onChange: (url?: string) => void;
	value: string;
	endpoint: "messageFile" | "serverImage";
}

export const FileUpload: FC<IFileUploadProps> = ({
	onChange,
	value,
	endpoint,
}) => {
	const fileType = value?.split(".").pop();
	console.log(fileType);

	if (value && fileType !== ("pdf" || "jpg" || "png" || "jpeg")) {
		return (
			<div className="relative h-20 w-20">
				<Image fill src={value} alt="Upload" className="rounded-full" />
				<button
					onClick={() => onChange("")}
					className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
					type="button"
				>
					<X className="h4 w-4" />
				</button>
			</div>
		);
	}
	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res) => {
				console.log(res);
				onChange(res?.[0].url);
			}}
			onUploadError={(error: Error) => {
				console.log(error);
			}}
		/>
	);
};
