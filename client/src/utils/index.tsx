import { Message, MessagesState } from "./types";

export function randomId(): string {
  // Generate a random number and convert it to base 36 (numbers + letters)
  const randomString = Math.random().toString(36).substring(2);
  // Get current timestamp in milliseconds and convert it to base 36
  const timestampString = Date.now().toString(36);
  // Concatenate random string and timestamp string
  const id = randomString + timestampString;
  return id;
}

export const chat1: Message[] = [
  {
    id: "1",
    content: "Hey, how's it going?",
    from: "Alice",
    to: "Bob",
    seen: "message seen"
  },
  {
    id: "2",
    content: "Hey! I'm good, thanks. What about you?",
    from: "Bob",
    to: "Alice",
    seen: "message seen"
  },
  {
    id: "3",
    content: "I'm doing well too, just busy with work.",
    from: "Alice",
    to: "Bob",
    seen: "message seen"
  },
  {
    id: "4",
    content: "Yeah, work has been hectic lately.",
    from: "Bob",
    to: "Alice",
    seen: "message seen"
  },
  {
    id: "5",
    content: "I can imagine. Do you have any plans for the weekend?",
    from: "Alice",
    to: "Bob",
    seen: "message seen"
  },
  {
    id: "6",
    content: "Not really, just hoping to relax. What about you?",
    from: "Bob",
    to: "Alice",
    seen: "message seen"
  },
  {
    id: "7",
    content: "I might go hiking if the weather's nice.",
    from: "Alice",
    to: "Bob",
    seen: "message seen"
  },
  {
    id: "8",
    content: "That sounds fun! Let me know if you need company.",
    from: "Bob",
    to: "Alice",
    seen: "message seen"
  },
  {
    id: "9",
    content: "Sure, will do!",
    from: "Alice",
    to: "Bob",
    seen: "message seen"
  },
  {
    id: "10",
    content: "Great, thanks!",
    from: "Bob",
    to: "Alice",
    seen: "message seen"
  }
];

export const chat2: Message[] = [
  {
    id: "1",
    content: "Are you free tonight?",
    from: "Charlie",
    to: "David",
    seen: "message seen"
  },
  {
    id: "2",
    content: "Yes, why? What's up?",
    from: "David",
    to: "Charlie",
    seen: "message seen"
  },
  {
    id: "3",
    content: "Let's grab dinner together.",
    from: "Charlie",
    to: "David",
    seen: "message seen"
  },
  {
    id: "4",
    content: "Sounds good! Where should we meet?",
    from: "David",
    to: "Charlie",
    seen: "message seen"
  },
  {
    id: "5",
    content: "How about that new Italian place downtown?",
    from: "Charlie",
    to: "David",
    seen: "message seen"
  },
  {
    id: "6",
    content: "Sure, what time?",
    from: "David",
    to: "Charlie",
    seen: "message seen"
  },
  {
    id: "7",
    content: "7:00 PM works for me. Is that fine with you?",
    from: "Charlie",
    to: "David",
    seen: "message seen"
  },
  {
    id: "8",
    content: "Perfect! See you then.",
    from: "David",
    to: "Charlie",
    seen: "message seen"
  },
  {
    id: "9",
    content: "Looking forward to it!",
    from: "Charlie",
    to: "David",
    seen: "message seen"
  },
  {
    id: "10",
    content: "Likewise!",
    from: "David",
    to: "Charlie",
    seen: "message seen"
  }
];

export const chat3: Message[] = [
  {
    id: "1",
    content: "Happy birthday!",
    from: "Emily",
    to: "Frank",
    seen: "message seen"
  },
  {
    id: "2",
    content: "Thank you so much!",
    from: "Frank",
    to: "Emily",
    seen: "message seen"
  },
  {
    id: "3",
    content: "Let's celebrate this weekend!",
    from: "Emily",
    to: "Frank",
    seen: "message seen"
  },
  {
    id: "4",
    content: "Sure! How about a dinner party at my place?",
    from: "Frank",
    to: "Emily",
    seen: "message seen"
  },
  {
    id: "5",
    content: "Sounds like a plan. What should I bring?",
    from: "Emily",
    to: "Frank",
    seen: "message seen"
  },
  {
    id: "6",
    content: "Just yourselves! I'll take care of everything.",
    from: "Frank",
    to: "Emily",
    seen: "message seen"
  },
  {
    id: "7",
    content: "Awesome! Can't wait!",
    from: "Emily",
    to: "Frank",
    seen: "message seen"
  },
  {
    id: "8",
    content: "It's going to be a blast!",
    from: "Frank",
    to: "Emily",
    seen: "message seen"
  },
  {
    id: "9",
    content: "By the way, what's your favorite cake flavor?",
    from: "Emily",
    to: "Frank",
    seen: "message seen"
  },
  {
    id: "10",
    content: "Chocolate, definitely!",
    from: "Frank",
    to: "Emily",
    seen: "message seen"
  }
];

export const arr: MessagesState = {
  'Template_1': chat1,
  'Template_2': chat2,
  'Template_3': chat3,
}

export function formatDate(timestamp: string) {
  const currentDate = new Date();
  const lastSeenDate = new Date(parseInt(timestamp));
  console.log(lastSeenDate);
  console.log(timestamp);
  const timeDifference = currentDate.getTime() - lastSeenDate.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);

  // Define time intervals in seconds
  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (secondsDifference < minute) {
    return 'last seen recently';
  } else if (secondsDifference < hour) {
    const minutes = Math.floor(secondsDifference / minute);
    return `last seen ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (secondsDifference < day) {
    const hours = Math.floor(secondsDifference / hour);
    return `last seen ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (secondsDifference < week) {
    const days = Math.floor(secondsDifference / day);
    return `last seen ${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (secondsDifference < month) {
    const weeks = Math.floor(secondsDifference / week);
    return `last seen ${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (secondsDifference < year) {
    const months = Math.floor(secondsDifference / month);
    return `last seen ${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(secondsDifference / year);
    return `last seen ${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}
