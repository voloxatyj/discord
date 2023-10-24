import { useEffect } from "react";

import { Message, Member, Profile } from "@prisma/client";

import { useSocket } from "@/components/providers/socket";
import { useQueryClient } from "@tanstack/react-query";

type TChatSocketProps = {
	addKey: string;
	updateKey: string;
	queryKey: string;
}

type TMessageWithMemberWithProfile = Message & {
	member: Member & {
		profile: Profile;
	}
}

export const useChatSocket = ({ addKey, updateKey, queryKey } : TChatSocketProps) => {
	const { socket } = useSocket();
	const queryClient = useQueryClient();

	useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: TMessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: TMessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            })
          }
        });

        return {
          ...oldData,
          pages: newData,
        }
      })
    });

    socket.on(addKey, (message: TMessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{
              items: [message],
            }]
          }
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [
            message,
            ...newData[0].items,
          ]
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    }
  }, [queryClient, addKey, queryKey, socket, updateKey]);
};