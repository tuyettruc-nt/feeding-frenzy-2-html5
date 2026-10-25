import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SPECIES,
  COMBO_TIERS,
  canEat,
  getComboTier,
  calculateFishScore,
  circlesOverlap,
  getGrowthProgress,
  getDistance,
  getHeroForLevel
} from './rules.ts';

test('species contains all 6 characters with 3 stages each', () => {
  assert.equal(SPECIES.length, 6);
  assert.equal(SPECIES[0].name, 'Boris');
  assert.equal(SPECIES[1].name, 'Layla');
  assert.equal(SPECIES[2].name, 'Edie');
  assert.equal(SPECIES[3].name, 'Peter');
  assert.equal(SPECIES[4].name, 'Harry');
  assert.equal(SPECIES[5].name, 'Goliath');

  for (const s of SPECIES) {
    assert.equal(s.stages.length, 3);
    assert.ok(s.stages[0].radius < s.stages[1].radius);
    assert.ok(s.stages[1].radius < s.stages[2].radius);
    assert.ok(s.stages[0].requiredPoints < s.stages[1].requiredPoints);
    assert.ok(s.stages[1].requiredPoints < s.stages[2].requiredPoints);
  }
});

test('eating rules: player can eat smaller fish, cannot eat larger fish', () => {
  const playerRadius = 30;
  // Smaller fish (20px): player can eat
  assert.equal(canEat(playerRadius, 20), true);
  // Equal or larger fish (32px): player cannot eat
  assert.equal(canEat(playerRadius, 32), false);
  // Larger fish (50px): player cannot eat
  assert.equal(canEat(playerRadius, 50), false);
  // Shrunk predator (50px shrunk to 25px): player CAN now eat!
  assert.equal(canEat(playerRadius, 50, true), true);
});

test('combo tiers progression matches frenzy levels', () => {
  assert.equal(getComboTier(0).name, 'Normal');
  assert.equal(getComboTier(4).name, 'Normal');
  assert.equal(getComboTier(5).name, 'Feeding Frenzy!');
  assert.equal(getComboTier(5).multiplier, 2);
  assert.equal(getComboTier(10).name, 'Double Frenzy!');
  assert.equal(getComboTier(10).multiplier, 3);
  assert.equal(getComboTier(16).name, 'Super Frenzy!');
  assert.equal(getComboTier(16).multiplier, 5);
  assert.equal(getComboTier(30).name, 'Super Frenzy!');
});

test('score calculation scales with radius and combo multiplier', () => {
  const score1 = calculateFishScore(20, 1);
  const scoreCombo = calculateFishScore(20, 3);
  assert.equal(scoreCombo, score1 * 3);
  assert.ok(calculateFishScore(40, 1) > calculateFishScore(20, 1));
});

test('circles overlap detection handles collision bounds', () => {
  assert.equal(circlesOverlap(0, 0, 10, 15, 0, 10), true);
  assert.equal(circlesOverlap(0, 0, 10, 50, 0, 10), false);
});

test('growth progress clamps properly', () => {
  assert.equal(getGrowthProgress(0, 500), 0);
  assert.equal(getGrowthProgress(250, 500), 0.5);
  assert.equal(getGrowthProgress(500, 500), 1);
  assert.equal(getGrowthProgress(700, 500), 1);
});

test('getDistance computes accurate Euclidean distance', () => {
  assert.equal(getDistance(0, 0, 3, 4), 5);
});

test('getHeroForLevel maps exactly to the 60-level hero evolution ranges', () => {
  // Boris: 1..8 and 58..60
  for (let l = 1; l <= 8; l++) {
    assert.equal(getHeroForLevel(l).name, 'Boris');
  }
  for (let l = 58; l <= 60; l++) {
    assert.equal(getHeroForLevel(l).name, 'Boris');
  }

  // Layla: 9..16 and 55..57
  for (let l = 9; l <= 16; l++) {
    assert.equal(getHeroForLevel(l).name, 'Layla');
  }
  for (let l = 55; l <= 57; l++) {
    assert.equal(getHeroForLevel(l).name, 'Layla');
  }

  // Edie: 17..21 and 52..54
  for (let l = 17; l <= 21; l++) {
    assert.equal(getHeroForLevel(l).name, 'Edie');
  }
  for (let l = 52; l <= 54; l++) {
    assert.equal(getHeroForLevel(l).name, 'Edie');
  }

  // Peter: 22..29 and 49..51
  for (let l = 22; l <= 29; l++) {
    assert.equal(getHeroForLevel(l).name, 'Peter');
  }
  for (let l = 49; l <= 51; l++) {
    assert.equal(getHeroForLevel(l).name, 'Peter');
  }

  // Harry: 30..37 and 46..48
  for (let l = 30; l <= 37; l++) {
    assert.equal(getHeroForLevel(l).name, 'Harry');
  }
  for (let l = 46; l <= 48; l++) {
    assert.equal(getHeroForLevel(l).name, 'Harry');
  }

  // Goliath: 38..45
  for (let l = 38; l <= 45; l++) {
    assert.equal(getHeroForLevel(l).name, 'Goliath');
  }
});
