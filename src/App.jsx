import { useState } from 'react'
import './App.css'

const venueAddress = 'Тамбов, ул. Маршала Малиновского, 39'
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(venueAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`
const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueAddress)}`

const heroPhotos = [
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    alt: 'Нежная свадебная атмосфера с парой в теплых оттенках',
  },
  {
    src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80',
    alt: 'Романтичная пара в изящной свадебной съемке',
  },
]

const eventDetails = [
  {
    title: 'Город',
    value: 'Тамбов',
    caption: 'Теплый вечер, который нам особенно хочется разделить именно здесь.',
    Icon: PlaceIcon,
  },
  {
    title: 'Площадка',
    value: 'банкетный зал PLES',
    caption: 'Элегантное пространство с торжественной атмосферой и уютной welcome-зоной.',
    Icon: VenueIcon,
  },
  {
    title: 'Время',
    value: 'к 16:00',
    caption: 'Будем рады, если вы приедете чуть заранее, чтобы спокойно погрузиться в праздник.',
    Icon: TimeIcon,
  },
]

const paletteColors = [
  { name: 'Глубокий изумруд', tone: '#173f37', description: 'главный акцент вечера' },
  { name: 'Теплый шоколад', tone: '#4f352a', description: 'благородная глубина' },
  { name: 'Кофейный', tone: '#7a5947', description: 'мягкий и уютный нюанс' },
  { name: 'Молочно-бежевый', tone: '#efe4d4', description: 'воздух и деликатность' },
  { name: 'Шампань', tone: '#dcc7a2', description: 'легкое праздничное сияние' },
  { name: 'Светлое золото', tone: '#c9a96b', description: 'аккуратный теплый блеск' },
]

const initialFormState = {
  fullName: '',
  taste: '',
  allergies: '',
  alcohol: '',
}

function App() {
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
        <div className="heroBackdrop" />
        <div className="heroContainer">
          <div className="heroContent surfaceCard">
            <p className="sectionTag">Wedding Invitation</p>
            <div className="heroDivider" aria-hidden="true" />
            <p className="heroGreeting">Дорогие родные и друзья,</p>
            <h1>
              С любовью приглашаем вас разделить с нами день, который навсегда станет
              частью нашей семейной истории.
            </h1>
            <p className="heroText">
              Нам очень хочется, чтобы этот вечер был наполнен тихой красотой, искренними
              улыбками, объятиями и ощущением теплого семейного праздника. Будем
              счастливы видеть вас рядом в момент, когда мы скажем друг другу самое
              важное &quot;да&quot;.
            </p>

            <div className="heroMeta">
              <span>Тамбов</span>
              <span>банкетный зал PLES</span>
              <span>сбор гостей к 16:00</span>
            </div>

            <div className="heroActions">
              <a className="primaryButton" href="#details">
                Смотреть приглашение
              </a>
              <a className="secondaryButton" href="#rsvp">
                Анкета гостя
              </a>
            </div>
          </div>

          <div className="heroFrames" aria-hidden="true">
            {heroPhotos.map((photo, index) => (
              <div
                className={`photoFrame ${index === 0 ? 'photoFrameLarge' : 'photoFrameSmall'}`}
                key={photo.src}
              >
                <img src={photo.src} alt={photo.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionShell" id="details">
        <div className="sectionHeader">
          <p className="sectionTag">Приглашение</p>
          <h2 className="sectionTitle">
            Мы будем счастливы провести этот вечер рядом с самыми дорогими людьми
          </h2>
          <p className="sectionText">
            Этот день мы представляем очень теплым, красивым и по-настоящему семейным.
            Все самое важное собрали для вас в одной торжественной и легкой по настроению
            секции.
          </p>
        </div>

        <div className="detailGrid">
          {eventDetails.map(({ title, value, caption, Icon }) => (
            <article className="detailCard surfaceCard" key={title}>
              <IconShell>
                <Icon />
              </IconShell>
              <p className="detailLabel">{title}</p>
              <h3>{value}</h3>
              <p>{caption}</p>
            </article>
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
              Ирина поможет сориентироваться на площадке, проводит вас в welcome-зону и
              подскажет все необходимое, чтобы начало вечера было максимально легким,
              спокойным и приятным.
            </p>
          </div>
        </div>
      </section>

      <section className="sectionShell">
        <div className="sectionHeader">
          <p className="sectionTag">Карта</p>
          <h2 className="sectionTitle">Как добраться до площадки</h2>
          <p className="sectionText">
            Мы отметили место на карте, чтобы дорога до свадьбы была простой и
            комфортной. Ниже можно сразу открыть маршрут.
          </p>
        </div>

        <div className="mapLayout">
          <div className="mapFrame surfaceCard">
            <iframe
              title="Карта площадки PLES"
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <aside className="mapAside surfaceCard">
            <p className="mapVenue">PLES</p>
            <h3>{venueAddress}</h3>
            <p className="mapText">
              Площадка находится в Тамбове, в элегантном пространстве банкетного зала
              PLES. Лучше всего открыть маршрут заранее и прибыть к welcome-зоне без
              спешки.
            </p>

            <div className="mapActions">
              <a className="primaryButton" href={routeUrl} target="_blank" rel="noreferrer">
                Построить маршрут
              </a>
              <a
                className="secondaryButton"
                href={mapEmbedUrl.replace('&output=embed', '')}
                target="_blank"
                rel="noreferrer"
              >
                Открыть карту
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="sectionShell">
        <div className="sectionHeader">
          <p className="sectionTag">Dress Code</p>
          <h2 className="sectionTitle">Нежная палитра для красивой общей атмосферы</h2>
          <p className="sectionText">
            Нам будет особенно приятно, если ваши образы поддержат теплое настроение
            вечера и сохранят ощущение благородной романтичной эстетики.
          </p>
        </div>

        <div className="dressLayout">
          <div className="paletteArtwork">
            <div className="paletteCard">
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

          <div className="dressNote surfaceCard">
            <p className="sectionTag">Подсказка по образам</p>
            <h3>Лаконично, благородно, мягко</h3>
            <p>
              Выбирайте спокойные природные оттенки, струящиеся ткани, матовые текстуры и
              деликатные аксессуары. Лучше всего подойдут глубокие зеленые, шоколадные,
              бежевые, молочные и приглушенно-золотистые нюансы.
            </p>
            <ul className="dressList">
              <li>изумрудный, хвойный и лесной зеленый</li>
              <li>шоколадный, кофейный и карамельный</li>
              <li>молочный, шампань, теплый беж</li>
            </ul>
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
            Нам будет очень приятно сохранить этот жест как теплое и красивое воспоминание
            о нашем празднике.
          </p>
        </div>
      </section>

      <section className="sectionShell" id="rsvp">
        <div className="formLayout">
          <div className="formIntro">
            <p className="sectionTag">Финальный блок</p>
            <h2 className="sectionTitle">
              Небольшая анкета, чтобы мы с любовью позаботились о каждом госте
            </h2>
            <p className="sectionText">
              Пожалуйста, заполните форму ниже. Так нам будет легче продумать меню,
              напитки и общую атмосферу вечера с вниманием к вашим пожеланиям.
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
                placeholder="Например: предпочитаю рыбу, люблю легкие закуски, не ем острое"
              />
            </label>

            <label className="field fieldWide">
              <span>Аллергии</span>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows="4"
                placeholder="Если есть аллергии или продукты-исключения, пожалуйста, укажите их"
              />
            </label>

            <label className="field fieldWide">
              <span>Алкогольные предпочтения</span>
              <select name="alcohol" value={formData.alcohol} onChange={handleChange}>
                <option value="">Выберите вариант</option>
                <option value="Игристое">Игристое</option>
                <option value="Вино">Вино</option>
                <option value="Легкие коктейли">Легкие коктейли</option>
                <option value="Безалкогольные напитки">Безалкогольные напитки</option>
                <option value="Не употребляю алкоголь">Не употребляю алкоголь</option>
              </select>
            </label>

            <button className="primaryButton submitButton" type="submit">
              Отправить ответ
            </button>

            {isSubmitted && (
              <p className="successNote">
                Спасибо. Форма бережно заполнена, и при следующем шаге сюда можно
                подключить реальную отправку ответов.
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
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
