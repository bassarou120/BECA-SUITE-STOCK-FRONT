export interface apiResultFormat {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Array<any>;
  totalData: number;
}

export interface SideBar {
  showMyTab?: boolean;
  tittle: string;
  icon: string;
  showAsTab: boolean;
  separateRoute: boolean;
  materialicons?: string;
  menu: SideBarMenu[];
}

export interface SideBarMenu {
  showMyTab?: boolean;
  menuValue: string;
  route?: string;
  hasSubRoute: boolean;
  showSubRoute: boolean;
  icon: string;
  base: string;
  materialicons: string;
  subMenus?: SubMenu[];
  dot?: boolean;
  changeLogVersion?: boolean;
  isActive?: boolean,
}

export interface SubMenu {
  menuValue: string;
  route?: string;
  base: string;
  base2?: string;
  base3?: string;
  base4?: string;
  base5?: string;
  base6?: string;
  base7?: string;
  base8?: string;
  haseSubSubMenu?: boolean;
  SubSubMenu?: SubSubMenu[];
  showSubSubRoute?: boolean;
  currentActive?: boolean;
  isActive?: boolean,
}

export interface SubSubMenu {
  menuValue: string;
  route?: string;
  base?: string;
  icon?: string;
  materialicons?: string;
  currentActive?: boolean;
  dot?: boolean;
}

export interface routerlink {
  id?: number;
  type?: number;
  url: string;
  urlAfterRedirects?: string;
}
export interface getUsers {
  id: number;
  name: string;
  designation: string;
  email: string;
  company: string;
  role: string;
  img: string;
}

export interface getTrainType {
  id: number;
  type: string;
  description: string;
  status: string;
}
export interface getTrainList {
  id: number;
  trainingType: string;
  trainer: string;
  employee: string;
  timeDuration: string;
  startDate: string;
  endDate: string;
  description: string;
  cost: string;
  status: string;
  img: string;
}
export interface getTrainer {
  id: number;
  name: string;
  lname: string;
  role: string;
  contactNumber: string;
  mail: string;
  description: string;
  status: string;
  img: string;
}
export interface getTickets {
  ticketId: string;
  ticketSubject: string;
  assignedStaff: string;
  client: string;
  priority: string;
  cc: string;
  assigne: string;
  addfollow: string;
  description: string;
  createdDate: string;
  lastReply: string;
  status: string;
  id: number;
  action: string;
}
export interface getTermination {
  id: number;
  employee: string;
  department: string;
  terminationType: string;
  terminationDate: string;
  reason: string;
  noticedDate: string;
}

export interface getDataTable {
  name: string;
  position: string;
  office: string;
  age: string;
  salary: string;
  id: number;
}
export interface getSubscribed {
  isSelected: boolean;
  image: string;
  company: string;
  trainer: string;
  client: string;
  plan: string;
  startdate: string;
  enddate: string;
  amount: string;
  availability: string;
  checked: string;
  id: number;
}
export interface allroles {
  roleName: string;
  id: number;
}
export interface allLeaveType {
  leaveType: string;
  leaveDays: string;
  id: number;
  status: string;
}
export interface getTaxes {
  taxName: string;
  taxPercentage: string;
  id: number;
  status: string;
}
export interface getProvidentFund {
  employeeName: string;
  providentFundType: string;
  employeeShare: string;
  organizationShare: string;
  id: number;
}
export interface getPayment {
  invoiceId: string;
  client: string;
  paymenttype: string;
  paidDate: string;
  paidAmount: string;
  id: number;
}
export interface getInvoice {
  id: number;
  number: string;
  client: string;
  project: string;
  email: string;
  tax: string;
  client_address: string;
  billing_address: string;
  estimate_date: string;
  expiry_date: string;
  items: items[];
  totalamount: number;
  discount: number;
  grandTotal: number;
  other_information: string;
  status: string;
}
export interface items {
  item: string;
  description: string;
  unit_cost: string;
  qty: number;
  amount: number;
}
export interface getExpenses {
  item: string;
  purchaseFrom: string;
  purchaseDate: string;
  purchasedBy: string;
  amount: string;
  paidby: string;
  status: string;
  id: number;
}
export interface getResignation {
  id: number;
  employee: string;
  department: string;
  reason: string;
  noticedDate: string;
  resignDate: string;
}
export interface getUserReport {
  id: number;
  name1: string;
  name2: string;
  company: string;
  email: string;
  role: string;
  designation: string;
  status: string;
  img: string;
}
export interface getTaskReport {
  id: number;
  taskname: string;
  startdate: string;
  enddate: string;
  status: string;
}
export interface getProjectReport {
  id: number;
  projecttitle: string;
  clientname: string;
  startdate: string;
  expiredate: string;
  status: string;
}
export interface getPayslipReport {
  id: number;
  name1: string;
  name2: string;
  paidamount: string;
  paymentmonth: string;
  paymentyear: string;
  actions: string;
  img: string;
}
export interface getPaymentReport {
  id: number;
  transactionid: string;
  date: string;
  clientname: string;
  paymentmethod: string;
  invoice: string;
  amount: string;
}
export interface getInvoiceReport {
  id: number;
  number: string;
  client: string;
  project: string;
  email: string;
  tax: string;
  client_address: string;
  billing_address: string;
  invoice_date: string;
  due_date: string;
  totalamount: number;
  discount: number;
  grandTotal: number;
  other_information: string;
  status: string;
}
export interface getEmployeeReport {
  id: number;
  name1: string;
  name2: string;
  employeetype: string;
  email: string;
  department: string;
  designation: string;
  joiningdate: string;
  dob: string;
  marritalstatus: string;
  gender: string;
  terminateddate: string;
  relievingdate: string;
  salary: string;
  address: string;
  contactnumber: string;
  experience: string;
  status: string;
  contactsnumber: string;
  img: string;
  emergencynumber: string;
}
export interface getExpenseReport {
  item: string;
  purchaseFrom: string;
  purchaseDate: string;
  purchasedBy: string;
  amount: string;
  paidBy: string;
  img: string;
  id: number;
  status: string;
}
export interface getLeaveReport {
  id: number;
  name1: string;
  name2: string;
  date: string;
  department: string;
  leavetype: string;
  noofdays: string;
  remainingleave: string;
  totalleaves: string;
  totalleavetaken: string;
  leavecarryforward: string;
  img: string;
}
export interface getDailyReport {
  id: number;
  name1: string;
  name2: string;
  date: string;
  department: string;
  status: string;
  img: string;
}
export interface getAttendancepReport {
  id: number;
  date: string;
  clockin: string;
  clockout: string;
  workstatus: string;
}
export interface getAttendReport {
  id: number;
  name: string;
  subname: number;
  img: string;
  date: string;
  workingdays: number;
  workingemployee: number;
  late: string;
  work: string;
  night: string;
  time: string;
  leave: string;
}
export interface getPromotion {
  id: number;
  employee: string;
  department: string;
  designation: string;
  promotionFrom: string;
  promotionTo: string;
  promotionDate: string;
}
export interface getProjects {
  name: string;
  description: string;
  endDate: string;
  startDate: string;
  priority: string;
  projectleader: string;
  teamMember: string;
  projectId: string;
  id: number;
}
export interface getPolicies {
  policyName: string;
  department: string;
  description: string;
  createdDate: string;
  id: number;
}
export interface getPerformanceReport {
  id: number;
  designation: string;
  experience: string;
  integrirty: string;
  Marketing: string;
  professionalism: string;
  managementskill: string;
  teamwork: string;
  adminstartion: string;
  criticalthinking: string;
  presentationskil: string;
  conflictmanagement: string;
  qualityofwork: string;
  attendance: string;
  effientcy: string;
  meetdeadline: string;
  department: string;
  addedBy: string;
  createdBy: string;
  status: string;
}
export interface getPerformanceappraisal {
  id: number;
  employee: string;
  designation: string;
  apparaisaldate: string;
  department: string;
  status: string;
}
export interface getAddPayroll1 {
  name: string;
  category: string;
  unitCost: string;
  id: number;
  rate: string;
}
// export interface getAddPayroll2 {
//   name: string;
//   rate: string;
//   id: number;
// }
// export interface getAddPayroll3 {
//   name: string;
//   amount : string;
//   id: number;
// }
export interface getEmployeeSalary {
  employee: string;
  employeeId: string;
  email: string;
  joinDate: string;
  role: string;
  employeeRole: string;
  status: string;
  salary: string;
  Basic: string;
  tdS: string;
  da: string;
  hra: string;
  pf: string;
  conveyance: string;
  leave: string;
  allowance: string;
  proTax: string;
  medAllowance: string;
  labourWelfare: string;
  othersAdd: string;
  othersDed: string;
  esi: string;
  id: number;
}
export interface getLeads {
  leadName: string;
  email: string;
  phone: string;
  project: string;
  status: string;
  created: string;
  id: number;
}
export interface allKnowledgeBase {
  title: string;
  list1: string;
  list2: string;
  list3: string;
  list4: string;
  list5: string;
  id: number;
}
export interface getShortList {
  id: number;
  name1: string;
  name2: string;
  jobtitle: string;
  department: string;
  status: string;
  img: string;
}
export interface getSchedule {
  id: number;
  name1: string;
  name2: string;
  jobtitle: string;
  useravailable: string;
  useravailabletimings: string;
  useravailable1: string;
  useravailabletimings1: string;
  useravailable2: string;
  useravailabletimings2: string;
  image: string;
}
export interface getOffer {
  id: number;
  name1: string;
  name2: string;
  jobtitle: string;
  jobtype: string;
  pay: string;
  annualip: string;
  longtermip: string;
  status: string;
  img: string;
}
export interface getManageResume {
  id: number;
  name1: string;
  name2: string;
  jobtitle: string;
  department: string;
  startdate: string;
  expiredate: string;
  jobtype: string;
  status: string;
  resume: string;
  img: string;
}
export interface getManageJobs {
  jobTitle: string;
  department: string;
  startDate: string;
  expireDate: string;
  id: number;
  staff: string;
  time: string;
  available: string;
}
export interface getVisited {
  id: number;
  jobtitle: string;
  department: string;
  startdate: string;
  expiredate: string;
  jobtype: string;
  status: string;
}
export interface getAllJobs {
  id: number;
  jobtitle: string;
  department: string;
  startdate: string;
  expiredate: string;
  jobtype: string;
  status: string;
}
export interface getinterview {
  id: number;
  jobtitle: string;
  department: string;
  jobtype: string;
}
export interface getOfferedJobs {
  id: number;
  jobtitle: string;
  department: string;
  jobtype: string;
}
export interface allAppliedCandidates {
  name: string;
  email: string;
  phone: string;
  applyDate: string;
  id: number;
  status: string;
}
export interface getInterview {
  id: number;
  questions: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctanswer: string;
  questions1: string;
  questions2: string;
  questions3: string;
}
export interface getExpire {
  id: number;
  experience: string;
  status: string;
}
export interface getCandidate {
  id: number;
  name: string;
  mobilenumber: string;
  email: string;
  createddate: string;
  img: string;
}
export interface getAptitudeResult {
  id: number;
  name1: string;
  name2: string;
  jobtitle: string;
  department: string;
  categorywise: string;
  categorywisemark: string;
  categorywise1: string;
  categorywisemark1: string;
  totalmark: string;
  status: string;
  img: string;
}
export interface getAptitudeCandidate {
  name: string;
  email: string;
  phone: string;
  applyDate: string;
  id: number;
}
export interface getTimeSheet {
  id: number;
  employee: string;
  designation: string;
  date: string;
  deadline: string;
  project: string;
  assignedhours: string;
  hrs: string;
  description: string;
  img: string;
}
export interface getShiftSchedule {
  id: number;
  name1: string;
  name2: string;
  img: string;
}
export interface getShiftList {
  id: number;
  shiftname: string;
  minstarttime: string;
  starttime: string;
  maxstarttime: string;
  minendtime: string;
  endtime: string;
  maxendtime: string;
  breaktime: string;
  status: string;
}
export interface getOverTime {
  id: number;
  name: string;
  otDate: string;
  otHrs: string;
  otType: string;
  status: string;
  approvedBy: string;
  description: string;
}
export interface allCustomPolicy {
  id: number;
  name: string;
  days: number;
}
export interface getLeave {
  id: number;
  employeeName: string;
  designation: string;
  leaveType: string;
  from: string;
  to: string;
  noofDays: string;
  remainleaves: string;
  reason: string;
  status: string;
}
export interface getTypeConge {
  id: number;
  libelle: string;
}

export interface getClasse {
  id: number;
  lib: string;
  borneInf: number;
  borneSup: number;
}

export interface getInfoDeBase {
  id: number;
  cle: string;
  valeur: number;
  cle_txt: string;
  valeur_txt: string;
}

export interface getStatut {
  id: number;
  libelle: string;
}

export interface getPreavis {
  employe_id: number;
  employe: string;
  duree: number;
  statut: string;
  id: string;
  date_preavis: Date;
}
export interface getTypeContrat {
  id: number;
  libelle: string;
}
export interface getTypePrime {
  id: number;
  libelle: string;
}

export interface getTypeLicenciement {
  id: number;
  libelle: string;
}
export interface getDesignations {
  id: number;
  designation: string;
  departmentName: string;
}
export interface lstEmployee {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  confirmpassword: string;
  department: string;
  designation: string;
  phone: string;
  email: string;
  mobile: string;
  joindate: string;
  role: string;
  employeeId: string;
  company: string;
  id: number;
  img?: string;
}

export interface getConge {
  id: number;
  date_debut: Date;
  date_fin: Date;
  employe_id: number;
  type_conges_id: number;
  libelle: string;
  employe: string;
  status: string;
  congeJoui: boolean;
  etat: string;
  jours: number;
}

export interface getDemande {
  id: number;
  status_id: string;
  date_demande: Date;
  objet: string;
  contenue: string;
  type_demande: string;
  employe_id: number;
  status: string;
  employe: string;
}

export interface getGrade {
  id: number;
  lib: string;
  libelle: string;
  categorie_id: number;
  classe_id: number;
  base_categorielle: number;
  prime_enciennete: number;
  taux_retenu_its_employe: number;
  taux_retenu_ipts_employe: number;
  //valeur_retenu_cnss_employe: number;
  // valeur_retenu_its_employe: number;
  taux_retenu_cnss_employe: number;
  taux_retenu_its_employeur: number;
  taux_retenu_ipts_employeur: number;
  //valeur_retenu_its_employeur: number;
  taux_retenu_cnss_employeur: number;
  // valeur_retenu_cnss_employeur: number;
  ClasseLib: string;
  tauxHoraireHeureSup: number;
}

export interface getPointConge {
  id_employe: number;
  employe: string;
  conges_joui: getConge[];
  total_conges_joui: number;
  total_jours_conges_joui: number;
  absences_deductibles: getAbsence[];
  total_absences_deductibles: number;
  total_jours_absences_deductibles: number;
}

export interface getPointContrat {
  id: number;
  id_employe: number;
  employe: string;
  type_contrat_id: number;
  libelle: string;
  date_signature: Date;
  duree: number;
  date_debut: Date;
  date_fin: Date;
  // status_id: number;
  // libelleStatus: string;
  etat: string;
  status: string;
}
export interface getMesContrats {
  id: number;
  libelle: string;
  date_signature: Date;
  date_debut: Date;
  date_fin: Date;
  duree: number;
  // libelleStatus: string;
  etat: string;
  status: string;
}

export interface getMonprofile {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  confirmpassword: string;
  department: string;
  designation: string;
  phone: string;
  email: string;
  mobile: string;
  joindate: string;
  role: string;
  employeeId: string;
  company: string;
  id: number;
  img?: string;
}
export interface getFormation {
  id: number;
  employe_id: number;
  intitule: string;
  domaine: string;
  date_debut: Date;
  date_fin: Date;
  diplome: string;
  employe: string;
}
export interface getExperience {
  id: number;
  employe_id: number;
  nomStructure: string;
  date_debut: Date;
  date_fin: Date;
  posteOcupe: string;
  employe: string;
}

export interface getAbsence {
  id: number;
  date_debut: Date;
  date_fin: Date;
  employe_id: number;
  type_absence_id: number;
  libelle: string;
  employe: string;
  status: string;
  jours: number;
}

export interface getPlainte {
  id: number;
  titre: string;
  description: string;
  date_M: Date;
  status_id: number;
  autre_info: string;
  employe_id: number;
  employe: string;
  status: string;
}

export interface getMiniTemplateEmploye {
  id: number;
  nom: string;
  prenom: string;
  role: string;
  role_id: number;
  titre: string;
  departement: string;
}

export interface getDepartment {
  id: number;
  nom_dep: string;
}

export interface getHeureSupplementaire {
  id: number;
  dateH: Date;
  nombreHeure: number;
  autreInfo: string;
  employe_id: number;
  employe: string;
  status: string;
}

export interface getDepartEmploye {
  id: number;
  datedepart: Date;
  motif: string;
  employe_id: number;
  employe: string;
  typeDepart_id: number;
  typeDepart: string;
  type_licenciement_id: number;
  type_licenciement: string;
  preavis_id: number;
  duree_preavis: number;
  date_preavis: Date;
  statut_preavis: string;
}

export interface getPost {
  id: number;
  nom_poste: string;
}

export interface getBanque {
  id: number;
  nom: string;
}
export interface getBureau {
  id: number;
  libelle: string;
  description: string;
}



export interface getFournisseur {
  id: number;
  nom: string;
  telephone: string;
  adresse: string;

}

  export interface getArticle {
  id: number;
  libelle: string;
}

export interface getCategorieArticle {
  id: number;
  libelle: string;
}

export interface getTypeAbsence {
  id: number;
  libelle: string;
  detConge: boolean;
}

export interface getDeductibleFromConge {
  val: number;
  lib: string;
}

export interface getIfCongeJoui {
  val: number;
  lib: string;
}

export interface getCategorie {
  id: number;
  libelle: string;
}

export interface getTypeDepart {
  id: number;
  lib: string;
}

export interface getRole {
  id: number;
  lib: string;
  niveau: string;
}

export interface getEmployees {
  firstname: string;
  lastname: string;
  username: string;
  username1: string;
  confirmpassword: string;
  department: string;
  designation: string;
  phone: string;
  email: string;
  mobile: string;
  joindate: string;
  role: string;
  employeeId: string;
  company: string;
  id: number;
  img: string;
}
export interface getGoalList {
  id: number;
  goalType: string;
  subject: string;
  targetAchivement: string;
  startDate: string;
  endDate: string;
  description: string;
  status: string;
  progress: string;
}
export interface getClient {
  name: string;
  role: string;
  company: string;
  image: string;
  clientId: string;
  email: string;
  phone: string;
  status: string;
  status1: string;
  id: number;
  img: string;
}
export interface companiesList {
  id: number;
  company: string;
}
export interface clientsDatas {
  name: string;
  role: string;
  company: string;
  image: string;
  clientId: string;
  email: string;
  phone: string;
  status: string;
  id: number;
  img?: string;
}
export interface getAssets {
  assetUser: string;
  assetName: string;
  assetId: string;
  assetStatus: string;
  purchaseDate: string;
  warrenty: string;
  warrentyEnd: string;
  Amount: string;
  id: number;
}
export interface getAssetsCategory {
  id: number;
  categoryName: string;
  createdOn: string;
  img: string;
}
export interface getAssetsNew {
  id: number;
  name: string;
  img1: string;
  img2: string;
  assetId: string;
  category: string;
  department: string;
  allocatedTo: string;
  emailId: string;
  status: string;
  status1: string;
  status2: string;
  status3: string;
}
export interface getGoalType {
  id: number;
  type: string;
  description: string;
  status: string;
}
export interface getCategories {
  id: number;
  categoryname: string;
  subcategoryname: string;
}
export interface getBudgets {
  id: number;
  budgettitle: string;
  budgettype: string;
  startdate: string;
  enddate: string;
  totalrevenue: string;
  totalexpenses: string;
  taxamount: string;
  budgetamount: string;
  notes: string;
  categoryname: string;
  subcategoryname: string;
  amount: string;
  revenuedate: string;
}
export interface projectContent {
  project: string;
  projectId: string;
  deadline: string;
  priority: string;
  status: string;
  id: number;
  img: string;
}
export interface url {
  url: string;
}
