import { expect } from 'chai';
import {computeGroups} from '../utils';

const MIN_GROUP_SIZE = 3;
const MAX_GROUP_SIZE = 5;

describe('computeGroups', () => {
  it('should compute the groups correctly for size = 0', () => {
    expect(JSON.stringify(computeGroups(0, MIN_GROUP_SIZE, MAX_GROUP_SIZE))).to.equal(
      JSON.stringify([]));
  });
  it('should compute the groups correctly for size = MIN_GROUP_SIZE', () => {
    expect(JSON.stringify(computeGroups(MIN_GROUP_SIZE, MIN_GROUP_SIZE, MAX_GROUP_SIZE))).to.equal(
      JSON.stringify([MIN_GROUP_SIZE]));
  });
  it('should compute the groups correctly for size = MAX_GROUP_SIZE', () => {
    expect(JSON.stringify(computeGroups(MAX_GROUP_SIZE, MIN_GROUP_SIZE, MAX_GROUP_SIZE))).to.equal(
      JSON.stringify([MAX_GROUP_SIZE]));
  });
  it('should compute the groups correctly for size < MIN_GROUP_SIZE', () => {
    expect(JSON.stringify(computeGroups(2, MIN_GROUP_SIZE, MAX_GROUP_SIZE))).to.equal(
      JSON.stringify([2]));
  });
  it('should compute the groups correctly for size = factor of MAX_GROUP_SIZE', () => {
    expect(JSON.stringify(computeGroups(15, MIN_GROUP_SIZE, MAX_GROUP_SIZE))).to.equal(
      JSON.stringify([5,5,5]));
  });
  it('should compute the groups correctly for size = not a factor of MAX_GROUP_SIZE', () => {
    expect(JSON.stringify(computeGroups(26, MIN_GROUP_SIZE, MAX_GROUP_SIZE))).to.equal(
      JSON.stringify([5,5,5,5,3,3]));
  });
});
