"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BottomNav, TopBar } from "@/components/nav";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  points: number;
}

interface Track {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export default function LearnPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/lessons").then((r) => r.json()).then(setTracks);
  }, []);

  if (!session) return null;

  return (
    <div className="min-h-screen pb-24">
      <TopBar title="学習トラック" />

      <div className="max-w-lg mx-auto px-4 py-6">
        <p className="text-gray-500 text-sm mb-6">
          レッスンを完了してポイントを獲得しよう。各レッスンの最後にクイズがあります。
        </p>

        <div className="space-y-6">
          {tracks.map((track) => (
            <div key={track.id} className="card overflow-hidden">
              <div
                className="px-5 py-4 flex items-center gap-3"
                style={{ backgroundColor: track.color + "15" }}
              >
                <span className="text-3xl">{track.icon}</span>
                <div>
                  <h2 className="font-bold text-gray-900">{track.title}</h2>
                  <p className="text-gray-500 text-xs">{track.description}</p>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {track.lessons.map((lesson, idx) => (
                  <Link
                    key={lesson.id}
                    href={`/learn/${lesson.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ backgroundColor: track.color }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{lesson.title}</p>
                      <p className="text-gray-500 text-xs truncate">{lesson.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-blue-600 font-bold text-xs">+{lesson.points}pt</p>
                      <p className="text-gray-400 text-xs">{lesson.duration}分</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
