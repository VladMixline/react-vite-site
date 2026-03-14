import { useEffect, useState } from 'react'
import './App.css'

const backImages = Object.values(
  import.meta.glob('./back/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}', {
    eager: true,
    import: 'default',
  }),
)

const mainPhotoAssets = Object.entries(
  import.meta.glob(['./fotos/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}', '!./fotos/Гамма.jpg'], {
    eager: true,
    import: 'default',
  }),
)
  .map(([path, source], index) => ({
    path,
    src: source,
    alt: getPhotoAlt(path, index),
  }))
  .sort((a, b) => {
    const nameA = a.path.replace(/^.*[/\\]/, '')
    const nameB = b.path.replace(/^.*[/\\]/, '')
    return nameA.localeCompare(nameB, undefined, { numeric: true })
  })

const carouselPhotoAssets = Object.entries(
  import.meta.glob('./fotos/карусель/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}', {
    eager: true,
    import: 'default',
  }),
)
  .map(([path, source], index) => ({
    path,
    src: source,
    alt: `Фотография карусели ${index + 1}`,
  }))
  .sort((a, b) => {
    const nameA = a.path.replace(/^.*[/\\]/, '')
    const nameB = b.path.replace(/^.*[/\\]/, '')
    return nameA.localeCompare(nameB, undefined, { numeric: true })
  })

const coupleSignature = 'Владислав & Алена Чарыковы'
const groomName = 'Владислав'
const brideName = 'Алена'
const telegramUsername = 'zhyk04'
const eventDate = '01.08.2026'
const weddingStart = new Date(2026, 7, 1, 16, 0, 0)
const heroDateParts = eventDate
  .split('.')
  .map((part, index) => (index === 2 ? part.slice(-2) : part))
const venueName = 'Банкетный зал PLES'
const venueAddress = 'Тамбов, ул. Маршала Малиновского, 39'
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(venueAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`
const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueAddress)}`

const fallbackPhotos = Array.from({ length: 8 }, () => ({ src: null, alt: '' }))

const eventDetails = [
  {
    title: '',
    value: venueName,
    meta: venueAddress,
    caption: 'Именно здесь мы хотим прожить этот красивый вечер рядом с самыми близкими людьми.',
    Icon: PlaceIcon,
  },
  {
    title: '',
    value: 'Свадебное расписание',
    schedule: [
      { time: '16:00', title: 'welcome' },
      { time: '16:30', title: 'выездная регистрация брака' },
      { time: '17:30', title: 'банкет' },
    ],
    Icon: TimeIcon,
  },
]

const paletteColors = [
  { name: 'Сливочная вуаль', tone: '#e8dfd1' },
  { name: 'Мягкий шоколад', tone: '#8f6553' },
  { name: 'Темное какао', tone: '#34231f' },
  { name: 'Черный атлас', tone: '#070707' },
  { name: 'Шалфейный шелк', tone: '#a8b091' },
  { name: 'Оливковый сатин', tone: '#707a5a' },
  { name: 'Глубокая олива', tone: '#556039' },
  { name: 'Изумрудная ночь', tone: '#0c2d23' },
]

const coordinatorMoments = [
  {
    title: 'Во время сбора гостей',
    text: 'Она направит к нужной зоне, поможет сориентироваться на площадке и подскажет по ходу вечера.',
  },
  {
    title: 'В любой момент праздника',
    text: 'Если понадобится решить организационный вопрос, можно обратиться к Ирине.',
  },
  {
    title: 'Вопросы по организации',
    text: 'Если вы планируете подготовить сюрприз — обращайтесь к Ирине в телеграмм: @irina_coordinator',
  },
]

const alcoholOptions = [
  'Вино игристое',
  'Вино красное',
  'Вино белое',
  'Самогон',
  'Коньяк',
  'Водка',
  'Ликер',
  'Безалкогольные напитки',
]

const initialFormState = {
  fullName: '',
  allergies: '',
  alcohol: [],
}

function getWeddingCountdown() {
  const remainingMs = Math.max(weddingStart.getTime() - Date.now(), 0)
  const totalSeconds = Math.floor(remainingMs / 1000)

  return {
    days: String(Math.floor(totalSeconds / 86400)).padStart(2, '0'),
    hours: String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
    seconds: String(totalSeconds % 60).padStart(2, '0'),
  }
}

function App() {
  const backgroundPhoto = backImages[0] ?? null
  const galleryPhotos = fillPhotos(mainPhotoAssets, 8)
  const carouselPhotos = fillPhotos(carouselPhotoAssets, 8)
  const invitationPhoto = findPhotoByPath(mainPhotoAssets, 'приглашение') ?? galleryPhotos[2]

  const groomPhoto = findPhotoByPath(mainPhotoAssets, 'жених') ?? galleryPhotos[0]
  const bridePhoto = findPhotoByPath(mainPhotoAssets, 'невест') ?? galleryPhotos[1] ?? galleryPhotos[0]
  const coupleProfiles = [
    {
      role: 'Жених',
      name: groomName,
      photo: groomPhoto,
      description:
        'Владислав особенно ждет этот день как возможность собрать рядом самых близких людей и прожить праздник спокойно, красиво и по-настоящему тепло.',
    },
    {
      role: 'Невеста',
      name: brideName,
      photo: bridePhoto,
      description:
        'Алена мечтает наполнить этот вечер светом, нежностью и искренними встречами, чтобы каждая улыбка и каждое объятие остались в памяти надолго.',
    },
  ]

  const [formData, setFormData] = useState(initialFormState)
  const [submitState, setSubmitState] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [countdown, setCountdown] = useState(() => getWeddingCountdown())

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountdown(getWeddingCountdown())
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setSubmitState('idle')
    setSubmitMessage('')
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleAlcoholToggle(option) {
    setSubmitState('idle')
    setSubmitMessage('')
    setFormData((current) => {
      const prev = current.alcohol
      const next = prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      return { ...current, alcohol: next }
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const telegramMessage = buildTelegramMessage(formData)

    setSubmitState('loading')
    setSubmitMessage('Отправляем ваш ответ...')

    const apiResult = await sendTelegramMessage(telegramMessage)

    if (apiResult.ok) {
      setSubmitState('success')
      setSubmitMessage('Ответ уже отправлен в Telegram. Спасибо вам.')
      setFormData(initialFormState)
      return
    }

    const fallbackResult = await openTelegramFallback(telegramMessage)

    if (fallbackResult.ok) {
      setSubmitState('fallback')
      setSubmitMessage(
        fallbackResult.copied
          ? 'Автоотправка пока недоступна: мы уже открыли Telegram и скопировали текст ответа.'
          : 'Автоотправка пока недоступна: мы уже открыли Telegram с подготовленным сообщением.',
      )
      return
    }

    setSubmitState('error')
    setSubmitMessage('Не удалось подготовить отправку. Попробуйте еще раз чуть позже.')
  }

  return (
    <main className="page">
      <div
        className={`pageBackdrop ${backgroundPhoto ? '' : 'isFallback'}`}
        aria-hidden="true"
        style={getImageStyle(backgroundPhoto)}
      />
      <div className="pageVeil" aria-hidden="true" />

      <section className="heroSection">
        <div className="heroIntro surfaceCard">
          <div className="heroRail" aria-hidden="true">
            <p className="heroDateColumn">
              {heroDateParts.map((part) => (
                <span key={part}>{part}</span>
              ))}
            </p>
            <div className="heroDivider" />
          </div>

          <div className="heroContent">
            <p className="sectionTag">Wedding Invitation</p>
            <div className="heroNamesGroup">
              <p className="heroNames heroNamePrimary">{brideName}</p>
              <p className="heroAmpersand">&amp;</p>
              <p className="heroNames heroNameSecondary">{groomName}</p>
            </div>

            <h1>С любовью приглашаем вас разделить с нами день, который мы будем помнить всегда.</h1>

            <p className="heroMainDate">{eventDate}</p>

            <p className="heroReminder">До свадьбы осталось</p>

            <div className="heroCountdown" role="list" aria-label="Отсчет до свадьбы">
              <div className="heroCountdownItem" role="listitem">
                <span className="heroCountdownValue">{countdown.days}</span>
                <span className="heroCountdownLabel">дней</span>
              </div>
              <div className="heroCountdownItem" role="listitem">
                <span className="heroCountdownValue">{countdown.hours}</span>
                <span className="heroCountdownLabel">часов</span>
              </div>
              <div className="heroCountdownItem" role="listitem">
                <span className="heroCountdownValue">{countdown.minutes}</span>
                <span className="heroCountdownLabel">минут</span>
              </div>
              <div className="heroCountdownItem" role="listitem">
                <span className="heroCountdownValue">{countdown.seconds}</span>
                <span className="heroCountdownLabel">секунд</span>
              </div>
            </div>
          </div>

          <div className="heroVisual">
            <GlassPhoto photo={invitationPhoto} className="glassPhoto heroPhoto" decorative />
          </div>
        </div>

        <PhotoMarquee photos={carouselPhotos} />
      </section>

      <section className="sectionShell" id="details">
        <div className="sectionHeader">
          <p className="sectionTag">Приглашение</p>
          <h2 className="sectionTitle">Мы будем особенно счастливы провести этот вечер рядом с вами</h2>
        </div>

        <div className="detailGrid">
          {eventDetails.map((detail) => {
            const DetailIcon = detail.Icon

            return (
              <article
                className={`detailCard surfaceCard ${detail.schedule ? 'detailCardSchedule' : ''}`}
                key={detail.title}
              >
                <div className="detailHeading">
                  <IconShell>
                    <DetailIcon />
                  </IconShell>

                  <div className="detailHeadingText">
                    {detail.title ? <p className="detailLabel">{detail.title}</p> : null}
                    <h3>{detail.value}</h3>
                  </div>
                </div>
                <div className="detailDivider" aria-hidden="true" />

                {detail.meta ? <p className="detailMetaText">{detail.meta}</p> : null}
                {detail.schedule ? (
                  <div className="detailSchedule" role="list" aria-label="Свадебное расписание">
                    {detail.schedule.map((item) => (
                      <div className="detailScheduleItem" role="listitem" key={`${item.time}-${item.title}`}>
                        <p className="detailScheduleTime">{item.time}</p>
                        <p className="detailScheduleTitle">{item.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="detailCaption">{detail.caption}</p>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section className="sectionShell">
        <div className="sectionHeader sectionHeaderTight">
          <p className="sectionTag">Жених и невеста</p>
          <h2 className="sectionTitle">Те, кто с радостью ждут встречи с вами в этот день</h2>
        </div>

        <div className="coupleShowcase">
          {coupleProfiles.map((profile) => (
            <article className="personCard" key={profile.role}>
              <GlassPhoto
                photo={profile.photo}
                className={`glassPhoto personPhoto personPortrait ${profile.role === 'Жених' ? 'personPortraitGroom' : ''}`.trim()}
              />

              <div className="personContent">
                <p className="personRole">{profile.role}</p>
                <h3>{profile.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionShell">
        <div className="coordinatorLayout">
          <div className="coordinatorCard surfaceCard">
            <div className="coordinatorIntro">
              <div className="coordinatorText">
                <p className="sectionTag">Организационная информация</p>
                <h2 className="sectionTitle sectionTitleCompact">
                  В день свадьбы рядом с вами будет координатор Ирина
                </h2>
                <p className="sectionText">
                  Нам важно, чтобы ваше прибытие и весь вечер проходили легко и спокойно,
                  поэтому организационные моменты мы доверили Ирине.
                </p>
              </div>
            </div>
          </div>

          <div className="coordinatorAside">
            <div className="coordinatorMoments">
              <div className="coordinatorSteps">
                {coordinatorMoments.map((moment) => (
                  <article className="coordinatorStep" key={moment.title}>
                    <p className="coordinatorStepTitle">{moment.title}</p>
                    <p>{moment.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sectionShell">
        <div className="mapLayout">
          <div className="mapFrame surfaceCard">
            <iframe
              title="Карта площадки PLES"
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mapPanel surfaceCard">
            <p className="sectionText">
              Мы отметили банкетный зал PLES на карте, чтобы вы могли заранее открыть
              маршрут и приехать к нам спокойно, наслаждаясь ожиданием красивого вечера.
            </p>

            <div className="mapAddress">
              <p>PLES</p>
              <h3>{venueAddress}</h3>
            </div>

            <div className="mapActions">
              <a className="primaryButton" href={routeUrl} target="_blank" rel="noreferrer">
                Построить маршрут
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="sectionShell">
        <div className="dressCard surfaceCard">
          <p className="sectionTag">Dress Code</p>
          <p className="sectionText">
            Будем рады, если вы поддержите нашу цветовую палитру:
          </p>
          <div className="dressPalette" role="list" aria-label="Рекомендуемая палитра">
            {paletteColors.map((color) => (
              <div className="dressSwatch" key={color.name} title={color.name}>
                <span className="dressSwatchTone" style={{ backgroundColor: color.tone }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionShell">
        <div className="wishCard surfaceCard">
          <p className="sectionTag">Пожелание</p>
          <blockquote className="wishQuote">
            «Если вы захотите порадовать нас приятным комплиментом, вместо цветов мы с
            радостью примем бутылочку вина или шампанского».
          </blockquote>
          <blockquote className="wishQuote">
            «Мы будем искренне благодарны, если вашим подарком станет денежный вклад в нашу молодую семью».
          </blockquote>
          <p className="wishText">
            Нам очень хочется, чтобы каждый жест в этот день был теплым, красивым и
            по-настоящему душевным.
          </p>
        </div>
      </section>

      <section className="sectionShell" id="rsvp">
        <div className="formLayout">
          <div className="formSupport surfaceCard">
            <p className="sectionTag">Telegram</p>
            <h2 className="sectionTitle sectionTitleCompact">
              Мы сделали отправку формы максимально простой для гостя
            </h2>
            <p className="sectionText">
              Если Telegram-бот настроен, анкета уйдет сразу после нажатия кнопки. Если
              бот еще не подключен, мы автоматически откроем Telegram с готовым сообщением
              для @{telegramUsername}, а текст ответа подготовим без лишних действий.
            </p>

            <div className="supportPhotos supportPhotosSingle">
              <GlassPhoto photo={findPhotoByPath(mainPhotoAssets, 'телеграм') ?? galleryPhotos[0]} className="glassPhoto supportPhoto" />
            </div>
          </div>

          <form className="rsvpForm surfaceCard" onSubmit={handleSubmit} autoComplete="on">
            <label className="field">
              <span>ФИО</span>
              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ваше имя и фамилия"
                required
              />
            </label>

            <div className="field fieldWide">
              <span>Алкогольные предпочтения</span>
              <div className="alcoholCheckboxes" role="group" aria-label="Алкогольные предпочтения">
                {alcoholOptions.map((option) => (
                  <label key={option} className="checkboxLabel">
                    <input
                      type="checkbox"
                      name="alcohol"
                      value={option}
                      checked={formData.alcohol.includes(option)}
                      onChange={() => handleAlcoholToggle(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="field fieldWide">
              <span>Аллергии</span>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows="4"
                placeholder="Если есть аллергии или ограничения по продуктам, пожалуйста, укажите"
              />
            </label>

            <button
              className={`primaryButton submitButton ${submitState === 'loading' ? 'isLoading' : ''}`}
              type="submit"
              disabled={submitState === 'loading'}
            >
              {submitState === 'loading' ? 'Отправляем...' : 'Отправить ответ и подтвердить присутствие'}
            </button>

            {submitMessage && (
              <p className={`statusNote statusNote${capitalize(submitState)}`} aria-live="polite">
                {submitMessage}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}

function fillPhotos(photos, minimumCount) {
  if (photos.length === 0) {
    return fallbackPhotos.slice(0, minimumCount)
  }

  const result = [...photos]
  let repeatIndex = 0

  while (result.length < minimumCount) {
    result.push(photos[repeatIndex % photos.length])
    repeatIndex += 1
  }

  return result.slice(0, minimumCount)
}

function findPhotoByPath(photos, query) {
  return photos.find((photo) => photo.path.toLowerCase().includes(query.toLowerCase()))
}

function getPhotoAlt(path, index) {
  const normalizedPath = path.toLowerCase()

  if (normalizedPath.includes('жених')) {
    return 'Портрет жениха'
  }

  if (normalizedPath.includes('невест')) {
    return 'Портрет невесты'
  }

  return `Свадебная фотография ${index + 1}`
}

function getImageStyle(image) {
  return image ? { backgroundImage: `url("${image}")` } : undefined
}

async function sendTelegramMessage(message) {
  try {
    const response = await fetch('/api/telegram-rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: message }),
    })

    if (!response.ok) {
      return { ok: false }
    }

    return { ok: true }
  } catch {
    return { ok: false }
  }
}

async function openTelegramFallback(message) {
  const copied = await copyToClipboard(message)
  const telegramUrl = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`

  try {
    const openedWindow = window.open(telegramUrl, '_blank', 'noopener,noreferrer')

    if (!openedWindow) {
      window.location.href = telegramUrl
    }

    return { ok: true, copied }
  } catch {
    return { ok: false, copied }
  }
}

async function copyToClipboard(text) {
  if (!navigator.clipboard?.writeText) {
    return false
  }

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function buildTelegramMessage(formData) {
  return [
    `${coupleSignature}`,
    '',
    'Новый ответ гостя:',
    `ФИО: ${formData.fullName || 'не указано'}`,
    `Алкогольные предпочтения: ${Array.isArray(formData.alcohol) && formData.alcohol.length > 0 ? formData.alcohol.join(', ') : 'не указано'}`,
    `Аллергии: ${formData.allergies || 'не указано'}`,
  ].join('\n')
}

function capitalize(value) {
  if (!value || value === 'idle') {
    return ''
  }

  return value[0].toUpperCase() + value.slice(1)
}

function GlassPhoto({ photo, className = '', decorative = false }) {
  return (
    <div className={`${className} ${photo.src ? '' : 'isFallback'}`.trim()}>
      {photo.src ? (
        <img alt={decorative ? '' : photo.alt} src={photo.src} loading="lazy" />
      ) : (
        <div className="glassPhotoPlaceholder" aria-hidden="true" />
      )}
    </div>
  )
}

function PhotoMarquee({ photos }) {
  return (
    <div className="photoMarquee" role="img" aria-label="Фотографии пары">
      <div className="photoMarqueeTrack">
        {[0, 1].map((groupIndex) => (
          <div className="photoMarqueeGroup" key={`photo-group-${groupIndex}`} aria-hidden={groupIndex === 1}>
            {photos.map((photo, index) => (
              <GlassPhoto
                photo={photo}
                className="glassPhoto marqueePhoto"
                key={`marquee-photo-${groupIndex}-${index}`}
                decorative
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function IconShell({ children }) {
  return <span className="iconShell">{children}</span>
}

function PlaceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21C16.5 16.8 18.75 13.45 18.75 10.25A6.75 6.75 0 1 0 5.25 10.25C5.25 13.45 7.5 16.8 12 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10.25" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function TimeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7.75V12L14.75 13.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CoordinatorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12C14.2782 12 16.125 10.1532 16.125 7.875C16.125 5.59682 14.2782 3.75 12 3.75C9.72182 3.75 7.875 5.59682 7.875 7.875C7.875 10.1532 9.72182 12 12 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5.25 19.5C6.27987 16.9336 8.78155 15.375 12 15.375C15.2185 15.375 17.7201 16.9336 18.75 19.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BottleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.75 4.5H14.25M10.5 4.5V7.5L8.25 10.5V18.75C8.25 19.5784 8.92157 20.25 9.75 20.25H14.25C15.0784 20.25 15.75 19.5784 15.75 18.75V10.5L13.5 7.5V4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.5 12.75H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default App
