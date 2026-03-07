import { useState } from 'react'
import './App.css'

const backImages = Object.values(
  import.meta.glob('./back/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}', {
    eager: true,
    import: 'default',
  }),
)

const mainImages = Object.values(
  import.meta.glob('./fotos/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}', {
    eager: true,
    import: 'default',
  }),
)

const venueAddress = 'Тамбов, ул. Маршала Малиновского, 39'
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(venueAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`
const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueAddress)}`
const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`

const photoCaptions = [
  'нежный свет',
  'тихая радость',
  'объятия',
  'уютный вечер',
  'искренние улыбки',
  'семейное тепло',
]

const fallbackPhotos = [
  { src: null, alt: '', caption: 'мягкий свет' },
  { src: null, alt: '', caption: 'спокойная нежность' },
  { src: null, alt: '', caption: 'атмосфера вечера' },
  { src: null, alt: '', caption: 'теплые воспоминания' },
  { src: null, alt: '', caption: 'красивые детали' },
  { src: null, alt: '', caption: 'романтичный акцент' },
]

const eventDetails = [
  {
    title: 'Город',
    value: 'Тамбов',
    caption: 'Именно здесь пройдет наш долгожданный, красивый и очень теплый семейный вечер.',
    Icon: PlaceIcon,
  },
  {
    title: 'Площадка',
    value: 'банкетный зал PLES',
    caption: 'Стильное пространство с благородной атмосферой, где хочется неспешно праздновать и быть рядом.',
    Icon: VenueIcon,
  },
  {
    title: 'Время',
    value: 'к 16:00',
    caption: 'Будем рады, если вы приедете немного заранее, чтобы спокойно оказаться в welcome-зоне.',
    Icon: TimeIcon,
  },
]

const paletteColors = [
  { name: 'Глубокий шоколад', tone: '#3d291f', description: 'теплая и благородная база' },
  { name: 'Кофейный', tone: '#6b4a3a', description: 'деликатная глубина образа' },
  { name: 'Темный хаки', tone: '#68674d', description: 'спокойный природный акцент' },
  { name: 'Оливково-песочный', tone: '#8e8a65', description: 'мягкая природная нота' },
  { name: 'Молочно-бежевый', tone: '#ece2d2', description: 'воздух и свет в палитре' },
  { name: 'Шампань', tone: '#d9c39d', description: 'легкое праздничное сияние' },
]

const initialFormState = {
  fullName: '',
  taste: '',
  allergies: '',
  alcohol: '',
}

function App() {
  const galleryPhotos = fillPhotos(
    mainImages.map((src, index) => ({
      src,
      alt: `Свадебная фотография ${index + 1}`,
      caption: photoCaptions[index % photoCaptions.length],
    })),
    6,
  )

  const heroPhotos = galleryPhotos.slice(0, 3)
  const storyPhotos = galleryPhotos.slice(0, 4)
  const centerPhoto = backImages[0]
    ? { src: backImages[0], alt: 'Фото пары', caption: 'самый теплый кадр вечера' }
    : { src: null, alt: '', caption: 'самый теплый кадр вечера' }

  const [formData, setFormData] = useState(initialFormState)
  const [isSubmitted, setIsSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setIsSubmitted(false)
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitted(true)
    setFormData(initialFormState)
  }

  return (
    <main className="page">
      <section className="heroSection">
        <div className="heroPhotoLayer" aria-hidden="true">
          {heroPhotos.map((photo, index) => (
            <div
              className={`heroShot heroShot${index + 1} ${photo.src ? '' : 'isFallback'}`}
              key={`hero-${index + 1}`}
              style={getImageStyle(photo.src)}
            />
          ))}
        </div>
        <div className="heroOverlay" />

        <div className="heroInner">
          <div className="heroCard surfaceCard">
            <p className="sectionTag">Wedding Invitation</p>
            <div className="heroDivider" aria-hidden="true" />
            <p className="heroGreeting">Дорогие родные и друзья,</p>
            <h1>
              С любовью приглашаем вас стать частью нашего самого теплого и красивого
              дня.
            </h1>
            <p className="heroText">
              Нам очень хочется прожить этот вечер среди близких людей, в атмосфере
              нежности, семейного тепла и тихой торжественности. Будем счастливы, если вы
              разделите с нами этот важный момент и сохраните его в сердце вместе с нами.
            </p>

            <div className="heroMeta">
              <span>Тамбов</span>
              <span>банкетный зал PLES</span>
              <span>сбор гостей к 16:00</span>
            </div>

            <div className="heroActions">
              <a className="primaryButton" href="#details">
                Открыть приглашение
              </a>
              <a className="secondaryButton" href="#rsvp">
                Ответить на приглашение
              </a>
            </div>
          </div>

          <div className="portraitColumn">
            <div className="portraitHalo" aria-hidden="true" />
            <div className={`portraitFrame ${centerPhoto.src ? '' : 'isFallback'}`}>
              {centerPhoto.src ? (
                <img src={centerPhoto.src} alt={centerPhoto.alt} className="portraitImage" />
              ) : (
                <div className="portraitPlaceholder">
                  <span>ваш теплый кадр</span>
                </div>
              )}
            </div>
            <p className="portraitCaption">{centerPhoto.caption}</p>
          </div>
        </div>
      </section>

      <section className="sectionShell" id="details">
        <div className="sectionHeader">
          <p className="sectionTag">Приглашение</p>
          <h2 className="sectionTitle">В этот день для нас особенно важно быть рядом с вами</h2>
          <p className="sectionText">
            Мы мечтаем о вечере, наполненном теплом, искренними улыбками и красивой,
            спокойной атмосферой. Ниже собрали все основные детали, чтобы вам было удобно
            и приятно готовиться к празднику.
          </p>
        </div>

        <div className="detailGrid">
          {eventDetails.map((detail) => {
            const DetailIcon = detail.Icon

            return (
              <article className="detailCard surfaceCard" key={detail.title}>
                <IconShell>
                  <DetailIcon />
                </IconShell>
                <p className="detailLabel">{detail.title}</p>
                <h3>{detail.value}</h3>
                <p>{detail.caption}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="sectionShell">
        <div className="sectionHeader sectionHeaderCompact">
          <p className="sectionTag">Атмосфера дня</p>
          <h2 className="sectionTitle">Фотографии, которые бережно поддерживают настроение приглашения</h2>
          <p className="sectionText">
            Основную визуальную часть мы оформили так, чтобы кадры мягко раскрывали
            настроение дня: теплое, благородное, современное и очень личное.
          </p>
        </div>

        <div className="storyGrid">
          {storyPhotos.map((photo, index) => (
            <figure
              className={`storyCard storyCard${index + 1} ${photo.src ? '' : 'isFallback'}`}
              key={`story-${index + 1}`}
            >
              {photo.src ? (
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              ) : (
                <div className="storyPlaceholder" aria-hidden="true" />
              )}
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="sectionShell">
        <div className="coordinatorCard surfaceCard">
          <IconShell>
            <CoordinatorIcon />
          </IconShell>

          <div className="coordinatorText">
            <p className="sectionTag">Организационная информация</p>
            <h2 className="sectionTitle sectionTitleCompact">
              По прибытии вас встретит координатор Ирина
            </h2>
            <p className="sectionText">
              Ирина проводит вас в welcome-зону, поможет легко сориентироваться на
              площадке и подскажет все необходимое, чтобы начало вечера было спокойным,
              комфортным и по-настоящему заботливым.
            </p>
          </div>
        </div>
      </section>

      <section className="sectionShell">
        <div className="mapLayout">
          <div className="mapCopy">
            <p className="sectionTag">Карта площадки</p>
            <h2 className="sectionTitle">Красивый вечер начинается с легкой дороги</h2>
            <p className="sectionText">
              Мы отметили место проведения на карте, чтобы вы могли заранее открыть
              маршрут и приехать к нам без лишней спешки. Место встречи: банкетный зал
              PLES, Тамбов.
            </p>

            <div className="mapAside surfaceCard">
              <p className="mapVenue">PLES</p>
              <h3>{venueAddress}</h3>
              <p className="mapText">
                По приезде вас встретит координатор и проводит в welcome-зону, где можно
                будет расслабиться, обменяться первыми объятиями и настроиться на вечер.
              </p>

              <div className="mapActions">
                <a className="primaryButton" href={routeUrl} target="_blank" rel="noreferrer">
                  Построить маршрут
                </a>
                <a className="secondaryButton" href={mapUrl} target="_blank" rel="noreferrer">
                  Открыть карту
                </a>
              </div>
            </div>
          </div>

          <div className="mapFrame surfaceCard">
            <iframe
              title="Карта площадки PLES"
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="sectionShell">
        <div className="dressLayout">
          <div className="dressCopy">
            <p className="sectionTag">Dress Code</p>
            <h2 className="sectionTitle">Шоколадно-хаки палитра с мягкими светлыми акцентами</h2>
            <p className="sectionText">
              Нам будет особенно приятно, если ваши образы поддержат атмосферу вечера:
              спокойную, уютную, романтичную и благородную. Лучше всего подойдут теплые
              природные оттенки и мягкие фактуры.
            </p>

            <div className="dressNote surfaceCard">
              <h3>Подсказка по настроению образа</h3>
              <p>
                Выбирайте лаконичные силуэты, струящиеся ткани, матовые фактуры и
                спокойные цвета: шоколадный, кофейный, хаки, оливковый, молочный и шампань.
              </p>
              <ul className="dressList">
                <li>шоколадный и кофейный</li>
                <li>хаки, оливковый, приглушенный зеленый</li>
                <li>молочный, бежевый, шампань</li>
              </ul>
            </div>
          </div>

          <div className="paletteCard surfaceCard">
            <p className="paletteLabel">Рекомендуемая палитра</p>
            <div className="paletteGrid">
              {paletteColors.map((color) => (
                <article className="paletteSwatch" key={color.name}>
                  <span className="swatchTone" style={{ backgroundColor: color.tone }} />
                  <strong>{color.name}</strong>
                  <span>{color.description}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sectionShell">
        <div className="wishCard surfaceCard">
          <IconShell>
            <BottleIcon />
          </IconShell>
          <p className="sectionTag">Пожелание</p>
          <blockquote>
            «Если вы захотите порадовать нас приятным комплиментом, вместо цветов мы с
            радостью примем бутылочку вина или шампанского».
          </blockquote>
          <p className="wishText">
            Нам очень хочется, чтобы каждый жест в этот день был теплым, искренним и
            по-настоящему душевным.
          </p>
        </div>
      </section>

      <section className="sectionShell" id="rsvp">
        <div className="formLayout">
          <div className="formIntro">
            <p className="sectionTag">Форма для гостей</p>
            <h2 className="sectionTitle">Небольшой опрос, чтобы мы с любовью продумали все детали</h2>
            <p className="sectionText">
              Пожалуйста, заполните форму ниже. Так нам будет легче позаботиться о меню,
              напитках и вашем комфорте с особым вниманием и теплом.
            </p>
          </div>

          <form className="rsvpForm surfaceCard" onSubmit={handleSubmit}>
            <label className="field fieldWide">
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

            <label className="field fieldWide">
              <span>Вкусовые предпочтения</span>
              <textarea
                name="taste"
                value={formData.taste}
                onChange={handleChange}
                rows="4"
                placeholder="Например: люблю рыбу, предпочитаю легкие блюда, не ем острое"
              />
            </label>

            <label className="field fieldWide">
              <span>Аллергии</span>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows="4"
                placeholder="Если есть аллергии или важные ограничения по продуктам, пожалуйста, укажите"
              />
            </label>

            <label className="field fieldWide">
              <span>Алкогольные предпочтения</span>
              <select name="alcohol" value={formData.alcohol} onChange={handleChange}>
                <option value="">Выберите вариант</option>
                <option value="Игристое">Игристое</option>
                <option value="Вино">Вино</option>
                <option value="Коктейли">Коктейли</option>
                <option value="Безалкогольные напитки">Безалкогольные напитки</option>
                <option value="Не употребляю алкоголь">Не употребляю алкоголь</option>
              </select>
            </label>

            <button className="primaryButton submitButton" type="submit">
              Отправить ответ
            </button>

            {isSubmitted && (
              <p className="successNote">
                Спасибо. Ответ аккуратно сохранен в форме интерфейса; при желании следующим
                шагом можно подключить отправку в Telegram, почту или Google Sheets.
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}

function fillPhotos(photos, minimumCount) {
  const result = [...photos]
  let fallbackIndex = 0

  while (result.length < minimumCount) {
    const fallbackPhoto = fallbackPhotos[fallbackIndex % fallbackPhotos.length]
    result.push({
      ...fallbackPhoto,
      caption: fallbackPhoto.caption,
    })
    fallbackIndex += 1
  }

  return result.slice(0, minimumCount)
}

function getImageStyle(image) {
  return image ? { backgroundImage: `url("${image}")` } : undefined
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

function VenueIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 20.25H19.5M6 20.25V8.25L12 4.5L18 8.25V20.25M9 11.25H9.75M14.25 11.25H15M9 14.25H9.75M14.25 14.25H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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
