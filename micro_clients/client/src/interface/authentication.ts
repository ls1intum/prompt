export enum Permission {
  PM = 'ipraktikum-pm',
  TUTOR = 'ipraktikum-tutor',
  COACH = 'ipraktikum-coach',
  PL = 'ipraktikum-pl',
  CHAIR_MEMBER = 'chair-member',
}

export interface User {
  firstName: string
  lastName: string
  email: string
  username: string
  mgmtAccess: boolean
}
