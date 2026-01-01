export function Header() {
  return (
    <header className="py-4 sm:py-6 px-4 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary font-display leading-tight">
          <span className="text-euro-gold-dark">🇧🇬</span>{' '}
          <span className="text-lev-green">🇪🇺</span>
          <br />
          <span className="bg-gradient-to-r from-lev-green to-euro-gold-dark bg-clip-text text-transparent">
            Ресто Калкулатор
          </span>
        </h1>
        <p className="mt-1.5 sm:mt-2 text-text-secondary text-sm sm:text-base md:text-lg">
          Плащате в лева, получавате ресто в евро?
          <br />
          Изчислете лесно!
        </p>
      </div>
    </header>
  )
}

