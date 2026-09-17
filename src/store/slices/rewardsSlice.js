import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  coins: 0,
  totalEarned: 0,
  totalSpent: 0,
  todayClaimed: false,
  lastClaimDate: null,
};

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    hydrateRewards: (s, a) => ({ ...s, ...a.payload }),
    addCoins: (s, a) => {
      const amt = a.payload || 0;
      s.coins += amt;
      s.totalEarned += amt;
    },
    spendCoins: (s, a) => {
      const amt = a.payload || 0;
      if (s.coins >= amt) {
        s.coins -= amt;
        s.totalSpent += amt;
        return true;
      }
      return false;
    },
    claimDaily: (s) => {
      const today = new Date().toISOString().slice(0, 10);
      if (s.lastClaimDate === today) return;
      const reward = 50;
      s.coins += reward;
      s.totalEarned += reward;
      s.todayClaimed = true;
      s.lastClaimDate = today;
    },
    resetDailyClaim: (s) => {
      const today = new Date().toISOString().slice(0, 10);
      if (s.lastClaimDate !== today) s.todayClaimed = false;
    },
    resetRewards: () => initialState,
  },
});

export const { hydrateRewards, addCoins, spendCoins, claimDaily, resetDailyClaim, resetRewards } =
  rewardsSlice.actions;
export default rewardsSlice.reducer;
