import { describe, it, expect } from "vitest";
import { foodTags, moodTags } from "@/data/tags";
import { bakeries } from "@/data/bakeries";

describe("Tags from CSV", () => {
  it("should parse bakeries from CSV", () => {
    expect(bakeries.length).toBeGreaterThan(0);
  });

  it("should have food tags populated", () => {
    expect(foodTags).toBeDefined();
    expect(foodTags.length).toBeGreaterThan(0);
    console.log("Food tags:", foodTags);
  });

  it("should have mood tags populated", () => {
    expect(moodTags).toBeDefined();
    expect(moodTags.length).toBeGreaterThan(0);
    console.log("Mood tags:", moodTags);
  });

  it("should have bakeries with food and mood tags", () => {
    const bakeriesWithTags = bakeries.filter(
      (b) => b.foodTags.length > 0 || b.moodTags.length > 0
    );
    expect(bakeriesWithTags.length).toBeGreaterThan(0);
  });
});
