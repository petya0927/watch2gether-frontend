"use client";
import { getRoom } from "@/app/api/rooms";
import { useQuery } from "@tanstack/react-query";
import ReactPlayer from "react-player";

export default function Room({ params }: { params: { id: string } }) {
  const { data } = useQuery({
    queryKey: ["room", params.id],
    queryFn: () => getRoom(params.id),
  });

  return (
    data && (
      <div>
        <h1>
          Room {data.room.id} {data.room.owner}
        </h1>
        <ReactPlayer url={data.room.videoUrl} />
      </div>
    )
  );
}
