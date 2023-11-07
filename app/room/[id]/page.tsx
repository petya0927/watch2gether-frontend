"use client";
import { getRoom } from "@/app/api/rooms";
import { useQuery } from "@tanstack/react-query";
import ReactPlayer from "react-player";
import { init } from "@/app/api/sockets";
import { useEffect } from "react";
import { getUsername } from "@/app/api/user";

export default function Room({ params }: { params: { id: string } }) {
  const { data } = useQuery({
    queryKey: ["room", params.id],
    queryFn: () => getRoom(params.id),
  });

  const username = getUsername() as string;

  useEffect(() => {
    init({ id: params.id, username });
  }, []);

  return (
    data && (
      <div>
        <h1>
          Room {data.room.id} {data.room.owner}
        </h1>
        {/* <ReactPlayer url={data.room.videoUrl} /> */}
      </div>
    )
  );
}
