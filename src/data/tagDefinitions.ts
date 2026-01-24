// Tag explanations shown in tooltips

export const foodTagDefinitions: Record<string, string> = {
  "Fastelavnsbolle": "Puff pastry or sweet buns filled with custard and/or flavoured cream, plus jam. Seasonal: only available Jan–Feb in Denmark.",
  "For Thought": "As in 'food for thought'. Recommended for music, art, spa, rooftop, views, or other non-food experiences.",
  "New Nordic": "Fancy, modern Scandinavian food with an innovative twist. Often sharing platters and small dishes, relaxed atmosphere.",
  "Danish": "Traditional Danish classics like pork & potatoes. Less fancy than New Nordic, heartier portions.",
  "Smørrebrød": "Open sandwich piled so high with toppings you can't see the bread. Impossible to eat as finger food.",
  "Street Food": "Multiple options sold from carts: burgers, tacos, pasta, etc. Many have creative local twists. Usually standing room only.",
  "Vegetarian": "Specifically recommended for amazing vegetarian/vegan menus. Most other restaurants also have decent veggie options.",
};

export const moodTagDefinitions: Record<string, string> = {
  "Al Fresco": "Eating outside is not only possible but recommended.",
};

export const allTagDefinitions: Record<string, string> = {
  ...foodTagDefinitions,
  ...moodTagDefinitions,
};
