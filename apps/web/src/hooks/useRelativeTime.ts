import { useState, useEffect } from "react";

type TimestampInput = string | number | Date;

function parseDate(input: TimestampInput): Date {
  return input instanceof Date ? input : new Date(input);
}

function getShortRelativeTime(input: TimestampInput, now = new Date()): string {
  const date = parseDate(input);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}d ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}mo ago`;
  }

  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

function getUpdateInterval(input: TimestampInput): number {
  const date = parseDate(input);
  const diffInSeconds = Math.abs(
    (new Date().getTime() - date.getTime()) / 1000,
  );

  if (diffInSeconds < 60) return 10000; // Update every 10s for < 1m
  if (diffInSeconds < 3600) return 60000; // Update every 1m for < 1h
  return 3600000; // Update every 1h for older items
}

export function useRelativeTime(timestamp: TimestampInput): string {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalTime = getUpdateInterval(timestamp);
    const timer = setInterval(() => {
      setNow(new Date());
    }, intervalTime);

    return () => clearInterval(timer);
  }, [timestamp]);

  return getShortRelativeTime(timestamp, now);
}
