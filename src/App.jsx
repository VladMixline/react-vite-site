import './App.css'

const features = [
  {
    title: 'Быстрый старт',
    description: 'React и Vite уже настроены, поэтому можно сразу переходить к дизайну и контенту.',
  },
  {
    title: 'Удобное развитие',
    description: 'Горячая перезагрузка поможет быстро проверять каждое изменение в интерфейсе.',
  },
  {
    title: 'Автосохранение в GitHub',
    description: 'После настройки репозитория изменения будут автоматически коммититься и отправляться на GitHub.',
  },
]

const steps = [
  'Менять блоки и стили по новым запросам.',
  'Добавлять страницы, компоненты и формы.',
  'Собирать проект для публикации командой npm run build.',
]

function App() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">React + Vite</p>
        <h1>Сайт готов к развитию</h1>
        <p className="lead">
          Это стартовый проект, который можно быстро превратить в лендинг, портфолио,
          сайт услуг или интернет-витрину.
        </p>
        <div className="actions">
          <a className="primaryAction" href="#next-steps">
            Следующие шаги
          </a>
          <a
            className="secondaryAction"
            href="https://vite.dev/guide/"
            target="_blank"
            rel="noreferrer"
          >
            Документация Vite
          </a>
        </div>
      </section>

      <section className="featureGrid">
        {features.map((feature) => (
          <article className="featureCard" key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="nextSteps" id="next-steps">
        <div>
          <p className="sectionLabel">Что можно делать дальше</p>
          <h2>Проект подготовлен для дальнейших запросов на изменение сайта</h2>
        </div>
        <ol>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  )
}

export default App
