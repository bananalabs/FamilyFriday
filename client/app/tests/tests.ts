import { expect } from 'chai';
import {computeGroups} from '../utils';

const MIN_GROUP_SIZE = 3;
const MAX_GROUP_SIZE = 4;

describe('computeGroups', () => {
  it('should compute the groups correctly for size =0', () => {
    expect(computeGroups(0, MIN_GROUP_SIZE, MAX_GROUP_SIZE)).to.equal([]);
  });
});
