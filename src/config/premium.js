export const PREMIUM = {
  freeLimits: { dailyQuestions: 20, dailyNotes: 5, dailyTests: 1 },
  plans: [
    { id: 'monthly', label: 'Monthly', price: '₹99', period: '/month', popular: false,
      features: ['Unlimited questions', 'All notes', 'All tests', 'No ads'] },
    { id: 'yearly', label: 'Yearly', price: '₹799', period: '/year', popular: true,
      features: ['Everything in Monthly', 'Save 33%', 'Priority support', 'Offline download'] },
  ],
};
