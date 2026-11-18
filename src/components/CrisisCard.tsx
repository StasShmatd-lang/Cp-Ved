import type { Crisis } from '../data/crises'
import { SEGMENT_COLORS } from '../data/crises'

type Props = {
  crisis: Crisis
  visible: boolean
}

export function CrisisCard({ crisis, visible }: Props) {
  const accent = SEGMENT_COLORS[(crisis.id - 1) % SEGMENT_COLORS.length]

  return (
    <article
      className={`crisis-card ${visible ? 'is-visible' : ''}`}
      style={{ ['--card-accent' as string]: accent }}
      aria-live="polite"
    >
      <header className="crisis-card__head">
        <span className="crisis-card__tag">Карточка ЧП · {crisis.id}/11</span>
        <h2 className="crisis-card__title">{crisis.title}</h2>
      </header>
      <ol className="crisis-card__steps">
        {crisis.steps.map((step, i) => (
          <li key={i}>
            <span className="crisis-card__num">{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </article>
  )
}
