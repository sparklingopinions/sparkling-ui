// Sample records for the collection stories (Table, List, Board).
export interface Person {
  id: number
  name: string
  email: string
  company: string
  stage: 'lead' | 'contacted' | 'customer'
  lastContact: string
}

const names = [
  ['Ada Lovelace', 'Analytical Engines'],
  ['Grace Hopper', 'Navy Labs'],
  ['Alan Turing', 'Bletchley'],
  ['Katherine Johnson', 'Langley'],
  ['Linus Torvalds', 'Kernel Co'],
  ['Margaret Hamilton', 'Apollo Software'],
  ['Tim Berners-Lee', 'CERN'],
  ['Hedy Lamarr', 'Frequency Hopping'],
  ['Dennis Ritchie', 'Bell Labs'],
  ['Barbara Liskov', 'CLU Systems']
]
const stages = ['lead', 'contacted', 'customer'] as const

export const people: Person[] = names.map(([name, company], i) => ({
  id: i + 1,
  name,
  email: `${name.split(' ')[0].toLowerCase()}@${company.split(' ')[0].toLowerCase()}.com`,
  company,
  stage: stages[i % 3],
  lastContact: `Oct ${18 - i}`
}))

export const stageLabels = { lead: 'Lead', contacted: 'Contacted', customer: 'Customer' }
export const stageTones = { lead: 'neutral', contacted: 'warning', customer: 'success' } as const
