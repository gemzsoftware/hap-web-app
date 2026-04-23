export const mockDashboardData = {
  user: {
    name: 'Adekunle Jacobs',
    email: 'adekunle.j@example.com',
    avatar: '/user-avatar.png',
  },
  stats: {
    totalProperties: 3,
    propertyChange: '+1 this year',
    portfolioValue: '49,250,000',
    valueChange: '+15.2% vs last year',
    documents: 5,
    docsChange: '2 new uploads',
    overduePayments: 0,
    paymentChange: 'All payments up to date',
  },
  properties: [
    {
      id: 1,
      image: '/land-epe.jpg',
      title: 'Prime Residential Plot',
      location: 'Epe, Lagos',
      status: 'Fully Paid',
    },
    {
      id: 2,
      image: '/land-ibeju.jpg',
      title: 'Fenced Commercial Land',
      location: 'Ibeju-Lekki, Lagos',
      status: 'Payment Plan',
    },
    {
      id: 3,
      image: '/land-mowe.jpg',
      title: 'Affordable Estate Plot',
      location: 'Mowe, Ogun State',
      status: 'Fully Paid',
    },
  ],
  documents: [
    { id: 1, name: 'Deed of Assignment - Epe.pdf', size: '2.5MB' },
    { id: 2, name: 'Survey Plan - Ibeju.pdf', size: '1.8MB' },
    { id: 3, name: 'Contract of Sale.pdf', size: '850KB' },
    { id: 4, name: 'Receipt - Mowe Plot.pdf', size: '400KB' },
  ],
};