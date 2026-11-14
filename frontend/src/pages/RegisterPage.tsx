import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import ringVideo from '../assets/Ring.mp4'
import './RegisterPage.css'

type CategoryId = 'school' | 'senior' | 'diploma' | 'undergrad' | 'postgrad'
type Stage = 0 | 1 | 2 | 3 | 4 | 5 | 6
type TeamMember = {
  id: string
  name: string
  email: string
  category: string
  institution: string
}
type RegistrationData = {
  category: CategoryId | ''
  fullName: string
  email: string
  mobile: string
  city: string
  state: string
  institution: string
  educationLevel: string
  course: string
  academicStage: string
  institutionType: string
  interests: string[]
  participationMode: 'individual' | 'team' | ''
  teamName: string
  teamMembers: TeamMember[]
}

const INITIAL_DATA: RegistrationData = {
  category: '',
  fullName: '',
  email: '',
  mobile: '',
  city: '',
  state: '',
  institution: '',
  educationLevel: '',
  course: '',
  academicStage: '',
  institutionType: '',
  interests: [],
  participationMode: '',
  teamName: '',
  teamMembers: [],
}

const CATEGORIES: {
  id: CategoryId
  number: string
  title: string
  description: string
  icon: 'book' | 'spark' | 'tool' | 'degree' | 'research'
}[] = [
  {
    id: 'school',
    number: '01',
    title: 'CLASSES 8–10',
    description: 'For school students from Classes 8 to 10.',
    icon: 'book',
  },
  {
    id: 'senior',
    number: '02',
    title: 'CLASSES 11–12 + DROPOUTS',
    description: 'For higher secondary students and dropouts.',
    icon: 'spark',
  },
  {
    id: 'diploma',
    number: '03',
    title: 'DIPLOMA + ITI',
    description: 'For diploma and ITI students.',
    icon: 'tool',
  },
  {
    id: 'undergrad',
    number: '04',
    title: 'UNDERGRADUATE',
    description: 'For students pursuing any undergraduate degree.',
    icon: 'degree',
  },
  {
    id: 'postgrad',
    number: '05',
    title: 'POSTGRADUATE + PhD',
    description: 'For students pursuing postgraduate or doctoral programmes.',
    icon: 'research',
  },
]

const INTERESTS = [
  ['HACKATHON', 'Build fast. Test bold ideas.', 'code'],
  ['RESEARCH & INNOVATION', 'Explore questions that matter.', 'atom'],
  ['PROJECT SHOWCASE', 'Present a working outcome.', 'cube'],
  ['IDEA / PITCH PRESENTATION', 'Make your vision understood.', 'signal'],
] as const

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

const STAGES = ['CATEGORY', 'DETAILS', 'EDUCATION', 'PARTICIPATION', 'REVIEW']
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    book: <><path d="M4 5.5c3.2-.7 5.8.2 8 2.2v11c-2.2-2-4.8-2.9-8-2.2z" /><path d="M20 5.5c-3.2-.7-5.8.2-8 2.2v11c2.2-2 4.8-2.9 8-2.2z" /></>,
    spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" /></>,
    tool: <><path d="M14.7 6.3a4.5 4.5 0 0 0-5.9 5.9l-5.1 5.1a1.4 1.4 0 0 0 2 2l5.1-5.1a4.5 4.5 0 0 0 5.9-5.9l-2.6 2.6-2.4-.6-.6-2.4z" /></>,
    degree: <><path d="m3 9 9-5 9 5-9 5z" /><path d="M7 12.2V17c2.8 2 7.2 2 10 0v-4.8M21 9v7" /></>,
    research: <><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 5 5M10.5 8v5M8 10.5h5" /></>,
    code: <><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></>,
    atom: <><circle cx="12" cy="12" r="1.4" /><ellipse cx="12" cy="12" rx="9" ry="3.6" /><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" /></>,
    cube: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9" /></>,
    signal: <><path d="M4 17h3M4 12h7M4 7h11" /><path d="m16 12 4-4M20 8v3M20 8h-3" /></>,
    check: <path d="m5 12 4.2 4.2L19 6.5" />,
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    back: <path d="M19 12H5m5-5-5 5 5 5" />,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function BrandHeader({ onReturnHome }: { onReturnHome?: () => void }) {
  return (
    <header className="site-header">
      <button
        className="wordmark"
        type="button"
        onClick={onReturnHome ?? (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
        aria-label="PARADIGM home"
      >
        PARADIGM<sup>®</sup>
      </button>
      <div className="header-nav-wrap">
        {onReturnHome && (
          <button
            className="return-home-btn mono"
            type="button"
            onClick={onReturnHome}
            aria-label="Return to Homepage"
          >
            ← BACK TO PARADIGM
          </button>
        )}
        <span className="header-meta">REGISTRATION <i /> 2026</span>
      </div>
    </header>
  )
}

function Progress({ stage }: { stage: number }) {
  return (
    <div className="progress-shell" aria-label={`Registration step ${stage} of 5`}>
      <div className="stage-count">
        <span className="stage-count-num" key={stage}>0{stage}</span>
        <span className="stage-count-denom"> / 05</span>
      </div>
      <div className="progress-track">
        {STAGES.map((label, index) => {
          const number = index + 1
          const complete = number < stage
          const active = number === stage
          return (
            <div className={`progress-item ${active ? 'active' : ''} ${complete ? 'complete' : ''}`} key={label}>
              <span className="progress-number">{complete ? <Icon name="check" size={13} /> : `0${number}`}</span>
              <span className="progress-label">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KineticHeading({ title }: { title: string }) {
  const words = useMemo(() => title.split(' '), [title])
  return (
    <h1 className="kinetic-heading" aria-label={title}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="kinetic-word-wrap">
            <span
              className="kinetic-word"
              style={{ animationDelay: `${0.18 + index * 0.065}s` }}
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </h1>
  )
}

function StageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="stage-intro">
      <p className="eyebrow stage-eyebrow">
        <span className="eyebrow-accent-line" aria-hidden="true" />
        <span className="eyebrow-text">{eyebrow}</span>
      </p>
      <KineticHeading title={title} />
      <p className="stage-description">{description}</p>
    </div>
  )
}

function Button({
  children,
  variant = 'primary',
  disabled,
  type = 'button',
  onClick,
  loading,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'text'
  disabled?: boolean
  type?: 'button' | 'submit'
  onClick?: () => void
  loading?: boolean
}) {
  return (
    <button className={`button button--${variant}`} type={type} disabled={disabled || loading} onClick={onClick}>
      {loading ? <span className="button-loader" /> : children}
    </button>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  required = true,
  children,
  className = '',
}: {
  label: string
  name: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  error?: string
  type?: string
  required?: boolean
  children?: ReactNode
  className?: string
}) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">{label} {required && <b>*</b>}</span>
      {children ?? (
        <input
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange?.(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      {error && <span className="field-error" id={`${name}-error`}>{error}</span>}
    </label>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  required = true,
  className = '',
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  error?: string
  required?: boolean
  className?: string
}) {
  return (
    <Field label={label} name={name} error={error} required={required} className={className}>
      <div className="select-wrap">
        <select name={name} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)}>
          <option value="">{placeholder}</option>
          {options.map((option) => <option value={option} key={option}>{option}</option>)}
        </select>
      </div>
    </Field>
  )
}

function FormActions({ back, next, disabled = false, nextLabel = 'CONTINUE' }: { back: () => void; next: () => void; disabled?: boolean; nextLabel?: string }) {
  return (
    <div className="form-actions scroll-reveal">
      <Button variant="secondary" onClick={back}><Icon name="back" size={18} /> BACK</Button>
      <Button onClick={next} disabled={disabled}>{nextLabel} <Icon name="arrow" size={18} /></Button>
    </div>
  )
}

function CategoryScreen({ data, update, back, next }: { data: RegistrationData; update: (patch: Partial<RegistrationData>) => void; back: () => void; next: () => void }) {
  return (
    <>
      <StageIntro eyebrow="01 / PARTICIPANT CATEGORY" title="WHO ARE YOU?" description="Choose the category that best represents your current educational stage." />
      <div className="category-grid">
        {CATEGORIES.map((category) => {
          const selected = data.category === category.id
          return (
            <button
              className={`category-card ${selected ? 'selected' : ''}`}
              type="button"
              aria-pressed={selected}
              onClick={() => update({ category: category.id, educationLevel: '', course: '', academicStage: '' })}
              key={category.id}
            >
              <span className="card-number">{category.number}</span>
              <span className="card-icon"><Icon name={category.icon} size={26} /></span>
              <span className="card-copy">
                <strong>{category.title}</strong>
                <small>{category.description}</small>
              </span>
              <span className="selection-mark"><Icon name="check" size={15} /></span>
            </button>
          )
        })}
      </div>
      <FormActions back={back} next={next} disabled={!data.category} />
    </>
  )
}

function PersonalScreen({ data, update, errors, back, next }: ScreenProps) {
  return (
    <>
      <StageIntro eyebrow="02 / PERSONAL DETAILS" title="LET'S GET TO KNOW YOU." description="Tell us a little about yourself." />
      <div className="form-grid">
        <Field className="span-2" label="Full Name" name="fullName" value={data.fullName} onChange={(fullName) => update({ fullName })} placeholder="Your full name" error={errors.fullName} />
        <Field label="Email Address" name="email" value={data.email} onChange={(email) => update({ email })} placeholder="you@example.com" type="email" error={errors.email} />
        <Field label="Mobile Number" name="mobile" error={errors.mobile}>
          <div className="phone-input">
            <span>IN&nbsp; +91</span>
            <input name="mobile" type="tel" inputMode="numeric" maxLength={10} value={data.mobile} onChange={(event) => update({ mobile: event.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit number" aria-invalid={Boolean(errors.mobile)} />
          </div>
        </Field>
        <Field label="City" name="city" value={data.city} onChange={(city) => update({ city })} placeholder="Your city" error={errors.city} />
        <SelectField label="State / Union Territory" name="state" value={data.state} onChange={(state) => update({ state })} options={INDIAN_STATES} placeholder="Select state" error={errors.state} />
      </div>
      <FormActions back={back} next={next} />
    </>
  )
}

type ScreenProps = {
  data: RegistrationData
  update: (patch: Partial<RegistrationData>) => void
  errors: Record<string, string>
  back: () => void
  next: () => void
}

function EducationScreen({ data, update, errors, back, next }: ScreenProps) {
  const simpleOptions = data.category === 'school'
    ? ['Class 8', 'Class 9', 'Class 10']
    : ['Class 11', 'Class 12', 'Dropout']
  const isSimple = data.category === 'school' || data.category === 'senior'
  const stageOptions = data.category === 'diploma'
    ? ['First Year', 'Second Year', 'Third Year', 'Completed']
    : data.category === 'undergrad'
      ? ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Fifth Year', 'Completed']
      : ['First Year', 'Second Year', 'Third Year+', 'Research Scholar', 'Completed']
  return (
    <>
      <StageIntro eyebrow="03 / EDUCATION DETAILS" title="WHERE DO YOU STUDY?" description="Tell us about your current educational background." />
      <div className="form-grid">
        <Field className="span-2" label="Institution / School / College Name" name="institution" value={data.institution} onChange={(institution) => update({ institution })} placeholder="Enter institution name" error={errors.institution} />
        {isSimple ? (
          <SelectField className="span-2" label="Current Class / Stage" name="educationLevel" value={data.educationLevel} onChange={(educationLevel) => update({ educationLevel })} options={simpleOptions} error={errors.educationLevel} />
        ) : (
          <>
            <Field label={data.category === 'diploma' ? 'Diploma / ITI Course' : 'Course / Programme'} name="course" value={data.course} onChange={(course) => update({ course })} placeholder={data.category === 'diploma' ? 'e.g. Electrician, Civil Engineering' : data.category === 'undergrad' ? 'e.g. B.Tech Computer Science' : 'e.g. M.Sc Physics, PhD Design'} error={errors.course} />
            <SelectField label="Current Year / Academic Stage" name="academicStage" value={data.academicStage} onChange={(academicStage) => update({ academicStage })} options={stageOptions} error={errors.academicStage} />
          </>
        )}
        <SelectField className="span-2" label="Institution Type" name="institutionType" value={data.institutionType} onChange={(institutionType) => update({ institutionType })} options={['Government School', 'Private School', 'College / University', 'Diploma / ITI Institute', 'Other']} error={errors.institutionType} />
      </div>
      <FormActions back={back} next={next} />
    </>
  )
}

function TeamMemberCard({ member, index, updateMember, remove, errors }: { member: TeamMember; index: number; updateMember: (patch: Partial<TeamMember>) => void; remove: () => void; errors: Record<string, string> }) {
  const prefix = `member-${member.id}`
  return (
    <div className="member-card">
      <div className="member-heading">
        <span>TEAM MEMBER / {String(index + 1).padStart(2, '0')}</span>
        <button type="button" onClick={remove}><Icon name="close" size={16} /> REMOVE</button>
      </div>
      <div className="form-grid">
        <Field label="Full Name" name={`${prefix}-name`} value={member.name} onChange={(name) => updateMember({ name })} placeholder="Member's full name" error={errors[`${prefix}-name`]} />
        <Field label="Email Address" name={`${prefix}-email`} value={member.email} onChange={(email) => updateMember({ email })} placeholder="Optional" type="email" required={false} error={errors[`${prefix}-email`]} />
        <SelectField label="Participant Category" name={`${prefix}-category`} value={member.category} onChange={(category) => updateMember({ category })} options={CATEGORIES.map((category) => category.title)} placeholder="Select category" error={errors[`${prefix}-category`]} />
        <Field label="Institution" name={`${prefix}-institution`} value={member.institution} onChange={(institution) => updateMember({ institution })} placeholder="Institution name" error={errors[`${prefix}-institution`]} />
      </div>
    </div>
  )
}

function ParticipationScreen({ data, update, errors, back, next }: ScreenProps) {
  const toggleInterest = (interest: string) => update({
    interests: data.interests.includes(interest)
      ? data.interests.filter((item) => item !== interest)
      : [...data.interests, interest],
  })
  const addMember = () => update({
    teamMembers: [...data.teamMembers, { id: `${Date.now()}-${Math.random()}`, name: '', email: '', category: '', institution: '' }],
  })
  const updateMember = (id: string, patch: Partial<TeamMember>) => update({
    teamMembers: data.teamMembers.map((member) => member.id === id ? { ...member, ...patch } : member),
  })
  return (
    <>
      <StageIntro eyebrow="04 / PARTICIPATION" title="WHAT DO YOU WANT TO BUILD?" description="Tell us how you would like to participate." />
      <div className="interest-grid">
        {INTERESTS.map(([title, description, icon]) => {
          const selected = data.interests.includes(title)
          return (
            <button className={`interest-card ${selected ? 'selected' : ''}`} type="button" aria-pressed={selected} onClick={() => toggleInterest(title)} key={title}>
              <Icon name={icon} size={25} />
              <span><strong>{title}</strong><small>{description}</small></span>
              <span className="selection-mark"><Icon name="check" size={14} /></span>
            </button>
          )
        })}
      </div>
      {errors.interests && <p className="section-error">{errors.interests}</p>}
      <div className="participation-mode">
        <p className="mini-heading">HOW WOULD YOU LIKE TO PARTICIPATE? <b>*</b></p>
        <div className="segmented-control">
          {(['individual', 'team'] as const).map((mode) => (
            <button className={data.participationMode === mode ? 'selected' : ''} type="button" onClick={() => update({ participationMode: mode })} key={mode}>
              <span className="radio-dot" /> {mode === 'individual' ? 'INDIVIDUAL' : 'AS A TEAM'}
            </button>
          ))}
        </div>
        {errors.participationMode && <p className="section-error">{errors.participationMode}</p>}
      </div>
      {data.participationMode === 'team' && (
        <div className="team-section scroll-reveal">
          <Field label="Team Name" name="teamName" value={data.teamName} onChange={(teamName) => update({ teamName })} placeholder="Give your team a name" error={errors.teamName} />
          <div className="team-list">
            {data.teamMembers.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                index={index}
                errors={errors}
                updateMember={(patch) => updateMember(member.id, patch)}
                remove={() => update({ teamMembers: data.teamMembers.filter((item) => item.id !== member.id) })}
              />
            ))}
          </div>
          <button className="add-member" type="button" onClick={addMember}><Icon name="plus" size={17} /> ADD TEAM MEMBER</button>
          <p className="team-note">Add as many team members as needed. No team-size restriction is applied in this preview.</p>
        </div>
      )}
      <FormActions back={back} next={next} />
    </>
  )
}

function ReviewPanel({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section className="review-panel">
      <div className="review-panel-head"><h2>{title}</h2><button type="button" onClick={onEdit}>EDIT <Icon name="arrow" size={14} /></button></div>
      <div className="review-content">{children}</div>
    </section>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return <div className="review-item"><span>{label}</span><strong>{value || '—'}</strong></div>
}

function ReviewScreen({
  data,
  goTo,
  back,
  submit,
  consent,
  setConsent,
  submitting,
}: {
  data: RegistrationData
  goTo: (stage: Stage) => void
  back: () => void
  submit: () => void
  consent: boolean
  setConsent: (value: boolean) => void
  submitting: boolean
}) {
  const category = CATEGORIES.find((item) => item.id === data.category)?.title ?? ''
  const education = data.educationLevel || [data.course, data.academicStage].filter(Boolean).join(' / ')
  return (
    <>
      <StageIntro eyebrow="05 / FINAL REVIEW" title="EVERY DETAIL MATTERS." description="Review your information before completing registration." />
      <div className="review-grid">
        <ReviewPanel title="PERSONAL DETAILS" onEdit={() => goTo(2)}>
          <ReviewItem label="Name" value={data.fullName} /><ReviewItem label="Email" value={data.email} />
          <ReviewItem label="Mobile" value={`+91 ${data.mobile}`} /><ReviewItem label="Location" value={`${data.city}, ${data.state}`} />
        </ReviewPanel>
        <ReviewPanel title="PARTICIPANT CATEGORY" onEdit={() => goTo(1)}>
          <ReviewItem label="Selected category" value={category} />
        </ReviewPanel>
        <ReviewPanel title="EDUCATION DETAILS" onEdit={() => goTo(3)}>
          <ReviewItem label="Institution" value={data.institution} /><ReviewItem label="Class / Course" value={education} />
          <ReviewItem label="Institution type" value={data.institutionType} />
        </ReviewPanel>
        <ReviewPanel title="PARTICIPATION DETAILS" onEdit={() => goTo(4)}>
          <ReviewItem label="Interests" value={data.interests.join(', ')} />
          <ReviewItem label="Participation" value={data.participationMode === 'team' ? `Team — ${data.teamName}` : 'Individual'} />
          {data.participationMode === 'team' && <ReviewItem label="Additional members" value={data.teamMembers.length ? data.teamMembers.map((member) => member.name).join(', ') : 'None added'} />}
        </ReviewPanel>
      </div>
      <label className="consent scroll-reveal">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span className="custom-checkbox"><Icon name="check" size={14} /></span>
        <span>I confirm that the information provided above is accurate.</span>
      </label>
      <p className="demo-notice scroll-reveal"><span>PROTOTYPE NOTICE</span> This preview validates your information locally. Nothing will be sent to a server.</p>
      <div className="form-actions">
        <Button variant="secondary" onClick={back}><Icon name="back" size={18} /> BACK</Button>
        <Button onClick={submit} disabled={!consent} loading={submitting}>SUBMIT REGISTRATION <Icon name="arrow" size={18} /></Button>
      </div>
    </>
  )
}

function RingVisual({
  heroRef,
}: {
  heroRef?: React.RefObject<HTMLElement | null>
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const applyPlaybackRate = () => {
      if (video.playbackRate !== 0.65) {
        video.playbackRate = 0.65
      }
    }

    applyPlaybackRate()
    video.play().catch(() => {})
    video.addEventListener('loadedmetadata', applyPlaybackRate)
    video.addEventListener('play', applyPlaybackRate)
    video.addEventListener('ratechange', applyPlaybackRate)

    return () => {
      video.removeEventListener('loadedmetadata', applyPlaybackRate)
      video.removeEventListener('play', applyPlaybackRate)
      video.removeEventListener('ratechange', applyPlaybackRate)
    }
  }, [])

  useEffect(() => {
    const hero = heroRef?.current
    const container = containerRef.current
    if (!hero || !container) return

    const isTouchOrCoarse =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isTouchOrCoarse || prefersReducedMotion) return

    let currentX = 0
    let currentY = 0
    let currentTiltX = 0
    let currentTiltY = 0
    let targetX = 0
    let targetY = 0
    let targetTiltX = 0
    let targetTiltY = 0
    let rafId: number | null = null

    const damping = 0.08

    const updateFrame = () => {
      currentX += (targetX - currentX) * damping
      currentY += (targetY - currentY) * damping
      currentTiltX += (targetTiltX - currentTiltX) * damping
      currentTiltY += (targetTiltY - currentTiltY) * damping

      container.style.setProperty('--parallax-x', `${currentX.toFixed(2)}px`)
      container.style.setProperty('--parallax-y', `${currentY.toFixed(2)}px`)
      container.style.setProperty('--tilt-x', `${currentTiltX.toFixed(2)}deg`)
      container.style.setProperty('--tilt-y', `${currentTiltY.toFixed(2)}deg`)

      const delta =
        Math.abs(targetX - currentX) +
        Math.abs(targetY - currentY) +
        Math.abs(targetTiltX - currentTiltX) +
        Math.abs(targetTiltY - currentTiltY)

      if (
        delta < 0.01 &&
        targetX === 0 &&
        targetY === 0 &&
        targetTiltX === 0 &&
        targetTiltY === 0
      ) {
        container.style.removeProperty('--parallax-x')
        container.style.removeProperty('--parallax-y')
        container.style.removeProperty('--tilt-x')
        container.style.removeProperty('--tilt-y')
        rafId = null
        return
      }

      rafId = requestAnimationFrame(updateFrame)
    }

    const startAnimation = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateFrame)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') return

      const rect = hero.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)))
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)))

      targetX = normX * 8
      targetY = normY * 6
      targetTiltX = -normY * 2
      targetTiltY = normX * 2

      startAnimation()
    }

    const onPointerLeave = () => {
      targetX = 0
      targetY = 0
      targetTiltX = 0
      targetTiltY = 0
      startAnimation()
    }

    hero.addEventListener('pointermove', onPointerMove)
    hero.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('blur', onPointerLeave)

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      hero.removeEventListener('pointermove', onPointerMove)
      hero.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('blur', onPointerLeave)
    }
  }, [heroRef])

  return (
    <div
      className="ring-visual ring-visual--hero"
      ref={containerRef}
      aria-hidden="true"
    >
      <video
        ref={(video) => {
          videoRef.current = video
          if (video) {
            video.muted = true
            video.defaultMuted = true
            video.playbackRate = 0.65
            video.play().catch(() => {})
          }
        }}
        src={ringVideo}
        autoPlay
        muted
        loop
        playsInline
        className="ring-video"
        aria-hidden="true"
      />
    </div>
  )
}

const PRINCIPLES = [
  {
    number: '01',
    title: 'EXPLORE',
    description: 'Ideas beyond boundaries.',
  },
  {
    number: '02',
    title: 'EXPERIMENT',
    description: 'Turn curiosity into action.',
  },
  {
    number: '03',
    title: 'EVOLVE',
    description: 'Shape what comes next.',
  },
] as const

const TICKER_ITEMS = [
  'THINK DIFFERENTLY',
  'QUESTION EVERYTHING',
  'CREATE TOMORROW',
] as const

function IntroScreen({ begin, onReturnHome }: { begin: () => void; onReturnHome: () => void }) {
  // Pass onReturnHome to BrandHeader
  const heroRef = useRef<HTMLElement | null>(null)

  return (
    <main className="intro-screen" ref={heroRef}>
      <BrandHeader onReturnHome={onReturnHome} />
      <div className="intro-grid" />

      <div className="hero-shell">
        <div className="hero-split">
          <div className="hero-headline-col">
            <p className="eyebrow hero-eyebrow reveal reveal--one">
              PARADIGM® / REGISTRATION PORTAL
            </p>
            <h1 className="hero-headline reveal reveal--two">
              <span className="hero-headline-line">YOUR IDEAS.</span>
              <span className="hero-headline-line">YOUR JOURNEY.</span>
            </h1>
          </div>

          <div className="hero-sculpture-col">
            <RingVisual heroRef={heroRef} />
          </div>

          <div className="hero-body-col">
            <p className="hero-supporting reveal reveal--three">
              Take the first step towards being part of something different.
            </p>
            <blockquote className="hero-manifesto reveal reveal--three">
              <span className="manifesto-line">The future doesn't wait for permission.</span>
              <span className="manifesto-line">
                It begins with <span className="manifesto-lime">a question.</span>
              </span>
            </blockquote>
            <p className="hero-description reveal reveal--three">
              A gathering of curious minds, emerging innovators and ambitious thinkers. Explore new perspectives, challenge what exists and turn possibilities into something real.
            </p>
            <div className="hero-cta-wrap reveal reveal--three">
              <Button onClick={begin}>
                BEGIN REGISTRATION <Icon name="arrow" size={19} />
              </Button>
            </div>
          </div>
        </div>

        <section className="hero-principles" aria-label="Core Principles">
          {PRINCIPLES.map((principle) => (
            <article className="principle-card" key={principle.number}>
              <div className="principle-top">
                <span className="principle-number">{principle.number}</span>
                <span className="principle-dash" aria-hidden="true">—</span>
                <h3 className="principle-title">{principle.title}</h3>
              </div>
              <p className="principle-description">{principle.description}</p>
            </article>
          ))}
        </section>
      </div>

      <div className="hero-ticker" aria-hidden="true">
        <div className="hero-ticker-track">
          {[0, 1, 2, 3].map((rep) => (
            <div className="hero-ticker-group" key={rep}>
              {TICKER_ITEMS.map((item, idx) => (
                <Fragment key={`${rep}-${idx}`}>
                  <span className="ticker-text">{item}</span>
                  <span className="ticker-separator">/</span>
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      <footer className="intro-footer">
        <div className="location-label">BERHAMPUR, ODISHA <span>/</span> INDIA</div>
        <button className="next-stage" type="button" onClick={begin} aria-label="Continue to registration">
          <span>00</span><i /><Icon name="arrow" size={17} />
        </button>
      </footer>
    </main>
  )
}

function SuccessScreen({ data, previewId, reset, home }: { data: RegistrationData; previewId: string; reset: () => void; home: () => void }) {
  const category = CATEGORIES.find((item) => item.id === data.category)?.title
  return (
    <main className="success-screen">
      <BrandHeader onReturnHome={home} />
      <div className="success-content">
        <div className="success-orbit" aria-hidden="true"><span><Icon name="check" size={42} /></span></div>
        <p className="eyebrow">REGISTRATION PREVIEW / COMPLETE</p>
        <h1>YOU'RE <em>IN.</em></h1>
        <p className="success-copy">Your registration information has been completed successfully.</p>
        <div className="preview-banner"><strong>DEMO CONFIRMATION</strong><span>This is a frontend preview, not a server-verified registration.</span></div>
        <div className="success-details">
          <ReviewItem label="Participant" value={data.fullName} />
          <ReviewItem label="Category" value={category ?? ''} />
          <ReviewItem label="Preview identifier — not an official registration number" value={previewId} />
        </div>
        <div className="success-actions">
          <Button variant="secondary" onClick={home}>RETURN TO PARADIGM</Button>
          <Button onClick={reset}>REGISTER ANOTHER PARTICIPANT <Icon name="arrow" size={18} /></Button>
        </div>
      </div>
    </main>
  )
}

// Isolated prototype adapter. Replace this function with a real API call when a backend is connected.
async function submitRegistrationPreview(_data: RegistrationData) {
  await new Promise((resolve) => window.setTimeout(resolve, 1100))
  return { previewId: `PREVIEW-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}` }
}

function loadDraft() {
  try {
    const saved = sessionStorage.getItem('paradigm-registration-draft')
    return saved ? { ...INITIAL_DATA, ...JSON.parse(saved) } as RegistrationData : INITIAL_DATA
  } catch {
    return INITIAL_DATA
  }
}

export default function RegisterPage({ onReturnHome = () => { if (typeof window !== "undefined") window.location.href = "/"; } }: { onReturnHome?: () => void }) {
  const [stage, setStage] = useState<Stage>(0)
  const [data, setData] = useState<RegistrationData>(loadDraft)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [previewId, setPreviewId] = useState('')
  const [isExiting, setIsExiting] = useState(false)
  const [exitDir, setExitDir] = useState<'forward' | 'backward'>('forward')

  useEffect(() => {
    if (stage > 0 && stage < 6) sessionStorage.setItem('paradigm-registration-draft', JSON.stringify(data))
  }, [data, stage])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stage])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    document.documentElement.classList.add('has-scroll-observer')

    const elements = document.querySelectorAll('.scroll-reveal:not(.is-revealed)')
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [stage, data.participationMode, data.teamMembers.length])

  const update = (patch: Partial<RegistrationData>) => {
    setData((current) => ({ ...current, ...patch }))
    setErrors((current) => {
      const next = { ...current }
      Object.keys(patch).forEach((key) => delete next[key])
      return next
    })
  }

  const validate = (target: number) => {
    const nextErrors: Record<string, string> = {}
    if (target === 2) {
      if (!data.fullName.trim()) nextErrors.fullName = 'Please enter your full name.'
      if (!emailPattern.test(data.email)) nextErrors.email = 'Enter a valid email address.'
      if (!/^[6-9]\d{9}$/.test(data.mobile)) nextErrors.mobile = 'Enter a valid 10-digit Indian mobile number.'
      if (!data.city.trim()) nextErrors.city = 'Please enter your city.'
      if (!data.state) nextErrors.state = 'Please select your state or union territory.'
    }
    if (target === 3) {
      if (!data.institution.trim()) nextErrors.institution = 'Please enter your institution name.'
      if (data.category === 'school' || data.category === 'senior') {
        if (!data.educationLevel) nextErrors.educationLevel = 'Please select your current class or stage.'
      } else {
        if (!data.course.trim()) nextErrors.course = 'Please enter your course or programme.'
        if (!data.academicStage) nextErrors.academicStage = 'Please select your current academic stage.'
      }
      if (!data.institutionType) nextErrors.institutionType = 'Please select an institution type.'
    }
    if (target === 4) {
      if (!data.interests.length) nextErrors.interests = 'Select at least one participation interest.'
      if (!data.participationMode) nextErrors.participationMode = 'Choose individual or team participation.'
      if (data.participationMode === 'team') {
        if (!data.teamName.trim()) nextErrors.teamName = 'Please enter a team name.'
        data.teamMembers.forEach((member) => {
          const prefix = `member-${member.id}`
          if (!member.name.trim()) nextErrors[`${prefix}-name`] = 'Enter the member’s full name.'
          if (member.email && !emailPattern.test(member.email)) nextErrors[`${prefix}-email`] = 'Enter a valid email address.'
          if (!member.category) nextErrors[`${prefix}-category`] = 'Select a participant category.'
          if (!member.institution.trim()) nextErrors[`${prefix}-institution`] = 'Enter the member’s institution.'
        })
      }
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      window.setTimeout(() => document.querySelector('[aria-invalid="true"], .section-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
      return false
    }
    return true
  }

  const transitionTo = (targetStage: Stage, direction: 'forward' | 'backward' = 'forward') => {
    if (isExiting) return
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setStage(targetStage)
      return
    }
    setIsExiting(true)
    setExitDir(direction)
    window.setTimeout(() => {
      setStage(targetStage)
      setIsExiting(false)
    }, 220)
  }

  const goNext = () => {
    if (stage === 1 && !data.category) return
    if (stage >= 2 && stage <= 4 && !validate(stage)) return
    transitionTo((stage + 1) as Stage, 'forward')
  }

  const goBack = () => {
    if (stage === 1) transitionTo(0, 'backward')
    else transitionTo((stage - 1) as Stage, 'backward')
  }

  const submit = async () => {
    if (!consent || !validate(2) || !validate(3) || !validate(4)) return
    setSubmitting(true)
    try {
      const result = await submitRegistrationPreview(data)
      setPreviewId(result.previewId)
      sessionStorage.removeItem('paradigm-registration-draft')
      transitionTo(6, 'forward')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setData(INITIAL_DATA)
    setErrors({})
    setConsent(false)
    setPreviewId('')
    sessionStorage.removeItem('paradigm-registration-draft')
    transitionTo(1, 'forward')
  }

  const screen = useMemo(() => {
    const props = { data, update, errors, back: goBack, next: goNext }
    if (stage === 1) return <CategoryScreen data={data} update={update} back={goBack} next={goNext} />
    if (stage === 2) return <PersonalScreen {...props} />
    if (stage === 3) return <EducationScreen {...props} />
    if (stage === 4) return <ParticipationScreen {...props} />
    if (stage === 5) return <ReviewScreen data={data} goTo={(target) => transitionTo(target, target < stage ? 'backward' : 'forward')} back={goBack} submit={submit} consent={consent} setConsent={setConsent} submitting={submitting} />
    return null
  }, [stage, data, errors, consent, submitting, isExiting])

  if (stage === 0) {
    return (
      <div className="paradigm-registration-portal">
        <IntroScreen begin={() => transitionTo(1, 'forward')} onReturnHome={onReturnHome} />
      </div>
    )
  }
  if (stage === 6) {
    return (
      <div className="paradigm-registration-portal">
        <SuccessScreen data={data} previewId={previewId} reset={reset} home={onReturnHome} />
      </div>
    )
  }

  return (
    <div className="paradigm-registration-portal">
      <main className="registration-screen">
        <BrandHeader onReturnHome={onReturnHome} />
      <div className="form-grid-bg" />
      <Progress stage={stage} />
      <div className="stage-shell">
        <button
          type="button"
          className="back-nav-btn"
          onClick={goBack}
          aria-label="Back to previous step"
        >
          <Icon name="back" size={15} />
          <span>BACK</span>
        </button>

        <div className={`stage-content ${isExiting ? `is-exiting is-exiting--${exitDir}` : ''}`} key={stage}>
          {screen}
        </div>
      </div>
      <footer><span>PARADIGM® 2026</span><span>THINK BEYOND THE KNOWN.</span></footer>
      </main>
    </div>
  )
}