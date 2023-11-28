import { RecordCardProps } from "types";

type RecordData = RecordCardProps;

export const recordData: RecordData[] = Array.from(
  { length: 12 },
  (_, index) => ({
    title: `Recording ${index + 1}`,
    dateTime: new Date(`2023-11-${index + 1}T12:00:00`),
  })
);
