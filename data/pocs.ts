export type POCRecord = {
  company: string;
  sector: 'E-commerce' | 'BFSI' | 'Retail' | 'FMCG' | 'Healthcare' | 'EdTech' | 'IT Services' | 'FoodTech' | 'Logistics';
  dealSizeINR: number;
  city: string;
  cityRegion: (typeof Regions)[number];
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Pilot' | 'Contract';
  ae: string;
  sentiment: 'At-Risk' | 'Engaged' | 'Progressing';
};

export const Regions = ['All India', 'North', 'South', 'West', 'East', 'Metro Cities'] as const;

export const Views = ['Manager', 'AE'] as const;

export const TimeRanges = ['Today', 'This Week', 'This Month', 'This Quarter'] as const;

export const defaultPOCs: POCRecord[] = [
  {
    company: 'Reliance Retail',
    sector: 'Retail',
    dealSizeINR: 2.5e7,
    city: 'Mumbai',
    cityRegion: 'West',
    stage: 'Pilot',
    ae: 'Anita',
    sentiment: 'Engaged',
  },
  {
    company: 'Tata Digital (Tata Neu)',
    sector: 'Retail',
    dealSizeINR: 1.8e7,
    city: 'Mumbai',
    cityRegion: 'West',
    stage: 'Proposal',
    ae: 'Rahul',
    sentiment: 'Progressing',
  },
  {
    company: 'Flipkart',
    sector: 'E-commerce',
    dealSizeINR: 3.2e7,
    city: 'Bengaluru',
    cityRegion: 'South',
    stage: 'Negotiation',
    ae: 'Isha',
    sentiment: 'Progressing',
  },
  {
    company: 'Bharti Airtel',
    sector: 'IT Services',
    dealSizeINR: 2.1e7,
    city: 'Gurgaon',
    cityRegion: 'North',
    stage: 'Discovery',
    ae: 'Kabir',
    sentiment: 'Engaged',
  },
  {
    company: 'HDFC Bank',
    sector: 'BFSI',
    dealSizeINR: 4.5e7,
    city: 'Mumbai',
    cityRegion: 'West',
    stage: 'Proposal',
    ae: 'Meera',
    sentiment: 'Progressing',
  },
  {
    company: 'ICICI Bank',
    sector: 'BFSI',
    dealSizeINR: 3.8e7,
    city: 'Mumbai',
    cityRegion: 'West',
    stage: 'Negotiation',
    ae: 'Nikhil',
    sentiment: 'Engaged',
  },
  {
    company: 'Infosys',
    sector: 'IT Services',
    dealSizeINR: 1.5e7,
    city: 'Bengaluru',
    cityRegion: 'South',
    stage: 'Proposal',
    ae: 'Anita',
    sentiment: 'Engaged',
  },
  {
    company: 'Wipro',
    sector: 'IT Services',
    dealSizeINR: 1.2e7,
    city: 'Bengaluru',
    cityRegion: 'South',
    stage: 'Discovery',
    ae: 'Rahul',
    sentiment: 'At-Risk',
  },

  {
    company: 'Nykaa',
    sector: 'Retail',
    dealSizeINR: 8.5e6,
    city: 'Mumbai',
    cityRegion: 'West',
    stage: 'Negotiation',
    ae: 'Isha',
    sentiment: 'Progressing',
  },
  {
    company: 'Mamaearth',
    sector: 'FMCG',
    dealSizeINR: 6.5e6,
    city: 'Gurgaon',
    cityRegion: 'North',
    stage: 'Proposal',
    ae: 'Kabir',
    sentiment: 'Engaged',
  },
  {
    company: 'Lenskart',
    sector: 'Retail',
    dealSizeINR: 9.5e6,
    city: 'Faridabad',
    cityRegion: 'North',
    stage: 'Pilot',
    ae: 'Meera',
    sentiment: 'Engaged',
  },
  {
    company: 'Myntra',
    sector: 'E-commerce',
    dealSizeINR: 1.1e7,
    city: 'Bengaluru',
    cityRegion: 'South',
    stage: 'Proposal',
    ae: 'Nikhil',
    sentiment: 'Progressing',
  },
  {
    company: 'Zomato',
    sector: 'FoodTech',
    dealSizeINR: 2.8e7,
    city: 'Gurgaon',
    cityRegion: 'North',
    stage: 'Negotiation',
    ae: 'Anita',
    sentiment: 'Engaged',
  },
  {
    company: 'Swiggy',
    sector: 'FoodTech',
    dealSizeINR: 2.6e7,
    city: 'Bengaluru',
    cityRegion: 'South',
    stage: 'Proposal',
    ae: 'Rahul',
    sentiment: 'Progressing',
  },
  {
    company: 'PharmEasy',
    sector: 'Healthcare',
    dealSizeINR: 7.5e6,
    city: 'Mumbai',
    cityRegion: 'West',
    stage: 'Discovery',
    ae: 'Isha',
    sentiment: 'Engaged',
  },
  {
    company: 'Cars24',
    sector: 'Retail',
    dealSizeINR: 8.8e6,
    city: 'Gurgaon',
    cityRegion: 'North',
    stage: 'Proposal',
    ae: 'Kabir',
    sentiment: 'At-Risk',
  },
];
