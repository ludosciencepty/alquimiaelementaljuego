import React, { useState, useEffect } from 'react'
import MainMenu    from './pages/MainMenu'
import DeckBuilder from './pages/DeckBuilder'
import DeckSelector from './pages/DeckSelector'
import CoinFlip    from './components/CoinFlip'
import GameBoard   from './components/GameBoard'
import { loadAllCards, loadDecks, saveDeck, deleteDeck, instantiate, shuffle } from './utils/cardUtils'

// SCREENS
const SCREEN = {
  MENU:     'menu',
  BUILDER:  'builder',
  SELECT:   'select',    // pick a deck
  COINFLIP: 'coinflip',  // coin toss before battle
  BATTLE:   'battle',
}

export default function App() {
  const [screen,  setScreen]  = useState(SCREEN.MENU)
  const [allCards, setAllCards] = useState([])
  const [decks, setDecks]     = useState([])
  const [editingDeck, setEditingDeck] = useState(null)  // null = new deck
  const [battleDeck, setBattleDeck]   = useState(null)  // deck chosen for battle
  const [playerFirst, setPlayerFirst] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // Load cards + saved decks on mount
  useEffect(() => {
    loadAllCards()
      .then(cards => {
        // Assign stable _id if not present
        const withIds = cards.map((c, i) => ({
          ...c,
          _id: c._id || `c${i}`,
        }))
        setAllCards(withIds)
        setDecks(loadDecks())
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load cards:', err)
        setLoadError('No se pudieron cargar las cartas. Asegúrate de que los archivos CSV estén en /public/')
        setLoading(false)
      })
  }, [])

  // ── NAVIGATION ────────────────────────────────────────────────────────────
  function goMenu()    { setScreen(SCREEN.MENU);    setEditingDeck(null) }
  function goBuilder(deck = null) { setEditingDeck(deck); setScreen(SCREEN.BUILDER) }
  function goSelect()  { setScreen(SCREEN.SELECT) }

  function handleDeckSaved(deck) {
    const updated = saveDeck(deck)
    setDecks(updated)
    // Stay in builder so user can keep editing
  }

  function handleDeckDeleted(deckId) {
    const updated = deleteDeck(deckId)
    setDecks(updated)
  }

  function handleDeckSelected(deck) {
    // Deck chosen — go to coin flip
    setBattleDeck(deck)
    setScreen(SCREEN.COINFLIP)
  }

  function handleCoinResult(goFirst) {
    setPlayerFirst(goFirst)
    setScreen(SCREEN.BATTLE)
  }

  // Build player deck instances from saved card definitions
  const playerDeckInstances = battleDeck
    ? shuffle(battleDeck.cards.map(c => instantiate(c)))
    : []

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) return <LoadingScreen />
  if (loadError) return <ErrorScreen message={loadError} />

  return (
    <>
      <GlobalStyles />

      {screen === SCREEN.MENU && (
        <MainMenu
          onPlay={goSelect}
          onSelectDeck={goSelect}
          onDeckBuilder={() => goBuilder(null)}
        />
      )}

      {screen === SCREEN.SELECT && (
        <DeckSelector
          decks={decks}
          onSelect={handleDeckSelected}
          onCreateNew={(deck) => goBuilder(deck || null)}
          onDelete={handleDeckDeleted}
        />
      )}

      {screen === SCREEN.BUILDER && (
        <DeckBuilder
          allCards={allCards}
          initialDeck={editingDeck}
          onBack={() => setScreen(decks.length > 0 ? SCREEN.SELECT : SCREEN.MENU)}
          onSaved={handleDeckSaved}
        />
      )}

      {screen === SCREEN.COINFLIP && (
        <CoinFlip onDecided={handleCoinResult} />
      )}

      {screen === SCREEN.BATTLE && battleDeck && (
        <GameBoard
          playerDeck={playerDeckInstances}
          playerGoesFirst={playerFirst}
          onExit={goMenu}
        />
      )}
    </>
  )
}

// ── LOADING SCREEN ────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      position:'fixed', inset:0,
      background:'linear-gradient(160deg,#0e0905,#080502)',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:20,
    }}>
      <div style={{ fontFamily:"'Uncial Antiqua',cursive", fontSize:'2.5rem', color:'#c8a060',
        animation:'titleGlow 1.5s ease-in-out infinite' }}>
        Compound
      </div>
      <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:'italic',
        fontSize:14, color:'#7a6848', animation:'textPulse .8s ease-in-out infinite' }}>
        Invocando el conocimiento arcano…
      </div>
      <style>{`
        @keyframes titleGlow{0%,100%{opacity:.7}50%{opacity:1}}
        @keyframes textPulse{0%,100%{opacity:.4}50%{opacity:1}}
      `}</style>
    </div>
  )
}

// ── ERROR SCREEN ──────────────────────────────────────────────────────────
function ErrorScreen({ message }) {
  return (
    <div style={{
      position:'fixed', inset:0,
      background:'linear-gradient(160deg,#0e0905,#080502)',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:16,
      padding:24,
    }}>
      <div style={{ fontSize:40 }}>⚠️</div>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:16, color:'#e8c060', textAlign:'center' }}>
        Error al cargar
      </div>
      <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:'italic',
        fontSize:13, color:'#a09070', textAlign:'center', maxWidth:400 }}>
        {message}
      </div>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:11, color:'#7a6848',
        marginTop:8, textAlign:'center', lineHeight:1.8 }}>
        Coloca estos archivos en <code style={{color:'#c8a060'}}>/public/</code>:<br/>
        personajes.csv · especiales.csv · energias.csv<br/>
        Imágenes en <code style={{color:'#c8a060'}}>/public/cards/</code><br/>
        Íconos de estado en <code style={{color:'#c8a060'}}>/public/estado/</code>
      </div>
    </div>
  )
}

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }
      html, body { height:100%; overflow:hidden; background:#0e0905; color:#e8d4b8 }

      @import url('https://fonts.googleapis.com/css2?family=Uncial+Antiqua&family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&family=Philosopher:ital,wght@0,400;0,700;1,400&display=swap');

      ::-webkit-scrollbar { width:5px; height:5px }
      ::-webkit-scrollbar-track { background:#0e0905 }
      ::-webkit-scrollbar-thumb { background:#3a2510; border-radius:3px }
      ::-webkit-scrollbar-thumb:hover { background:#5a3a1a }

      button:hover { filter:brightness(1.15) }

      @keyframes alchPulse {
        0%,100% { box-shadow:0 0 8px rgba(200,160,60,.25),inset 0 0 8px rgba(200,160,60,.04) }
        50%      { box-shadow:0 0 24px rgba(200,160,60,.55),0 0 48px rgba(200,160,60,.18),inset 0 0 14px rgba(200,160,60,.08) }
      }
      @keyframes textPulse {
        0%,100%{opacity:1}50%{opacity:.35}
      }
    `}</style>
  )
}
