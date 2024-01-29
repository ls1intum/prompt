export enum Permission {
  PM = 'ipraktikum-pm',
  TUTOR = 'ipraktikum-tutor',
}

export interface User {
  firstName: string
  lastName: string
  email: string
  username: string
  mgmtAccess: boolean
}
