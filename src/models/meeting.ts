import { MeetingRecord } from '../types/meeting';

export class Meeting implements MeetingRecord {
  meetingId: string;
  contactUrl: string;
  connectionType: string;
  dateTime: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: Omit<MeetingRecord, 'createdAt' | 'updatedAt'>) {
    this.meetingId = data.meetingId;
    this.contactUrl = data.contactUrl;
    this.connectionType = data.connectionType;
    this.dateTime = data.dateTime;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static fromDialogflowParams(params: {
    any: string;
    connectiontype: string;
    meeting_time: string;
    meetingId: string;
  }): Meeting {
    return new Meeting({
      meetingId: params.meetingId,
      contactUrl: params.any,
      connectionType: params.connectiontype,
      dateTime: params.meeting_time
    });
  }
}