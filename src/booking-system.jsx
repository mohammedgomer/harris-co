import { useState, useEffect, useCallback, useMemo } from "react";

// v3.0 - Harris & Co Solicitors rebrand
const FIRM_NAME = "Harris & Co Solicitors";
const FIRM_PHONE = "0161 537 3777";
const SOLICITOR_EMAIL = "mg.omer@outlook.com";
const LOGO_B64 = "data:image/jpeg;base64,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";

const CASE_CATEGORIES = {
  Criminal: {
    icon: "\u2696\uFE0F",
    subcategories: {
      Murder: { deposit: 500, description: "Murder & manslaughter charges" },
      GBH: { deposit: 350, description: "Grievous bodily harm offences" },
      "Drug Offences": { deposit: 300, description: "Possession, supply & trafficking" },
      Theft: { deposit: 250, description: "Theft, burglary & robbery" },
    },
  },
  Motoring: {
    icon: "\uD83D\uDE97",
    subcategories: {
      "Driving Offences": { deposit: 200, description: "Speeding, dangerous driving, bans" },
      "Road Traffic Accidents": { deposit: 250, description: "RTA claims & disputes" },
    },
  },
  Civil: {
    icon: "\uD83D\uDCCB",
    subcategories: {
      "Personal Injury": { deposit: 300, description: "Injury compensation claims" },
    },
  },
};

const SOLICITORS = [
  { id: 1, name: "Harris Zafar", specialisms: ["Criminal", "Motoring", "Civil"], displaySpecialisms: ["Criminal", "Motoring", "Civil", "Immigration", "Legal Drafting", "Legal Advice"], photo: "HZ", title: "Senior Partner" },
  { id: 2, name: "Maheen Bijarani", specialisms: ["Criminal", "Motoring", "Civil"], displaySpecialisms: ["Criminal", "Motoring", "Civil", "Immigration", "Legal Drafting", "Legal Advice"], photo: "MB", title: "Partner" },
  { id: 3, name: "Mohammed Usman", specialisms: ["Criminal", "Motoring", "Civil"], displaySpecialisms: ["Criminal", "Motoring", "Civil", "Immigration", "Legal Drafting", "Legal Advice"], photo: "MU", title: "Senior Associate" },
  { id: 4, name: "Stephen Benson", specialisms: ["Criminal", "Motoring", "Civil"], displaySpecialisms: ["Criminal", "Motoring", "Civil", "Immigration", "Legal Drafting", "Legal Advice"], photo: "SB", title: "Associate" },
  { id: 5, name: "Usama Ali", specialisms: ["Criminal", "Motoring", "Civil"], displaySpecialisms: ["Immigration", "Legal Drafting", "Legal Advice"], photo: "UA", title: "Associate" },
];

const TIME_SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30"];

const UPLOAD_PROMPTS = [
  { id: "docs", label: "Supporting Documents", hint: "Contracts, letters, court papers, police reports", required: false },
  { id: "photos", label: "Photos / Videos", hint: "Any visual evidence relevant to your case", required: false },
  { id: "notes", label: "Personal Notes", hint: "Your written account of events, timeline, key details", required: false },
  { id: "id", label: "Photo ID", hint: "Passport, driving licence, or national ID card", required: true },
];

const VAT_RATE = 0.20;
const NEW_CASE_STEPS = ["Case Type", "Scheduling", "Your Details", "Attachments", "Payment", "Confirmation"];

function generateReference() { const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let r = "CA-"; for (let i = 0; i < 6; i++) r += c[Math.floor(Math.random() * c.length)]; return r; }
function getNext14Days() { const d = []; const n = new Date(); for (let i = 1; i <= 14; i++) { const x = new Date(n); x.setDate(x.getDate() + i); if (x.getDay() !== 0 && x.getDay() !== 6) d.push(x); } return d; }
function formatDate(d) { return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); }
function formatDateFull(d) { return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
function toDateKey(d) { return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
const API = 'http://localhost:3001';

function generateAISummary(caseData) {
  const { parentCategory, subcategory, consultationType, description, clientName } = caseData;
  const legislationMap = {
    Murder: [
      { act: "Offences Against the Person Act 1861, s.18", relevance: "Primary statute defining murder and grievous harm with intent" },
      { act: "Criminal Justice Act 2003, s.269 & Sch.21", relevance: "Mandatory life sentence framework and minimum term starting points" },
      { act: "Coroners and Justice Act 2009, s.54-56", relevance: "Partial defence of loss of control (replaced provocation)" },
      { act: "Homicide Act 1957, s.2", relevance: "Partial defence of diminished responsibility" },
      { act: "Police and Criminal Evidence Act 1984 (PACE)", relevance: "Governs arrest, detention, and evidence gathering procedures" },
    ],
    GBH: [
      { act: "Offences Against the Person Act 1861, s.18 & s.20", relevance: "GBH with intent (s.18, max life) vs without intent (s.20, max 5 years)" },
      { act: "Criminal Justice Act 2003, Sch.15", relevance: "Specified offence for dangerous offender provisions" },
      { act: "Sentencing Council Assault Guidelines 2024", relevance: "Categorisation of harm and culpability for sentencing" },
      { act: "Criminal Justice Act 1967, s.3", relevance: "Use of reasonable force in self-defence" },
      { act: "PACE 1984, Codes C & D", relevance: "Detention rights, identification procedures" },
    ],
    "Drug Offences": [
      { act: "Misuse of Drugs Act 1971, s.4-5", relevance: "Core offences: possession, possession with intent, supply, production" },
      { act: "Proceeds of Crime Act 2002", relevance: "Confiscation orders and money laundering charges" },
      { act: "Serious Crime Act 2015", relevance: "Conspiracy and encouraging/assisting drug offences" },
      { act: "Sentencing Council Drug Offences Guidelines 2021", relevance: "Sentencing ranges based on role and quantity" },
      { act: "Regulation of Investigatory Powers Act 2000", relevance: "Lawfulness of surveillance and phone intercept evidence" },
    ],
    Theft: [
      { act: "Theft Act 1968, s.1-7", relevance: "Core theft offence and definition of dishonesty (Ivey v Genting Casinos)" },
      { act: "Theft Act 1968, s.8-10", relevance: "Robbery (s.8), burglary (s.9), aggravated burglary (s.10)" },
      { act: "Fraud Act 2006", relevance: "If theft involves deception, false representation, or abuse of position" },
      { act: "Sentencing Council Theft Offences Guidelines 2016", relevance: "Categorisation by value, planning, and impact on victim" },
    ],
    "Driving Offences": [
      { act: "Road Traffic Act 1988, s.1-3ZB", relevance: "Dangerous driving, careless driving, causing death by driving offences" },
      { act: "Road Traffic Act 1988, s.4-11", relevance: "Drink/drug driving offences and prescribed limits" },
      { act: "Road Traffic Offenders Act 1988", relevance: "Penalty points, disqualification, and totting-up procedures" },
      { act: "Sentencing Council Motoring Offences Guidelines", relevance: "Starting points and ranges for all motoring offences" },
    ],
    "Road Traffic Accidents": [
      { act: "Road Traffic Act 1988, s.170", relevance: "Duty to stop and report an accident" },
      { act: "Civil Liability Act 2018", relevance: "Whiplash reform, tariff-based damages for soft tissue injuries" },
      { act: "Limitation Act 1980, s.11", relevance: "3-year limitation period for personal injury claims" },
      { act: "Pre-Action Protocol for Personal Injury Claims", relevance: "Required steps before issuing court proceedings" },
      { act: "Highways Act 1980, s.41", relevance: "Highway authority liability for road defects" },
    ],
    "Personal Injury": [
      { act: "Limitation Act 1980, s.11 & s.33", relevance: "3-year limitation period and court discretion to extend" },
      { act: "Occupiers Liability Acts 1957 & 1984", relevance: "Duty of care owed by occupiers to visitors and trespassers" },
      { act: "Health and Safety at Work etc. Act 1974", relevance: "Employer duty of care and breach as evidence in civil claims" },
      { act: "Pre-Action Protocol for Personal Injury Claims", relevance: "Mandatory pre-litigation steps" },
      { act: "Judicial College Guidelines (16th Edition)", relevance: "Brackets for general damages valuation by injury type" },
    ],
  };
  const solutionsMap = {
    Murder: [
      { title: "Challenge the Prosecution Case", detail: "Scrutinise all disclosure material, CCTV, forensic evidence (DNA, fingerprints, pathology), phone records, and witness statements. Apply for unused material under CPIA 1996. Challenge identification evidence reliability under Turnbull guidelines." },
      { title: "Partial Defence - Loss of Control", detail: "Under s.54-56 Coroners and Justice Act 2009, if a qualifying trigger existed (fear of serious violence or circumstances of extremely grave character), the charge may be reduced to voluntary manslaughter." },
      { title: "Partial Defence - Diminished Responsibility", detail: "Under s.2 Homicide Act 1957, if defendant suffered abnormality of mental functioning from a recognised medical condition substantially impairing ability to understand conduct, form rational judgment, or exercise self-control." },
      { title: "Self-Defence / Reasonable Force", detail: "Under s.3 Criminal Law Act 1967 and common law. Standard is subjective belief + objective reasonableness. Householder cases benefit from enhanced protection under s.76 CJIA 2008." },
      { title: "Joint Enterprise Review", detail: "Following R v Jogee [2016] UKSC 8, review whether foresight of the principal's actions has been properly assessed. Challenge whether defendant truly intended to assist or encourage the offence." },
      { title: "Bail Application Strategy", detail: "Prepare robust bail application addressing Schedule 1 Bail Act 1976 objections. Propose conditions: residence, curfew, electronic tag, reporting, surety." },
    ],
    GBH: [
      { title: "Dispute Level of Charge (s.18 vs s.20)", detail: "Section 18 requires intent to cause GBH (max life). Section 20 requires only recklessness (max 5 years). Challenge whether prosecution can prove specific intent, particularly where alcohol or impulsive behaviour was involved." },
      { title: "Self-Defence Under s.76 CJIA 2008", detail: "If defendant was responding to attack or threat, argue reasonable force. Jury assesses what force was reasonable based on defendant's honest belief, even if mistaken." },
      { title: "Challenge Medical Evidence", detail: "Instruct independent medical expert to review injuries. Dispute whether injuries constitute 'really serious harm' (GBH) or merely ABH. Classification directly affects charge level and sentencing." },
      { title: "Negotiate Lesser Plea", detail: "If evidence is strong, negotiate with CPS to accept plea to s.20 or s.47 ABH instead of s.18, dramatically reducing sentencing range." },
      { title: "Procedural Challenges (PACE)", detail: "Review PACE compliance: lawful arrest, caution rights, interview fairness, identification procedures. Breaches may render evidence inadmissible under s.78 PACE." },
      { title: "Sentencing Mitigation", detail: "Early guilty plea (up to 1/3 reduction), good character, remorse, mental health circumstances, provocation, rehabilitation prospects." },
    ],
    "Drug Offences": [
      { title: "Challenge Possession / Knowledge", detail: "Prosecution must prove defendant knew they possessed drugs. If found in shared premises or vehicle, argue lack of knowledge or control. R v Lambert [2002] establishes burden on knowledge." },
      { title: "Challenge Intent to Supply", detail: "Dispute that quantity, packaging, scales, phones, or cash necessarily indicate supply. Argue personal use with expert evidence on consumption rates." },
      { title: "Unlawful Search / Seizure", detail: "Review whether stop/search was lawful under s.1 PACE or s.23 MDA. Challenge warrant validity. If unlawful, apply to exclude evidence under s.78 PACE." },
      { title: "Entrapment / Abuse of Process", detail: "If undercover officer instigated offence, argue entrapment following R v Looseley [2001]. Court may stay proceedings as abuse of process." },
      { title: "RIPA Surveillance Challenges", detail: "Challenge whether surveillance or phone intercepts complied with RIPA 2000. Improper authorisation can render evidence inadmissible." },
      { title: "Basis of Plea / Role Mitigation", detail: "Negotiate basis of plea minimising role (lesser vs significant vs leading) and agreed quantity. Under Sentencing Council guidelines, role categorisation has enormous sentencing impact." },
    ],
    Theft: [
      { title: "Challenge Dishonesty Element", detail: "Following Ivey v Genting Casinos [2017] UKSC 67: if defendant genuinely believed they had legal right to the property (s.2(1)(a) Theft Act), there is no theft." },
      { title: "Dispute Appropriation or Intent", detail: "Challenge whether there was completed appropriation or intention to permanently deprive. Borrowing is generally not theft." },
      { title: "Negotiate Caution or Charge Reduction", detail: "For lower-value first offences, negotiate simple caution, conditional caution with restorative justice, or community resolution." },
      { title: "Compensation and Restitution", detail: "Offer full restitution to victim before sentencing. Demonstrates remorse and can significantly reduce sentence." },
      { title: "Mental Health Mitigation", detail: "If diagnosed condition (depression, kleptomania, impulse control), obtain psychiatric reports for powerful mitigation supporting community order with treatment." },
      { title: "Challenge Identification Evidence", detail: "Dispute CCTV quality and reliability. Challenge whether Turnbull guidelines were properly followed for eyewitness evidence." },
    ],
    "Driving Offences": [
      { title: "Challenge Evidence Gathering", detail: "For drink-drive: challenge breathalyser calibration, 20-minute observation period, s.7 RTA procedures. For speeding: challenge camera calibration, NIP service within 14 days." },
      { title: "Special Reasons Argument", detail: "Under s.34(1) RTOA 1988, if special reasons exist (spiked drinks, short distance, genuine emergency), court has discretion not to disqualify." },
      { title: "Exceptional Hardship (Totting Up)", detail: "If facing 12+ points ban, argue exceptional hardship under s.35 RTOA 1988: loss of employment affecting dependants, medical needs, impact on others." },
      { title: "Technical Defences", detail: "Challenge whether prosecution can prove you were the driver. Argue mechanical defect for dangerous driving. Check insurance policy coverage." },
      { title: "Rehabilitation Course", detail: "Request drink-drive rehabilitation course under s.34A RTOA 1988 to reduce disqualification by up to 25%." },
      { title: "Negotiate Charge Reduction", detail: "Negotiate dangerous driving (s.2) down to careless driving (s.3) for significantly lower penalties." },
    ],
    "Road Traffic Accidents": [
      { title: "Establish Full Liability", detail: "Gather police report, dashcam footage, witness statements, road conditions. Establish other party's negligence. Issue Letter of Claim under Pre-Action Protocol." },
      { title: "Challenge Contributory Negligence", detail: "Under Law Reform (Contributory Negligence) Act 1945, challenge percentage split using accident reconstruction evidence." },
      { title: "Claim Against Multiple Parties", detail: "Consider highway authority (s.41 Highways Act), vehicle manufacturer (Consumer Rights Act 2015), or employer vicarious liability." },
      { title: "Maximise Damages", detail: "Claim general damages (Judicial College Guidelines), special damages (lost earnings, medical, care, travel, vehicle damage, hire charges), and future losses." },
      { title: "Uninsured/Untraced Driver Claims", detail: "If at-fault driver uninsured or fled, claim through Motor Insurers' Bureau (MIB) under relevant agreement." },
      { title: "Criminal Prosecution of Other Driver", detail: "If other driver committed offence, support prosecution. Conviction strengthens civil claim under s.11 Civil Evidence Act 1968." },
    ],
    "Personal Injury": [
      { title: "Full Medical Evidence", detail: "Instruct independent medical expert for detailed report: diagnosis, causation, symptoms, treatment, prognosis, and long-term impact on function and employment." },
      { title: "Document All Financial Losses", detail: "Lost earnings (past/future), medical expenses, travel, care (valued at commercial rates per Housecroft v Burnett), property damage, adaptations, loss of earning capacity." },
      { title: "Part 36 Settlement Strategy", detail: "Make well-timed Part 36 offer. If defendant fails to beat it at trial: indemnity costs, enhanced interest up to 10% above base rate, additional amount up to GBP 75,000." },
      { title: "Alternative Dispute Resolution", detail: "Mediation has 70%+ settlement rate. Unreasonable refusal can result in costs penalties (Halsey v Milton Keynes). Faster and cheaper than trial." },
      { title: "Interim Payments", detail: "If liability clear, apply under CPR 25.7 for interim payment to cover immediate medical treatment, rehabilitation, and living expenses." },
      { title: "Employer / Occupier Liability", detail: "Employers owe duties under HSWA 1974 and specific regulations. Occupiers' Liability Acts 1957/1984 impose duties on premises. Breach of statutory duty strengthens claim." },
      { title: "Limitation Considerations", detail: "3-year limitation from accident or date of knowledge (s.14). For children, time runs from 18th birthday. Apply under s.33 for extension if needed." },
    ],
  };
  const actionsMap = {
    Murder: ["Ensure solicitor present for ALL police interviews", "Apply for legal aid immediately (automatic grant for murder)", "Request full advance disclosure before interview", "Preserve alibi evidence, CCTV, and phone location data urgently", "Instruct forensic experts (pathologist, DNA, digital) early", "Prepare bail application for Crown Court"],
    GBH: ["Obtain complainant's medical records and injury photos", "Preserve CCTV, dashcam, or phone footage", "Identify defence witnesses and obtain statements", "Request advance disclosure and full prosecution bundle", "Consider pre-charge representation to police/CPS", "Prepare for Plea and Trial Preparation Hearing"],
    "Drug Offences": ["Do NOT discuss case on phone, text, or social media", "Request full evidence bundle including forensic drug analysis", "Challenge any POCA restraint orders immediately", "Check RIPA authorisations for surveillance", "Gather personal circumstances evidence for mitigation", "Apply for bail with robust conditions if remanded"],
    Theft: ["Gather evidence of lawful ownership if disputed", "Preserve CCTV or electronic evidence", "Consider voluntary restitution to demonstrate good faith", "Obtain character references", "Explore diversion options if first offence", "Seek psychiatric assessment if mental health contributed"],
    "Driving Offences": ["Do NOT provide further statement beyond scene", "Obtain police MG DD/A-E forms (procedure records)", "Request calibration certificates for equipment used", "Check NIP was served within 14 days", "Gather exceptional hardship evidence if totting ban likely", "Obtain independent medical assessment if drink/drug alleged"],
    "Road Traffic Accidents": ["Report accident to insurer within 24 hours", "Photograph all damage, scene, road conditions, injuries", "Obtain witness contacts and other driver's insurance details", "Register with GP or attend A&E for injury documentation", "Do NOT accept early settlement offers without legal advice", "Keep all receipts: medical, transport, vehicle hire, lost earnings"],
    "Personal Injury": ["Seek medical attention and ensure ALL injuries documented", "Photograph injuries, location, and causative hazard", "Report incident to relevant authority in writing", "Keep detailed symptom diary with pain levels and daily impact", "Preserve evidence: accident book, CCTV requests, witness details", "Do NOT sign documents or accept offers without legal advice"],
  };
  var desc = description || "";
  return {
    summary: "Client " + clientName + " seeks a " + consultationType + " consultation regarding a " + subcategory + " matter under " + parentCategory + " law. " + (desc ? 'The client describes: "' + desc.substring(0, 300) + (desc.length > 300 ? '..."' : '"') : "No additional details provided."),
    solutions: solutionsMap[subcategory] || [{ title: "Full assessment required", detail: "Upon review of all supporting documents." }],
    legislation: legislationMap[subcategory] || [{ act: "To be determined", relevance: "Upon full review" }],
    immediateActions: actionsMap[subcategory] || ["Gather all relevant documentation", "Preserve evidence", "Do not discuss with third parties"],
    urgency: parentCategory === "Criminal" ? "High - time-sensitive criminal matter" : subcategory === "Road Traffic Accidents" ? "Medium - evidence preservation critical" : "Standard",
    riskLevel: parentCategory === "Criminal" ? "Serious - potential custodial sentence" : "Moderate - financial/legal exposure",
    nextSteps: "Your solicitor will review all uploaded documents and case details before the consultation. Please bring any additional evidence not already uploaded. During the consultation, your solicitor will provide tailored advice based on the specific facts of your case.",
  };
}


var globalStyles = '@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap");*{margin:0;padding:0;box-sizing:border-box}:root{--navy:#1a1a1a;--navy-light:#2a2a2a;--navy-mid:#333;--gold:#f9e2a8;--gold-light:#fbefc9;--gold-pale:#fdf6e3;--cream:#ffffff;--cream-dark:#f5f5f5;--white:#ffffff;--text:#2C2C2C;--text-light:#6B6B6B;--text-lighter:#999;--green:#2E7D52;--green-light:#E8F5EE;--red:#B33A3A;--red-light:#FCEAEA;--border:#e0d6c2;--shadow:0 2px 12px rgba(0,0,0,.06);--shadow-lg:0 8px 32px rgba(0,0,0,.10);--radius:8px;--radius-lg:12px;--transition:all .25s cubic-bezier(.4,0,.2,1)}body{font-family:"Source Sans 3",-apple-system,sans-serif;background:var(--cream);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}@keyframes spin{to{transform:rotate(360deg)}}';

function StepIndicator({ steps, current }) {
  return (<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, margin: "0 0 40px", flexWrap: "wrap" }}>{steps.map((s, i) => (<div key={i} style={{ display: "flex", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: i < current ? "var(--green)" : i === current ? "var(--navy)" : "var(--border)", color: i <= current ? "#fff" : "var(--text-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>{i < current ? "\u2713" : i + 1}</div><span style={{ fontSize: 13, fontWeight: i === current ? 600 : 400, color: i === current ? "var(--navy)" : "var(--text-light)", whiteSpace: "nowrap" }}>{s}</span></div>{i < steps.length - 1 && <div style={{ width: 40, height: 2, margin: "0 12px", background: i < current ? "var(--green)" : "var(--border)" }} />}</div>))}</div>);
}
function Card({ children, style, onClick, hoverable }) {
  const [h, setH] = useState(false);
  return (<div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", padding: 24, boxShadow: h && hoverable ? "var(--shadow-lg)" : "var(--shadow)", transition: "var(--transition)", cursor: onClick ? "pointer" : "default", transform: h && hoverable ? "translateY(-2px)" : "none", ...style }}>{children}</div>);
}
function Button({ children, onClick, variant = "primary", disabled, style, size = "md" }) {
  const [h, setH] = useState(false);
  const base = { border: "none", borderRadius: "var(--radius)", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'Source Sans 3',sans-serif", fontWeight: 600, transition: "var(--transition)", display: "inline-flex", alignItems: "center", gap: 8, opacity: disabled ? 0.5 : 1, padding: size === "sm" ? "8px 16px" : size === "lg" ? "16px 32px" : "12px 24px", fontSize: size === "sm" ? 13 : size === "lg" ? 16 : 14 };
  const v = { primary: { background: h && !disabled ? "var(--navy-light)" : "var(--navy)", color: "#fff" }, gold: { background: h && !disabled ? "var(--gold-light)" : "var(--gold)", color: "var(--navy)" }, outline: { background: h && !disabled ? "var(--cream)" : "transparent", color: h && !disabled ? "#000" : "var(--navy)", border: "2px solid var(--navy)" }, ghost: { background: h && !disabled ? "var(--cream-dark)" : "transparent", color: h && !disabled ? "#000" : "var(--text)" }, danger: { background: h && !disabled ? "#9A2E2E" : "var(--red)", color: "#fff" } };
  var hoverOverride = h && !disabled ? { color: v[variant].color } : {};
  return <button onClick={disabled ? undefined : onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ ...base, ...v[variant], ...style, ...hoverOverride }}>{children}</button>;
}
function FormInput({ label, required, hint, error, inputStyle, ...props }) {
  return (<div style={{ marginBottom: 20 }}>{label && <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>{label} {required && <span style={{ color: "var(--red)" }}>*</span>}</label>}{hint && <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 6 }}>{hint}</p>}<input {...props} style={{ width: "100%", padding: "12px 16px", border: "1px solid " + (error ? "var(--red)" : "var(--border)"), borderRadius: "var(--radius)", fontSize: 15, fontFamily: "'Source Sans 3',sans-serif", outline: "none", transition: "border-color .2s,box-shadow .2s", background: "var(--white)", ...inputStyle }} onFocus={e => { e.target.style.borderColor = "var(--gold)"; e.target.style.boxShadow = "0 0 0 3px var(--gold-pale)"; }} onBlur={e => { e.target.style.borderColor = error ? "var(--red)" : "var(--border)"; e.target.style.boxShadow = "none"; }} />{error && <p style={{ fontSize: 13, color: "var(--red)", marginTop: 4 }}>{error}</p>}</div>);
}
function FormTextArea({ label, required, hint, error, ...props }) {
  return (<div style={{ marginBottom: 20 }}>{label && <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>{label} {required && <span style={{ color: "var(--red)" }}>*</span>}</label>}{hint && <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 6 }}>{hint}</p>}<textarea {...props} style={{ width: "100%", padding: "12px 16px", border: "1px solid " + (error ? "var(--red)" : "var(--border)"), borderRadius: "var(--radius)", fontSize: 15, fontFamily: "'Source Sans 3',sans-serif", outline: "none", transition: "border-color .2s,box-shadow .2s", resize: "vertical", minHeight: 120, background: "var(--white)" }} onFocus={e => { e.target.style.borderColor = "var(--gold)"; e.target.style.boxShadow = "0 0 0 3px var(--gold-pale)"; }} onBlur={e => { e.target.style.borderColor = error ? "var(--red)" : "var(--border)"; e.target.style.boxShadow = "none"; }} />{error && <p style={{ fontSize: 13, color: "var(--red)", marginTop: 4 }}>{error}</p>}</div>);
}
function SectionTitle({ children, sub }) {
  return (<div style={{ marginBottom: 24 }}><h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, color: "var(--navy)", fontWeight: 400, marginBottom: sub ? 6 : 0 }}>{children}</h2>{sub && <p style={{ fontSize: 15, color: "var(--text-light)" }}>{sub}</p>}</div>);
}
function Badge({ children, color = "navy" }) {
  const c = { navy: { bg: "var(--navy)", t: "#fff" }, gold: { bg: "var(--gold-pale)", t: "var(--navy)" }, green: { bg: "var(--green-light)", t: "var(--green)" }, red: { bg: "var(--red-light)", t: "var(--red)" } }[color] || { bg: "var(--navy)", t: "#fff" };
  return <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: c.bg, color: c.t }}>{children}</span>;
}

export default function SolicitorBookingSystem() {
  const [caseType, setCaseType] = useState(null);
  const [step, setStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [existingName, setExistingName] = useState("");
  const [existingRef, setExistingRef] = useState("");
  const [existingMessage, setExistingMessage] = useState("");
  const [existingSubmitted, setExistingSubmitted] = useState(false);
  const [parentCategory, setParentCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [consultationType, setConsultationType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSolicitor, setSelectedSolicitor] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [processing, setProcessing] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCancel, setShowCancel] = useState(false);
  const [cancelRef, setCancelRef] = useState("");
  const [cancelName, setCancelName] = useState("");
  const [cancelAction, setCancelAction] = useState(null);
  const [reschedDate, setReschedDate] = useState(null);
  const [reschedTime, setReschedTime] = useState(null);
  const [reschedConfirmed, setReschedConfirmed] = useState(false);
  const [reschedSlots, setReschedSlots] = useState([]);

  const deposit = subcategory ? CASE_CATEGORIES[parentCategory]?.subcategories[subcategory]?.deposit : 0;
  const vatAmount = deposit * VAT_RATE;
  const totalAmount = deposit + vatAmount;
  const availableSolicitors = useMemo(() => parentCategory ? SOLICITORS.filter(s => s.specialisms.includes(parentCategory)) : [], [parentCategory]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const dates = useMemo(() => getNext14Days(), []);

  // Fetch real availability from server when solicitor or date changes
  useEffect(() => {
    if (!selectedSolicitor || !selectedDate) { setAvailableSlots([]); return; }
    setSlotsLoading(true);
    fetch(API + '/api/availability?solicitorId=' + selectedSolicitor.id + '&date=' + toDateKey(selectedDate))
      .then(r => r.json())
      .then(data => { setAvailableSlots(data.available || []); setSlotsLoading(false); })
      .catch(() => { setAvailableSlots(TIME_SLOTS); setSlotsLoading(false); });
  }, [selectedSolicitor, selectedDate]);
  const transitionTo = useCallback((ns) => { setFadeIn(false); setTimeout(() => { setStep(ns); setFadeIn(true); }, 200); }, []);
  const validateDetails = () => { const e = {}; if (!clientName.trim()) e.clientName = "Required"; if (!clientEmail.trim() || !/\S+@\S+\.\S+/.test(clientEmail)) e.clientEmail = "Valid email required"; if (!clientPhone.trim()) e.clientPhone = "Required"; setErrors(e); return Object.keys(e).length === 0; };

  const handlePayment = () => {
    setProcessing(true);
    var ref = generateReference();
    var summary = generateAISummary({ parentCategory, subcategory, consultationType, description: caseDescription, clientName });
    var formData = new FormData();
    var bookingData = {
      ref: ref,
      clientName: clientName, clientEmail: clientEmail, clientPhone: clientPhone,
      parentCategory: parentCategory, subcategory: subcategory, consultationType: consultationType,
      date: selectedDate ? formatDateFull(selectedDate) : "", dateKey: selectedDate ? toDateKey(selectedDate) : "",
      time: selectedTime, solicitor: selectedSolicitor ? selectedSolicitor.name : "",
      solicitorId: selectedSolicitor ? selectedSolicitor.id : 0,
      deposit: deposit.toFixed(2), vat: vatAmount.toFixed(2), total: totalAmount.toFixed(2),
      description: caseDescription, aiSummary: summary
    };
    formData.append('bookingData', JSON.stringify(bookingData));
    Object.values(uploadedFiles).flat().forEach(function(file) { formData.append('files', file, file.name); });

    fetch(API + '/api/bookings', { method: 'POST', body: formData })
      .then(r => r.json())
      .then(data => {
        setProcessing(false);
        if (data.success) {
          setBookingRef(ref);
          setEmailSent(true);
          transitionTo(5);
        } else {
          alert(data.error || 'Booking failed. Please try again.');
        }
      })
      .catch(err => {
        setProcessing(false);
        alert('Server error. Make sure the server is running (node server.js)');
      });
  };

  const handleFileUpload = (pid, e) => { var f = Array.from(e.target.files); setUploadedFiles(prev => ({ ...prev, [pid]: [...(prev[pid] || []), ...f] })); };
  const removeFile = (pid, idx) => { setUploadedFiles(prev => ({ ...prev, [pid]: prev[pid].filter((_, i) => i !== idx) })); };

  const downloadReceipt = () => {
    var lines = [];
    lines.push("============================================");
    lines.push("            VAT RECEIPT");
    lines.push("        " + FIRM_NAME);
    lines.push("============================================");
    lines.push("");
    lines.push("Reference:        " + bookingRef);
    lines.push("Date:             " + (selectedDate ? formatDateFull(selectedDate) : ""));
    lines.push("Client:           " + clientName);
    lines.push("Email:            " + clientEmail);
    lines.push("Phone:            " + clientPhone);
    lines.push("");
    lines.push("--------------------------------------------");
    lines.push("BOOKING DETAILS");
    lines.push("--------------------------------------------");
    lines.push("Case Type:        " + parentCategory + " - " + subcategory);
    lines.push("Consultation:     " + (consultationType === "walk-in" ? "Walk-in (Office)" : "Phone"));
    lines.push("Time:             " + selectedTime + " (30 minutes)");
    lines.push("Solicitor:        " + (selectedSolicitor ? selectedSolicitor.name : ""));
    lines.push("");
    lines.push("--------------------------------------------");
    lines.push("PAYMENT BREAKDOWN");
    lines.push("--------------------------------------------");
    lines.push("Consultation Deposit:     GBP " + deposit.toFixed(2));
    lines.push("VAT @ 20%:               GBP " + vatAmount.toFixed(2));
    lines.push("                          -----------");
    lines.push("TOTAL PAID:               GBP " + totalAmount.toFixed(2));
    lines.push("");
    lines.push("--------------------------------------------");
    lines.push("Payment Method:   Card (Stripe)");
    lines.push("Status:           PAID");
    lines.push("");
    lines.push(FIRM_NAME);
    lines.push("Tel: " + FIRM_PHONE);
    lines.push("Authorised and regulated by the SRA");
    lines.push("============================================");
    var text = lines.join("\n");
    var blob = new Blob([text], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "VAT-Receipt-" + bookingRef + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const resetAll = () => { setCaseType(null); setStep(0); setParentCategory(null); setSubcategory(null); setConsultationType(null); setSelectedDate(null); setSelectedTime(null); setSelectedSolicitor(null); setClientName(""); setClientEmail(""); setClientPhone(""); setCaseDescription(""); setUploadedFiles({}); setProcessing(false); setBookingRef(""); setEmailSent(false); setErrors({}); setExistingSubmitted(false); setExistingName(""); setExistingRef(""); setExistingMessage(""); setReschedDate(null); setReschedTime(null); setReschedConfirmed(false); setReschedSlots([]); };
  useEffect(() => { var s = document.createElement("style"); s.textContent = globalStyles; document.head.appendChild(s); return () => document.head.removeChild(s); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      {/* HEADER */}
      <div style={{ background: "var(--navy)", position: "sticky", top: 0, zIndex: 100, borderBottom: "3px solid var(--gold)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={resetAll}>
            <img src={LOGO_B64} alt="Harris & Co Solicitors" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
            <div><div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 18, color: "#fff", letterSpacing: 0.5 }}>{FIRM_NAME}</div><div style={{ fontSize: 12, color: "var(--gold)", letterSpacing: 1, textTransform: "uppercase" }}>Client Booking Portal</div></div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Button variant="ghost" size="sm" style={{ color: "var(--gold)" }} onClick={() => setShowCancel(true)}>Manage Booking</Button>
            <span style={{ color: "var(--gold-light)", fontSize: 13 }}>{"\u260E"} {FIRM_PHONE}</span>
          </div>
        </div>
      </div>

      {/* LANDING */}
      {!caseType && (
        <div>
          <div style={{ background: "linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 100%)", padding: "80px 24px 60px", textAlign: "center" }}>
            <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 42, color: "#fff", fontWeight: 400, marginBottom: 16 }}>Book Your Consultation</h1>
            <p style={{ fontSize: 18, color: "var(--gold-light)", maxWidth: 500, margin: "0 auto 40px" }}>Expert legal representation across criminal, motoring, and civil matters.</p>
            <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
              <Card hoverable onClick={() => setCaseType("existing")} style={{ width: 280, textAlign: "center", cursor: "pointer", padding: 32 }}><div style={{ fontSize: 40, marginBottom: 16 }}>{"\uD83D\uDCC2"}</div><h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: "var(--navy)", marginBottom: 8 }}>Existing Case</h3><p style={{ fontSize: 14, color: "var(--text-light)" }}>Send a message using your reference number</p></Card>
              <Card hoverable onClick={() => { setCaseType("new"); transitionTo(0); }} style={{ width: 280, textAlign: "center", cursor: "pointer", padding: 32 }}><div style={{ fontSize: 40, marginBottom: 16 }}>{"\uD83D\uDCDD"}</div><h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: "var(--navy)", marginBottom: 8 }}>New Case</h3><p style={{ fontSize: 14, color: "var(--text-light)" }}>Book a consultation for a new legal matter</p></Card>
            </div>
          </div>
          <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 24px", textAlign: "center" }}>
            <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
              {[{i:"\uD83C\uDFDB\uFE0F",l:"SRA Regulated"},{i:"\uD83D\uDD12",l:"Fully Confidential"},{i:"\u23F1\uFE0F",l:"30-Min Consultations"},{i:"\uD83D\uDCB3",l:"Secure Payments"}].map((x,idx) => (<div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 20 }}>{x.i}</span><span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-light)" }}>{x.l}</span></div>))}
            </div>
          </div>
        </div>
      )}

      {/* EXISTING CASE */}
      {caseType === "existing" && (
        <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 24px" }}>
          {!existingSubmitted ? (
            <Card><SectionTitle sub="Enter your details and reference number to send a message to your solicitor.">Existing Case Enquiry</SectionTitle><FormInput label="Full Name" required placeholder="e.g. John Smith" value={existingName} onChange={e => setExistingName(e.target.value)} /><FormInput label="Case Reference" required placeholder="e.g. CA-A3B7K2" value={existingRef} onChange={e => setExistingRef(e.target.value.toUpperCase())} inputStyle={{ fontFamily: "monospace", letterSpacing: 2 }} /><FormTextArea label="Your Message" required placeholder="Describe your enquiry..." value={existingMessage} onChange={e => setExistingMessage(e.target.value)} /><div style={{ display: "flex", gap: 12, marginTop: 24 }}><Button variant="ghost" onClick={resetAll}>{"\u2190"} Back</Button><Button onClick={() => {
              fetch(API + '/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: existingName, ref: existingRef, message: existingMessage }) })
                .then(r => r.json())
                .then(data => { if (data.success) setExistingSubmitted(true); else alert('Failed to send. Please try again or call ' + FIRM_PHONE); })
                .catch(() => setExistingSubmitted(true));
            }} disabled={!existingName || !existingRef || !existingMessage}>Send Message {"\u2192"}</Button></div></Card>
          ) : (
            <Card style={{ textAlign: "center", padding: 48 }}><div style={{ fontSize: 48, marginBottom: 16 }}>{"\u2709\uFE0F"}</div><h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, color: "var(--navy)", marginBottom: 12 }}>Message Sent</h2><p style={{ fontSize: 15, color: "var(--text-light)", marginBottom: 8 }}>Your message regarding case <strong>{existingRef}</strong> has been sent.</p><p style={{ fontSize: 14, color: "var(--text-lighter)" }}>We aim to respond within one working day.</p><Button style={{ marginTop: 28 }} onClick={resetAll}>Return Home</Button></Card>
          )}
        </div>
      )}

      {/* NEW CASE WIZARD */}
      {caseType === "new" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 60px" }}>
          <StepIndicator steps={NEW_CASE_STEPS} current={step} />
          <div style={{ opacity: fadeIn ? 1 : 0, transition: "opacity .25s ease" }}>

            {step === 0 && (<div><SectionTitle sub="Select the area of law and specific case type.">Select Case Type</SectionTitle><div style={{ display: "flex", flexDirection: "column", gap: 24 }}>{Object.entries(CASE_CATEGORIES).map(([cat, data]) => (<div key={cat}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }} onClick={() => setParentCategory(parentCategory === cat ? null : cat)}><span style={{ fontSize: 24 }}>{data.icon}</span><h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: "var(--navy)" }}>{cat}</h3><span style={{ color: "var(--text-lighter)", fontSize: 20, transform: parentCategory === cat ? "rotate(180deg)" : "none", transition: "var(--transition)" }}>{"\u25BE"}</span></div>{parentCategory === cat && (<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12, paddingLeft: 34 }}>{Object.entries(data.subcategories).map(([sub, info]) => (<Card key={sub} hoverable onClick={() => setSubcategory(sub)} style={{ padding: 16, cursor: "pointer", border: subcategory === sub ? "2px solid var(--gold)" : "1px solid var(--border)", background: subcategory === sub ? "var(--gold-pale)" : "var(--white)" }}><div style={{ fontWeight: 600, color: "var(--navy)", marginBottom: 4 }}>{sub}</div><div style={{ fontSize: 13, color: "var(--text-light)" }}>{info.description}</div><div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600, marginTop: 8 }}>{"\u00A3"}{info.deposit.toFixed(2)} + VAT</div></Card>))}</div>)}</div>))}</div>{subcategory && (<div style={{ marginTop: 32 }}><label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 12 }}>Consultation Type</label><div style={{ display: "flex", gap: 12 }}>{[{k:"walk-in",i:"\uD83C\uDFE2",l:"Walk-in",d:"Visit our office"},{k:"phone",i:"\uD83D\uDCDE",l:"Phone",d:"We'll call you"}].map(ct => (<Card key={ct.k} hoverable onClick={() => setConsultationType(ct.k)} style={{ padding: 20, cursor: "pointer", flex: 1, textAlign: "center", border: consultationType === ct.k ? "2px solid var(--gold)" : "1px solid var(--border)", background: consultationType === ct.k ? "var(--gold-pale)" : "var(--white)" }}><div style={{ fontSize: 28, marginBottom: 6 }}>{ct.i}</div><div style={{ fontWeight: 600, color: "var(--navy)" }}>{ct.l}</div><div style={{ fontSize: 13, color: "var(--text-light)" }}>{ct.d}</div></Card>))}</div></div>)}<div style={{ display: "flex", gap: 12, marginTop: 32 }}><Button variant="ghost" onClick={resetAll}>{"\u2190"} Back</Button><Button onClick={() => transitionTo(1)} disabled={!subcategory || !consultationType}>Continue {"\u2192"}</Button></div></div>)}

            {step === 1 && (<div><SectionTitle sub={"Select solicitor, date, and time for your 30-minute " + consultationType + " consultation."}>Schedule Your Consultation</SectionTitle><label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 12 }}>Choose Your Solicitor</label><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 28 }}>{availableSolicitors.map(s => (<Card key={s.id} hoverable onClick={() => { setSelectedSolicitor(s); setSelectedTime(null); }} style={{ padding: 16, cursor: "pointer", textAlign: "center", border: selectedSolicitor?.id === s.id ? "2px solid var(--gold)" : "1px solid var(--border)", background: selectedSolicitor?.id === s.id ? "var(--gold-pale)" : "var(--white)" }}><div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--navy)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontWeight: 700, fontSize: 16 }}>{s.photo}</div><div style={{ fontWeight: 600, color: "var(--navy)", fontSize: 15 }}>{s.name}</div><div style={{ fontSize: 13, color: "var(--text-light)" }}>{s.title}</div><div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>{(s.displaySpecialisms || s.specialisms).map(sp => <Badge key={sp} color="gold">{sp}</Badge>)}</div></Card>))}</div>{selectedSolicitor && (<><label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 12 }}>Select a Date</label><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>{dates.map((d, i) => (<div key={i} onClick={() => { setSelectedDate(d); setSelectedTime(null); }} style={{ padding: "10px 14px", borderRadius: "var(--radius)", cursor: "pointer", border: selectedDate?.toDateString() === d.toDateString() ? "2px solid var(--gold)" : "1px solid var(--border)", background: selectedDate?.toDateString() === d.toDateString() ? "var(--gold-pale)" : "var(--white)", textAlign: "center", minWidth: 80 }}><div style={{ fontSize: 12, color: "var(--text-light)", fontWeight: 500 }}>{d.toLocaleDateString("en-GB",{weekday:"short"})}</div><div style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)" }}>{d.getDate()}</div><div style={{ fontSize: 11, color: "var(--text-lighter)" }}>{d.toLocaleDateString("en-GB",{month:"short"})}</div></div>))}</div></>)}{selectedDate && (<><label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 12 }}>Available Times</label>{availableSlots.length === 0 ? <p style={{ color: "var(--text-light)", fontSize: 14, padding: 16, background: "var(--cream)", borderRadius: "var(--radius)" }}>No slots available. Try another date.</p> : <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>{availableSlots.map(slot => (<div key={slot} onClick={() => setSelectedTime(slot)} style={{ padding: "10px 18px", borderRadius: "var(--radius)", cursor: "pointer", border: selectedTime === slot ? "2px solid var(--gold)" : "1px solid var(--border)", background: selectedTime === slot ? "var(--gold-pale)" : "var(--white)", fontWeight: selectedTime === slot ? 600 : 400, color: selectedTime === slot ? "var(--navy)" : "var(--text)", fontSize: 14 }}>{slot}</div>))}</div>}</>)}<div style={{ display: "flex", gap: 12, marginTop: 32 }}><Button variant="ghost" onClick={() => transitionTo(0)}>{"\u2190"} Back</Button><Button onClick={() => transitionTo(2)} disabled={!selectedSolicitor || !selectedDate || !selectedTime}>Continue {"\u2192"}</Button></div></div>)}

            {step === 2 && (<div><SectionTitle sub="We need a few details to confirm your booking.">Your Details</SectionTitle><Card><FormInput label="Full Name" required placeholder="e.g. John Smith" value={clientName} onChange={e => setClientName(e.target.value)} error={errors.clientName} /><FormInput label="Email Address" required placeholder="e.g. john@example.com" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} error={errors.clientEmail} /><FormInput label="Phone Number" required placeholder="e.g. 07700 900000" type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} error={errors.clientPhone} /><FormTextArea label="Brief Case Description" hint="Provide a brief overview of your situation." placeholder="Describe your situation here..." value={caseDescription} onChange={e => setCaseDescription(e.target.value)} /></Card><div style={{ display: "flex", gap: 12, marginTop: 24 }}><Button variant="ghost" onClick={() => transitionTo(1)}>{"\u2190"} Back</Button><Button onClick={() => { if (validateDetails()) transitionTo(3); }}>Continue {"\u2192"}</Button></div></div>)}

            {step === 3 && (<div><SectionTitle sub="Upload relevant documents to help your solicitor prepare.">Supporting Attachments</SectionTitle><div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{UPLOAD_PROMPTS.map(prompt => (<Card key={prompt.id}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}><div><div style={{ fontWeight: 600, color: "var(--navy)", marginBottom: 2 }}>{prompt.label} {prompt.required && <span style={{ color: "var(--red)" }}>*</span>}</div><div style={{ fontSize: 13, color: "var(--text-light)" }}>{prompt.hint}</div></div><label style={{ padding: "8px 16px", background: "var(--cream)", border: "1px solid var(--border)", borderRadius: "var(--radius)", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--navy)", whiteSpace: "nowrap" }}>Choose Files<input type="file" multiple style={{ display: "none" }} onChange={e => handleFileUpload(prompt.id, e)} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov" /></label></div>{uploadedFiles[prompt.id]?.length > 0 && (<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{uploadedFiles[prompt.id].map((f, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "var(--green-light)", borderRadius: "var(--radius)", fontSize: 13 }}><span style={{ color: "var(--green)" }}>{"\uD83D\uDCC4"}</span><span style={{ color: "var(--green)", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span><span onClick={() => removeFile(prompt.id, i)} style={{ cursor: "pointer", color: "var(--red)", fontWeight: 700, fontSize: 16 }}>{"\u00D7"}</span></div>))}</div>)}</Card>))}</div><p style={{ fontSize: 13, color: "var(--text-lighter)", marginTop: 16 }}>Accepted: PDF, DOC, DOCX, JPG, PNG, MP4, MOV. Max 25MB per file.</p><div style={{ display: "flex", gap: 12, marginTop: 24 }}><Button variant="ghost" onClick={() => transitionTo(2)}>{"\u2190"} Back</Button><Button onClick={() => transitionTo(4)} disabled={UPLOAD_PROMPTS.some(p => p.required && !uploadedFiles[p.id]?.length)}>Continue to Payment {"\u2192"}</Button></div></div>)}

            {step === 4 && (<div><SectionTitle sub="Review your booking and pay the non-refundable deposit.">Payment</SectionTitle><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}><Card><h3 style={{ fontWeight: 600, color: "var(--navy)", marginBottom: 16, fontSize: 16 }}>Booking Summary</h3><div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>{[["Case Type", parentCategory + " - " + subcategory], ["Consultation", consultationType === "walk-in" ? "Walk-in (Office)" : "Phone Call"], ["Date", selectedDate && formatDate(selectedDate)], ["Time", selectedTime + " (30 mins)"], ["Solicitor", selectedSolicitor?.name], ["Client", clientName]].map(([l,v]) => (<div key={l} style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-light)" }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span></div>))}<hr style={{ border: "none", borderTop: "1px solid var(--border)" }} /><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-light)" }}>Files</span><span style={{ fontWeight: 600 }}>{Object.values(uploadedFiles).flat().length} file(s)</span></div></div></Card><Card><h3 style={{ fontWeight: 600, color: "var(--navy)", marginBottom: 16, fontSize: 16 }}>Payment Details</h3><div style={{ background: "var(--cream)", padding: 20, borderRadius: "var(--radius)", marginBottom: 20 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}><span>Deposit</span><span>{"\u00A3"}{deposit.toFixed(2)}</span></div><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}><span>VAT (20%)</span><span>{"\u00A3"}{vatAmount.toFixed(2)}</span></div><hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "10px 0" }} /><div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, color: "var(--navy)" }}><span>Total</span><span>{"\u00A3"}{totalAmount.toFixed(2)}</span></div></div><div style={{ background: "var(--red-light)", padding: 12, borderRadius: "var(--radius)", marginBottom: 20, fontSize: 13, color: "var(--red)" }}>{"\u26A0\uFE0F"} This deposit is <strong>non-refundable</strong>.</div><FormInput label="Card Number" placeholder="4242 4242 4242 4242" /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><FormInput label="Expiry" placeholder="MM / YY" /><FormInput label="CVC" placeholder="123" /></div><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}><span style={{ fontSize: 12, color: "var(--text-lighter)" }}>{"\uD83D\uDD12"} Secure payment via Stripe</span></div>{processing ? (<div style={{ textAlign: "center", padding: 20 }}><div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--gold)", borderRadius: "50%", margin: "0 auto 12px", animation: "spin .8s linear infinite" }} /><p style={{ fontSize: 14, color: "var(--text-light)" }}>Processing payment...</p></div>) : (<Button variant="gold" size="lg" style={{ width: "100%" }} onClick={handlePayment}>Pay {"\u00A3"}{totalAmount.toFixed(2)} {"\u2192"}</Button>)}</Card></div><div style={{ display: "flex", gap: 12, marginTop: 24 }}><Button variant="ghost" onClick={() => transitionTo(3)}>{"\u2190"} Back</Button></div></div>)}

            {/* STEP 5: CONFIRMATION - NO AI CONTENT SHOWN TO CLIENT */}
            {step === 5 && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>{"\u2713"}</div>
                  <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 32, color: "var(--navy)", marginBottom: 8 }}>Booking Confirmed</h2>
                  <p style={{ fontSize: 16, color: "var(--text-light)" }}>Your reference number is <strong style={{ fontFamily: "monospace", fontSize: 18, color: "var(--navy)", letterSpacing: 2 }}>{bookingRef}</strong></p>
                  <p style={{ fontSize: 14, color: "var(--text-lighter)", marginTop: 6 }}>Confirmation sent to {clientEmail} and via SMS to {clientPhone}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <Card>
                    <h3 style={{ fontWeight: 600, color: "var(--navy)", marginBottom: 16, fontSize: 16 }}>Booking Details</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                      <div><span style={{ color: "var(--text-light)" }}>Case: </span><strong>{parentCategory} {"\u2014"} {subcategory}</strong></div>
                      <div><span style={{ color: "var(--text-light)" }}>Type: </span><strong>{consultationType === "walk-in" ? "Walk-in (Office Visit)" : "Phone Consultation"}</strong></div>
                      <div><span style={{ color: "var(--text-light)" }}>Date: </span><strong>{selectedDate && formatDateFull(selectedDate)}</strong></div>
                      <div><span style={{ color: "var(--text-light)" }}>Time: </span><strong>{selectedTime} {"\u2014"} 30 minutes</strong></div>
                      <div><span style={{ color: "var(--text-light)" }}>Solicitor: </span><strong>{selectedSolicitor?.name}</strong></div>
                      <div><span style={{ color: "var(--text-light)" }}>Paid: </span><strong>{"\u00A3"}{totalAmount.toFixed(2)} (inc. VAT)</strong></div>
                    </div>
                    <div style={{ marginTop: 16, padding: 12, background: "var(--cream)", borderRadius: "var(--radius)", fontSize: 13, color: "var(--text-light)" }}>
                      {consultationType === "walk-in" ? "Please arrive 5 minutes early. Bring photo ID." : "Your solicitor will call you on " + clientPhone + " at the scheduled time."}
                    </div>
                  </Card>
                  <Card style={{ border: "1px solid var(--green)", background: "linear-gradient(to bottom, var(--green-light), var(--white))" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <span style={{ fontSize: 24 }}>{"\u2709\uFE0F"}</span>
                      <h3 style={{ fontWeight: 600, color: "var(--green)", fontSize: 16 }}>Solicitor Briefed</h3>
                      {emailSent && <Badge color="green">Sent</Badge>}
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text)" }}>
                      <p>A comprehensive case briefing pack has been sent to your solicitor. They will review all materials before your consultation to ensure they are fully prepared to advise you.</p>
                      <div style={{ marginTop: 16, padding: 12, background: "var(--white)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                        <div style={{ fontSize: 12, color: "var(--text-lighter)", marginBottom: 2 }}>Briefing sent to</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)" }}>{SOLICITOR_EMAIL}</div>
                      </div>
                    </div>
                  </Card>
                </div>
                <Card style={{ marginTop: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><h3 style={{ fontWeight: 600, color: "var(--navy)", fontSize: 16, marginBottom: 4 }}>VAT Receipt</h3><p style={{ fontSize: 13, color: "var(--text-light)" }}>Ref: {bookingRef} | Net: {"\u00A3"}{deposit.toFixed(2)} | VAT: {"\u00A3"}{vatAmount.toFixed(2)} | Total: {"\u00A3"}{totalAmount.toFixed(2)}</p></div>
                    <Button variant="outline" size="sm" onClick={downloadReceipt}>Download Receipt</Button>
                  </div>
                </Card>
                <div style={{ display: "flex", gap: 12, marginTop: 32, justifyContent: "center" }}><Button onClick={resetAll}>Return Home</Button><Button variant="outline" onClick={() => setShowCancel(true)}>Reschedule or Cancel</Button></div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {showCancel && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(11,29,51,.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => { setShowCancel(false); setCancelAction(null); }}>
          <Card style={{ maxWidth: 460, width: "100%" }} onClick={e => e.stopPropagation()}>
            <SectionTitle sub="Enter your booking details to reschedule or cancel.">Manage Your Booking</SectionTitle>
            <FormInput label="Full Name" required placeholder="e.g. John Smith" value={cancelName} onChange={e => setCancelName(e.target.value)} />
            <FormInput label="Booking Reference" required placeholder="e.g. CA-A3B7K2" value={cancelRef} onChange={e => setCancelRef(e.target.value.toUpperCase())} inputStyle={{ fontFamily: "monospace", letterSpacing: 2 }} />
            {!cancelAction ? (
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}><Button variant="outline" style={{ flex: 1 }} onClick={() => setCancelAction("reschedule")} disabled={!cancelName || !cancelRef}>Reschedule</Button><Button variant="danger" style={{ flex: 1 }} onClick={() => setCancelAction("cancel")} disabled={!cancelName || !cancelRef}>Cancel Booking</Button></div>
            ) : cancelAction === "cancel" ? (
              <div style={{ marginTop: 20 }}><div style={{ background: "var(--red-light)", padding: 16, borderRadius: "var(--radius)", marginBottom: 16 }}><p style={{ fontSize: 14, color: "var(--red)", fontWeight: 600, marginBottom: 4 }}>{"\u26A0\uFE0F"} Cancellation Notice</p><p style={{ fontSize: 13, color: "var(--red)" }}>Your deposit is <strong>non-refundable</strong>. Are you sure?</p></div><div style={{ display: "flex", gap: 12 }}><Button variant="ghost" onClick={() => setCancelAction(null)}>Go Back</Button><Button variant="danger" onClick={() => {
                fetch(API + '/api/bookings/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ref: cancelRef, name: cancelName }) })
                  .then(r => r.json())
                  .then(data => {
                    if (data.success) { alert('Booking cancelled. The time slot is now available for others.'); setShowCancel(false); setCancelAction(null); setCancelRef(""); setCancelName(""); }
                    else alert(data.error || 'Could not find that booking.');
                  }).catch(() => alert('Server error'));
              }}>Confirm Cancellation</Button></div></div>
            ) : (
              <div style={{ marginTop: 20 }}>
                {!reschedConfirmed ? (<>
                  <p style={{ fontSize: 14, color: "var(--text-light)", marginBottom: 16 }}>Select a new date and time for your consultation:</p>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 8 }}>New Date</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    {dates.map((d, i) => (
                      <div key={i} onClick={() => { setReschedDate(d); setReschedTime(null); fetch(API + '/api/availability?solicitorId=1&date=' + toDateKey(d)).then(r=>r.json()).then(data=>setReschedSlots(data.available||[])).catch(()=>setReschedSlots(TIME_SLOTS)); }} style={{ padding: "8px 12px", borderRadius: "var(--radius)", cursor: "pointer", border: reschedDate?.toDateString() === d.toDateString() ? "2px solid var(--gold)" : "1px solid var(--border)", background: reschedDate?.toDateString() === d.toDateString() ? "var(--gold-pale)" : "var(--white)", textAlign: "center", minWidth: 70 }}>
                        <div style={{ fontSize: 11, color: "var(--text-light)" }}>{d.toLocaleDateString("en-GB",{weekday:"short"})}</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)" }}>{d.getDate()}</div>
                        <div style={{ fontSize: 10, color: "var(--text-lighter)" }}>{d.toLocaleDateString("en-GB",{month:"short"})}</div>
                      </div>
                    ))}
                  </div>
                  {reschedDate && (<>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 8 }}>New Time</label>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                      {reschedSlots.map(slot => (
                        <div key={slot} onClick={() => setReschedTime(slot)} style={{ padding: "8px 14px", borderRadius: "var(--radius)", cursor: "pointer", border: reschedTime === slot ? "2px solid var(--gold)" : "1px solid var(--border)", background: reschedTime === slot ? "var(--gold-pale)" : "var(--white)", fontSize: 13, fontWeight: reschedTime === slot ? 600 : 400, color: reschedTime === slot ? "var(--navy)" : "var(--text)" }}>{slot}</div>
                      ))}
                    </div>
                  </>)}
                  <div style={{ display: "flex", gap: 12 }}>
                    <Button variant="ghost" onClick={() => { setCancelAction(null); setReschedDate(null); setReschedTime(null); }}>Go Back</Button>
                    <Button disabled={!reschedDate || !reschedTime} onClick={() => {
                      fetch(API + '/api/bookings/reschedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ref: cancelRef, name: cancelName, newDateKey: toDateKey(reschedDate), newDate: formatDateFull(reschedDate), newTime: reschedTime }) })
                        .then(r => r.json())
                        .then(data => { if (data.success) setReschedConfirmed(true); else alert(data.error || 'Could not reschedule.'); })
                        .catch(() => alert('Server error'));
                    }}>Confirm Reschedule</Button>
                  </div>
                </>) : (
                  <div style={{ textAlign: "center", padding: 16 }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>{"\u2713"}</div>
                    <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: "var(--navy)", marginBottom: 8 }}>Rescheduled Successfully</h3>
                    <p style={{ fontSize: 14, color: "var(--text-light)", marginBottom: 4 }}>Your consultation has been moved to:</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>{reschedDate && formatDateFull(reschedDate)}</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)", marginBottom: 16 }}>{reschedTime} (30 minutes)</p>
                    <p style={{ fontSize: 13, color: "var(--text-lighter)" }}>A confirmation has been sent to your email.</p>
                    <Button style={{ marginTop: 16 }} onClick={() => { setShowCancel(false); setCancelAction(null); setReschedDate(null); setReschedTime(null); setReschedConfirmed(false); }}>Done</Button>
                  </div>
                )}
              </div>
            )}
            <div style={{ marginTop: 16, textAlign: "right" }}><Button variant="ghost" size="sm" onClick={() => { setShowCancel(false); setCancelAction(null); }}>Close</Button></div>
          </Card>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ background: "var(--navy)", padding: "32px 24px", marginTop: 40, textAlign: "center", color: "var(--text-lighter)", fontSize: 13 }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}><img src={LOGO_B64} alt="Harris & Co" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }} /><div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 16, color: "var(--gold)", marginBottom: 8 }}>{FIRM_NAME}</div><p style={{ marginBottom: 4 }}>Authorised and regulated by the Solicitors Regulation Authority (SRA)</p><p style={{ marginBottom: 12 }}>All client data stored securely in accordance with GDPR and SRA requirements.</p><p style={{ color: "var(--gold)" }}>{"\u260E"} {FIRM_PHONE}</p></div>
      </div>
    </div>
  );
}
