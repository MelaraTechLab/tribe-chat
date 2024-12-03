export type Participant = {
    uuid: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
    jobTitle?: string;
    email?: string;
  };
  
  export type Message = {
    uuid: string;
    sentAt: number;
    text: string;
    authorUuid: string;
    reactions?: Reaction[];
    attachments?: string[];
  };
  
  export type Reaction = {
    uuid: string;
    value: string;
    participantUuid: string;
  };
  