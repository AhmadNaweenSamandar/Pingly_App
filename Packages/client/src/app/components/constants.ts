// Define the exact shape of a personality object
export type PersonalityType = {
  id: number;
  name: string;
  code: string;
  emoji: string;
  desc: string;
};

export const PERSONALITY_TYPES = [
  { id: 1, name: "Architect", code: "INTJ", emoji: "♟️", desc: "Imaginative and strategic thinkers, with a plan for everything." },
  { id: 2, name: "Logician", code: "INTP", emoji: "🔬", desc: "Innovative inventors with an unquenchable thirst for knowledge." },
  { id: 3, name: "Commander", code: "ENTJ", emoji: "📈", desc: "Bold, imaginative, and strong-willed, always finding a way – or making one." },
  { id: 4, name: "Debater", code: "ENTP", emoji: "🎙️", desc: "Curious and flexible thinkers who cannot resist an intellectual challenge." },
  { id: 5, name: "Advocate", code: "INFJ", emoji: "🕊️", desc: "Quiet visionaries, often serving as inspiring and tireless idealists." },
  { id: 6, name: "Mediator", code: "INFP", emoji: "🌸", desc: "Poetic, kind, and altruistic people, always eager to help a good cause." },
  { id: 7, name: "Protagonist", code: "ENFJ", emoji: "🌟", desc: "Inspiring optimists, readily taking action to do what they feel is right." },
  { id: 8, name: "Campaigner", code: "ENFP", emoji: "🎉", desc: "Enthusiastic, creative, and sociable free spirits, who can always find a reason to smile." },
  { id: 9, name: "Logistician", code: "ISTJ", emoji: "📋", desc: "Practical and fact-minded individuals, whose reliability cannot be doubted." },
  { id: 10, name: "Defender", code: "ISFJ", emoji: "🛡️", desc: "Very dedicated and warm protectors, always ready to defend their loved ones." },
  { id: 11, name: "Executive", code: "ESTJ", emoji: "💼", desc: "Excellent organizers, unsurpassed at managing things – or people." },
  { id: 12, name: "Consul", code: "ESFJ", emoji: "🤝", desc: "Very caring, social, community-minded people who are always eager to help." },
  { id: 13, name: "Virtuoso", code: "ISTP", emoji: "🛠️", desc: "Innovative and practical experimenters, masters of all kinds of tools." },
  { id: 14, name: "Adventurer", code: "ISFP", emoji: "🎨", desc: "Flexible and charming, always ready to explore and experience something new." },
  { id: 15, name: "Entrepreneur", code: "ESTP", emoji: "🚀", desc: "Savvy, energetic, and very perceptive people who truly enjoy living on the edge." },
  { id: 16, name: "Entertainer", code: "ESFP", emoji: "🎭", desc: "Spontaneous, energetic, and enthusiastic people – life is never boring around them." },
];